import {BAUD_RATE, Connector, Driver} from '../interface';
import wait from '../lib/wait';
import BaseDriver from '../BaseDriver';
import debug from 'debug';
import SeqClass from '../SeqClass';
import MicroPythonBurnDataHandler from '../dataHandler/MicroPythonBurnDataHandler';
import {
    CMD_PUT_SEQUCNES,
    MAIN_PY,
    MP_CTRL_A,
    MP_CTRL_B,
    MP_CTRL_C,
    MP_CTRL_D,
    MP_LINE,
    MP_RETURN,
    MP_WAIT_01,
    MP_WAIT_02_04,
    MP_WAITING_INTERVAL,
    MP_WAITING_SOFT_REBOOT
} from '../burnConstance';

const logger = debug('esp32Driver');
// logger.log = console.log.bind(console);

const ESP32_BAUD_RATE = 115200;
const BURN_ESP32_PAGESIZE = 50;

const formatError = (ErrorType: any, message: string) => {
    return new ErrorType(`${message}`);
};

const burnError = formatError(Error, 'burn error');

const makeFrame = (data: number | number[]) => {
    let sendData: number[];
    if (Array.isArray(data)) {
        sendData = [...data];
    } else {
        sendData = [data];
    }
    return new Uint8Array(sendData);
};

abstract class FingerEsp32 extends BaseDriver implements Driver {
    // @ts-ignore
    public readonly name: string;
    // @ts-ignore
    public readonly type: 'serialport';
    // @ts-ignore
    protected port: Connector;
    protected waitingInterval: number = MP_WAITING_INTERVAL;
    protected waitingSoftReboot: number = MP_WAITING_SOFT_REBOOT;

    private burnSyncCount: number = 0;
    private readonly seq = new SeqClass();

    public async open(baudRate?: BAUD_RATE): Promise<any> {
    }

    public async close(): Promise<any> {
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
    }

    public async setBaudRate(baudRate: BAUD_RATE) {
    }

    protected onData = (data: Uint8Array) => {
        // @ts-ignore
        this.emit('data', [...data]);
    };

    protected onCloseHandel() {
        this.emit('close');
    }

    private async sendBurn(data: number[] = [], withoutResponse: boolean = false): Promise<number[]> {
        return await this.seq.seqDo<number[]>(async () => {
            const frame = makeFrame(data);
            logger('sendBurn write', Buffer.from(frame).toString());
            const results = await this.port.send(frame, withoutResponse);
            logger('sendBurn read', Buffer.from(results).toString());
            // @ts-ignore
            return [...results];
        });
    }

    public async send(data: number[] = [], withoutResponse: boolean = true): Promise<number[]> {
        return await this.seq.seqDo<number[]>(async () => {
            const frame = makeFrame(data);
            logger('send write', Buffer.from(frame));
            const results = await this.port.send(frame, withoutResponse);
            logger('send read', Buffer.from(results));
            // @ts-ignore
            return [...results];
        });
    }

    genCodeArrayString = (data: Buffer) => {
        let page = 0;
        const total = data.length;
        let pageSize = BURN_ESP32_PAGESIZE;

        const ret = [];

        while (page < total) {
            let writeBytes = data.slice(page, (total > (page + pageSize) ? (page + pageSize) : total));
            // @ts-ignore
            let codeStr = [...Buffer.from(writeBytes)].toString();
            ret.push(codeStr);
            page = page + pageSize;
        }

        // logger('genCodeString ret', ret)
        return ret
    };

    async enterRawRepl() {
        await this.sendBurn([MP_RETURN, MP_CTRL_C]);   // '\x01'
        await wait(this.waitingInterval);

        const syncResponse = await this.sendBurn([MP_CTRL_A]);   // '\x01'
        await wait(this.waitingInterval);

        const ret = syncResponse ? syncResponse.join('').toString() : '';
        if (!ret.endsWith(MP_WAIT_01)) {
            throw burnError;
        }
        return ret
    }

    async exitRawRepl() {
        const syncResponse = await this.sendBurn([MP_CTRL_B]);   // '\x02'
        await wait(this.waitingInterval); // 10 ms

        const ret = syncResponse ? syncResponse.join('').toString() : '';
        if (!ret.endsWith(MP_WAIT_02_04) ||
            ret.includes('invalid syntax')) {
            throw burnError;
        }
    }

    async softReboot() {
        const syncResponse = await this.sendBurn([MP_RETURN, MP_CTRL_D, MP_LINE]);   // '\r\x04\n'
        await wait(this.waitingSoftReboot); // 10 ms

        const ret = syncResponse ? syncResponse.join('').toString() : '';
        if (!ret.endsWith(MP_WAIT_02_04)) {
            throw burnError;
        }
    }

    async sendRawNoFollow(data: string = '') {
        // @ts-ignore
        const sent = [...Buffer.from(data)];
        // logger('sendRawNoFollow', sent.toString(), Buffer.from(sent).toString())

        await this.sendBurn(sent, true);
        await wait(this.waitingInterval); // 10 ms
    }

    async putFile(data: Buffer, progressHandle?: (progress: number) => void) {
        let page = 0;
        const total = data.length;
        let pageSize = BURN_ESP32_PAGESIZE;

        const putMainCmds = CMD_PUT_SEQUCNES(MAIN_PY);
        const codeDataArray = this.genCodeArrayString(data);

        await this.sendRawNoFollow(putMainCmds[0]);

        codeDataArray.forEach(async codeStr => {
            const sent = '\t' + codeStr + ', \n';
            await this.sendRawNoFollow(sent);

            if (progressHandle) {
                progressHandle(Math.round((page / total) * 100));
            }
            page = page + pageSize;
        });

        let i: number;
        for (i = 1; i < putMainCmds.length; i++) {
            await this.sendRawNoFollow(putMainCmds[i]);
        }
    }

    async follow() {
        const syncResponse = await this.sendBurn([MP_CTRL_D, MP_LINE]);
        await wait(this.waitingInterval); // 10 ms

        const ret = syncResponse ? syncResponse.join('').toString() : '';
        if (!ret.endsWith('OK')) {
            throw burnError;
        }
    }

    protected async startBurn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
        this.port.setDataHandle(MicroPythonBurnDataHandler);

        // @ts-ignore
        const data: Buffer = await dataHandle(null);
        // logger('startBurn', data, Buffer.from(data).toString());

        if (this.burnSyncCount >= 3) {
            this.burnSyncCount = 0;
            throw burnError;
        }
        let syncResponse;
        try {
            syncResponse = await this.enterRawRepl()
        } catch (e) {
            this.burnSyncCount++;
            return this.startBurn(dataHandle, progressHandle);
        }
        if (!syncResponse) {
            this.burnSyncCount++;
            return this.startBurn(dataHandle, progressHandle);
        }
        this.burnSyncCount = 0;

        await this.putFile(data, progressHandle);
        await this.follow();

        await this.exitRawRepl();

        if (progressHandle) {
            progressHandle(100);
        }

        await this.softReboot();
    }
}

export class FingerEsp32Driver extends FingerEsp32 implements Driver {
    public readonly name: string;

    protected readonly connectors: Connector[];
    // @ts-ignore
    protected port: Connector;
    protected baudRate: BAUD_RATE = ESP32_BAUD_RATE;

    constructor(name: string, connectors: Connector[]) {
        super();
        if (!Array.isArray(connectors) || connectors.length !== 1) {
            throw formatError(Error, 'argument "connectors" is not valid');
        }
        this.name = name;
        this.connectors = connectors;
    }

    protected onData = (data: Uint8Array) => {
        // @ts-ignore
        this.emit('data', [...data]);
    };

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
        logger('in esp32 burn');

        this.port.removeListener('data', this.onData);
        let error;
        try {
            await this.port.setDTR(false);
            await wait(200);
            await this.port.open(ESP32_BAUD_RATE);
            await this.port.setDTR(true);
            await wait(200);
            await this.startBurn(dataHandle, progressHandle);
        } catch (e) {
            error = e;
        }
        this.port.setDataHandle(undefined);
        await this.port.open(this.baudRate);
        this.port.on("data", this.onData);
        if (error) {
            throw error;
        }
    }

    public async setBaudRate(baudRate: BAUD_RATE) {
        await this.port.open(baudRate);
        this.baudRate = baudRate;
    }

    public async open(baudRate?: BAUD_RATE) {
        // @ts-ignore
        this.baudRate = baudRate;
        this.port = this.connectors[0];
        await this.port.open(baudRate);

        await this.port.setDTR(false);

        this.port.on("data", this.onData);
        this.port.once("close", () => {
            this.onCloseHandel();
        });
        this.emit("connected");
    }

    public async close(): Promise<any> {
        await this.port.close();
        this.onCloseHandel();
        this.port.removeAllListeners();
    }
}
