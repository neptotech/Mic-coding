import {BAUD_RATE, BleCharacteristic, BleConnector, Connector, Driver} from "../interface";
import SeqClass from "../SeqClass";
import BaseDriver from "../BaseDriver";
import baudRateFormat from "../lib/baudRateFormat";
import wait from "../lib/wait";
import {
    BURN_DEVICE_TYPE_CORE, BURN_DEVICE_TYPE_CORE_PAGESIZE,
    BURN_DEVICE_TYPE_CORE_PLUS,
    BURN_DEVICE_TYPE_CORE_PLUS_PAGESIZE,
    burnSetDevice,
    CRC_EOP,
    RESET, STK_ENTER_PROGMODE, STK_GET_SYNC, STK_LEAVE_PROGMODE,
    STK_LOAD_ADDRESS, STK_PROG_PAGE,
    STK_READ_SIGN, TYPE_CORE, TYPE_CORE_PLUS,
} from "../burnConstance";
import BurnDataHandler from "../dataHandler/BurnDataHandler";

const intelHex = require("intel-hex");

// ble
const SERVICE_UUID = "fff0";
const CHARACTERISTIC_UUID = "fff6";
const CHARACTERISTIC_UUID_RESET = "fff1";
const CHARACTERISTIC_UUID_BAUD_RATE = "fff2";

const BURN_BAUD_RATE = 115200;

const formatError = (ErrorType: any, message: string) => {
    return new ErrorType(`${message}`);
};

const burnError = formatError(Error, "burn error");

const makeFrame = (data: number | number[]) => {
    let sendData: number[];
    if (Array.isArray(data)) {
        sendData = [...data];
    } else {
        sendData = [data];
    }
    return new Uint8Array(sendData);
};

abstract class MCookie extends BaseDriver implements Driver {
    private burnSyncCount: number = 0;
    // @ts-ignore
    protected port: Connector | BleCharacteristic;
    // @ts-ignore
    public readonly name: string;
    // @ts-ignore
    public readonly type: "serialport" | "ble";

    private readonly seq = new SeqClass();

    protected onCloseHandel() {
        this.emit("close");
    }

    protected getCoreType(sign: number[]) {
        let cortType;
        if (sign.filter((item, index) => item === BURN_DEVICE_TYPE_CORE[index]).length === 3) {
            cortType = TYPE_CORE;
        } else if (sign.filter((item, index) => item === BURN_DEVICE_TYPE_CORE_PLUS[index]).length === 3) {
            cortType = TYPE_CORE_PLUS;
        } else {
            throw formatError(Error, "not support device");
        }
        return cortType;
    }

    protected async startBurn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
        // @ts-ignore
        this.port.setDataHandle(BurnDataHandler);
        if (this.burnSyncCount >= 3) {
            this.burnSyncCount = 0;
            throw burnError;
        }
        let syncResponse;
        try {
            syncResponse = await this.sendBurn([STK_GET_SYNC, CRC_EOP]);
        } catch (e) {
            this.burnSyncCount++;
            return this.startBurn(dataHandle, progressHandle);
        }
        if (!syncResponse) {
            this.burnSyncCount++;
            return this.startBurn(dataHandle, progressHandle);
        }
        this.burnSyncCount = 0;
        const signResponse = await this.sendBurn([STK_READ_SIGN, CRC_EOP]);
        const sign: number[] = [...signResponse];
        if (!sign || sign.length !== 3) {
            throw formatError(Error, "not support device");
        }
        const cortType = this.getCoreType(sign);
        const timer = setInterval(async () => {
            await this.sendBurn([STK_GET_SYNC, CRC_EOP]);
        }, 200);
        let data;
        try {
            data = await dataHandle(cortType);
        } catch (e) {
            clearInterval(timer);
            throw e;
        }
        let hexData;
        try {
            hexData = intelHex.parse(data).data;
        } catch (e) {
            clearInterval(timer);
            throw formatError(Error, "data is not Hex");
        }
        clearInterval(timer);
        const setDevice = await this.sendBurn(burnSetDevice(BURN_DEVICE_TYPE_CORE_PLUS_PAGESIZE));
        if (!setDevice) {
            throw burnError;
        }
        const startProg = await this.sendBurn([STK_ENTER_PROGMODE, CRC_EOP]);
        if (!startProg) {
            throw burnError;
        }
        let page = 0;

        const total = hexData.length;

        let pageSize = BURN_DEVICE_TYPE_CORE_PLUS_PAGESIZE;
        if (cortType === TYPE_CORE) {
            pageSize = BURN_DEVICE_TYPE_CORE_PAGESIZE;
        }

        while (page < total) {
            const writeBytes = hexData.slice(page, (total > (page + pageSize) ? (page + pageSize) : total));
            const address = page >> 1;
            const addressOk = await this.sendBurn([
                STK_LOAD_ADDRESS,
                address & 0xFF,
                (address >> 8) & 0xFF,
                CRC_EOP,
            ]);
            if (!addressOk) {
                throw burnError;
            }
            const writeData = await this.sendBurn([STK_PROG_PAGE, writeBytes.length >> 8, writeBytes.length & 0xFF, 0x46].concat([...writeBytes]).concat([CRC_EOP]));
            if (!writeData) {
                throw burnError;
            }
            if (progressHandle) {
                progressHandle(Math.round((page / total) * 100));
            }
            page = page + pageSize;
        }

        const endProg = await this.sendBurn([STK_LEAVE_PROGMODE, CRC_EOP]);
        if (!endProg) {
            throw burnError;
        }
    }

    public async open(baudRate?: BAUD_RATE): Promise<any> {
    }

    public async close(): Promise<any> {
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {

    }

    public async setBaudRate(baudRate: BAUD_RATE) {

    }

    private async sendBurn(data: number[] = [], withoutResponse: boolean = false): Promise<number[]> {
        return await this.seq.seqDo<number[]>(async () => {
            const frame = makeFrame(data);
            // @ts-ignore
            const results = await this.port.send(frame, withoutResponse);
            // @ts-ignore
            return [...results];
        });
    }

    public async send(data: number[] = [], withoutResponse: boolean = true): Promise<number[]> {
        return await this.seq.seqDo<number[]>(async () => {
            const frame = makeFrame(data);
            // @ts-ignore
            const results = await this.port.send(frame, withoutResponse);
            // @ts-ignore
            return [...results];
        });
    }
}

export class MCookieDriver extends MCookie implements Driver {
    public readonly name: string;
    public readonly type = "serialport";
    protected readonly connectors: Connector[];
    // @ts-ignore
    protected port: Connector;
    // @ts-ignore
    protected baudRate: BAUD_RATE;

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
        this.emit("data", [...data]);
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
        // @ts-ignore
        this.port.removeListener("data", this.onData);
        let error;
        try {
            // @ts-ignore
            await this.port.setDTR(false);
            await wait(200);
            // @ts-ignore
            await this.port.open(BURN_BAUD_RATE);
            // @ts-ignore
            await this.port.setDTR(true);
            await wait(200);
            await this.startBurn(dataHandle, progressHandle);
        } catch (e) {
            error = e;
        }
        // @ts-ignore
        this.port.setDataHandle(undefined);
        // @ts-ignore
        await this.port.open(this.baudRate);
        // @ts-ignore
        this.port.on("data", this.onData);
        if (error) {
            throw error;
        }
    }

    public async setBaudRate(baudRate: BAUD_RATE) {
        // @ts-ignore
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

    public async close() {
        // @ts-ignore
        await this.port.close();
        this.onCloseHandel();
        // @ts-ignore
        this.port.removeAllListeners();
    }

}

export class MCookieBleDriver extends MCookie implements Driver {
    public readonly name: string;
    public readonly type = "ble";
    protected readonly ble: BleConnector;
    // @ts-ignore
    protected port: BleCharacteristic;
    // @ts-ignore
    protected resetPort: BleCharacteristic;
    // @ts-ignore
    protected baudRatePort: BleCharacteristic;
    protected baudRate: BAUD_RATE = BURN_BAUD_RATE;

    constructor(name: string, ble: BleConnector) {
        super();
        this.name = name;
        this.ble = ble;
    }

    protected onData = (data: Uint8Array) => {
        // @ts-ignore
        this.emit("data", [...data]);
    }

    public async open(baudRate?: BAUD_RATE) {
        if (baudRate) {
            this.baudRate = baudRate;
        }
        await this.ble.open();
        const characteristics = await this.ble.discoverCharacteristics([SERVICE_UUID], [CHARACTERISTIC_UUID, CHARACTERISTIC_UUID_RESET, CHARACTERISTIC_UUID_BAUD_RATE]);
        // @ts-ignore
        this.port = characteristics.find((item) => item.uuid === CHARACTERISTIC_UUID);
        // @ts-ignore
        this.resetPort = characteristics.find((item) => item.uuid === CHARACTERISTIC_UUID_RESET);
        // @ts-ignore
        this.baudRatePort = characteristics.find((item) => item.uuid === CHARACTERISTIC_UUID_BAUD_RATE);
        // @ts-ignore
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(this.baudRate)), true);
        if (!this.port) {
            throw new Error("open error");
        }

        this.port.on("data", this.onData);
        this.ble.once("close", () => {
            this.onCloseHandel();
        });
        this.emit("connected");
    }

    public async close() {
        await this.ble.close();
        this.onCloseHandel();
        this.ble.removeAllListeners();
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void) {
        // @ts-ignore
        this.port.removeListener("data", this.onData);
        // @ts-ignore
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(BURN_BAUD_RATE)), true);
        // @ts-ignore
        await this.resetPort.send(new Uint8Array([RESET]), true);
        await wait(200);
        let error;
        try {
            await super.startBurn(dataHandle, progressHandle);
        } catch (e) {
            error = e;
        }
        // @ts-ignore
        this.port.setDataHandle(undefined);
        // @ts-ignore
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(this.baudRate)), true);
        // @ts-ignore
        await this.resetPort.send(new Uint8Array([RESET]), true);
        // @ts-ignore
        this.port.on("data", this.onData);
        await wait(200);
        if (error) {
            throw error;
        }
    }
}
