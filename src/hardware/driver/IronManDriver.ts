import {BAUD_RATE, BleCharacteristic, BleConnector, Connector, Driver, Sensor} from "../interface";
import DeviceSendFail from "../exceptions/DeviceSendFail";
import sensors from "../sensor";
import SeqClass from "../SeqClass";
import crc8 from "../lib/crc8";
import BaseDriver from "../BaseDriver";
import {MAX_SEND_BYTES} from "../constance";
import wait from "../lib/wait";
import {
    TYPE_CORE_PLUS_3V3_PAGESIZE, burnSetDevice,
    CRC_EOP,
    RESET, STK_ENTER_PROGMODE,
    STK_GET_SYNC,
    STK_INSYNC, STK_LEAVE_PROGMODE, STK_LOAD_ADDRESS,
    STK_OK, STK_PROG_PAGE,
    STK_READ_SIGN, TYPE_CORE_PLUS_3V3, BURN_DEVICE_TYPE_CORE_PLUS,
} from "../burnConstance";
import baudRateFormat from "../lib/baudRateFormat";
import UnknownSensor from "../sensor/UnknownSensor";
import UnknownMatrixSensor from "../sensor/UnknownMatrixSensor";
import BurnDataHandler from "../dataHandler/BurnDataHandler";
import IronManCommandHandler from "../dataHandler/IronManCommandHandler";

const intelHex = require("intel-hex");

const START = 0xFA;
const END = 0xFD;
const SCAN = 0xA1;
const READ = 0xA2;
const WRITE = 0xA3;
const SUCCESS = 0xAA;
const ERROR_I2C = 0xAB;
const ERROR_CHECK = 0xA9;
const ERROR_TIMEOUT = 0xA8;

const MAX_ERROR_REYRY_TIME = 3;

const BURN_BAUD_RATE = 57600;
const CMD_PORT_BAUD_RATE = 57600;

const SCAN_RATE = 30;

const SERIAL_NUMBER_MIX = 0x40;
const DEFAULT_SERIAL_NUMBER = 0x00;
const MAX_SERIAL_NUMBER = 0x3F;

// ble
const SERVICE_UUID = "fff0";
const CHARACTERISTIC_UUID_CMD = "fff7";
const CHARACTERISTIC_UUID_BURN = "fff6";
const CHARACTERISTIC_UUID_RESET = "fff1";
const CHARACTERISTIC_UUID_BAUD_RATE = "fff2";

const formatError = (ErrorType: any, message: string) => {
    return new ErrorType(`[IronManDriver] ${message}`);
};

const burnError = formatError(Error, "burn error");

const makeFrame = (data: number | number[], serialNumber: number) => {
    let sendData: number[];
    if (Array.isArray(data)) {
        sendData = [START, ...data, serialNumber];
    } else {
        sendData = [START, data, serialNumber];
    }
    const checksum = crc8(sendData);
    return new Uint8Array([...sendData, checksum, END]);
};

const makeBurnFrame = (data: number | number[]) => {
    let sendData: number[];
    if (Array.isArray(data)) {
        sendData = [...data];
    } else {
        sendData = [data];
    }
    return new Uint8Array(sendData);
};

const getValue = (result: number[], num = 4) => result.slice(num, -3);

let allSensors: Array<typeof Sensor> = sensors;

export const initIronManSensors = (sensors: Array<typeof Sensor>) => {
    sensors = sensors.filter((item) => typeof item.isMe === "function");
    allSensors = allSensors.concat(sensors);
};

export abstract class IronMan extends BaseDriver implements Driver {
    // @ts-ignore
    public readonly name: string;
    // @ts-ignore
    public readonly type: "serialport" | "ble";
    // @ts-ignore
    protected cmdPort: Connector | BleCharacteristic;
    // @ts-ignore
    protected burnPort: Connector | BleCharacteristic;

    private serialNumber: number = DEFAULT_SERIAL_NUMBER;
    private readonly seq = new SeqClass();
    private oldSensorNumber: any[] = [];
    // @ts-ignore
    private oldMatrixNumber: number = undefined;
    private errorCount: number = 0;
    // @ts-ignore
    private timer: number;
    private burnSyncCount: number = 0;
    private oldSensors: Sensor[] = [];
    // @ts-ignore
    private oldMatrix: Sensor = null;
    // @ts-ignore
    private oldAKey: boolean = undefined;
    // @ts-ignore
    private oldBKey: boolean = undefined;

    protected startScanTimer = () => {
        this.timer = requestAnimationFrame(async () => {
            try {
                await this.scan();
            } catch (e) {
            } finally {
                if (this.timer) {
                    this.startScanTimer();
                }
            }
        });
    }

    protected stopScanTimer = () => {
        cancelAnimationFrame(this.timer);
        // @ts-ignore
        this.timer = undefined;
    }

    protected onCloseHandel = () => {
        this.stopScanTimer();
        this.emit("close");
    }

    public async open(baudRate: BAUD_RATE): Promise<any> {
    }

    public async close(): Promise<any> {
    }

    private changeSerialNumber() {
        if (this.serialNumber >= MAX_SERIAL_NUMBER) {
            this.serialNumber = DEFAULT_SERIAL_NUMBER;
            return;
        }
        this.serialNumber++;
    }

    private isValidResult(results: number[]) {
        if (!results || !Array.isArray(results) || results.length < 5) {
            return false;
        }
        if (results[0] !== START) {
            return false;
        }
        if (results[results.length - 1] !== END) {
            return false;
        }
        const checksum = crc8(results.slice(0, -2));
        if (checksum !== results[results.length - 2]) {
            return false;
        }
        return results[results.length - 3] === this.serialNumber + SERIAL_NUMBER_MIX;
    }

    public async send(data: number[], withoutResponse: boolean = true): Promise<number[]> {
        return this.seq.seqDo<number[]>(async () => {
            this.stopScanTimer();
            let results;
            try {
                results = await this.burnPort.send(new Uint8Array(data), withoutResponse);
            } catch (e) {
                throw new Error(e);
            } finally {
                this.startScanTimer();
            }
            // @ts-ignore
            return [...results];
        });
    }

    protected getCoreType(sign: number[]) {
        if (sign.filter((item, index) => item === BURN_DEVICE_TYPE_CORE_PLUS[index]).length === 3) {
            return TYPE_CORE_PLUS_3V3;
        }
        throw new Error("not support device");
    }

    protected async startBurn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
        this.burnPort.setDataHandle(BurnDataHandler);
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
        const timer = setInterval(async () => {
            await this.sendBurn([STK_GET_SYNC, CRC_EOP]);
        }, 200);
        const coreType = this.getCoreType(sign);
        let data;
        try {
            data = await dataHandle(coreType);
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
        const setDevice = await this.sendBurn(burnSetDevice(TYPE_CORE_PLUS_3V3_PAGESIZE));
        if (!setDevice) {
            throw burnError;
        }
        const startProg = await this.sendBurn([STK_ENTER_PROGMODE, CRC_EOP]);
        if (!startProg) {
            throw burnError;
        }
        let page = 0;

        const total = hexData.length;

        while (page < total) {
            const writeBytes = hexData.slice(page, (total > (page + TYPE_CORE_PLUS_3V3_PAGESIZE) ? (page + TYPE_CORE_PLUS_3V3_PAGESIZE) : total));
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
            page = page + TYPE_CORE_PLUS_3V3_PAGESIZE;
        }

        const endProg = await this.sendBurn([STK_LEAVE_PROGMODE, CRC_EOP]);
        if (!endProg) {
            throw burnError;
        }
    }

    private async sendBurn(data: number[] = [], withoutResponse: boolean = false): Promise<number[]> {
        return await this.seq.seqDo<number[]>(async () => {
            const frame = makeBurnFrame(data);
            const results = await this.burnPort.send(frame, withoutResponse);
            // @ts-ignore
            return [...results];
        });
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {

    }

    public async setBaudRate(baudRate: BAUD_RATE) {

    }

    protected async sendCommand(data: number[] = [], isScan = false): Promise<number[]> {
        const results = await this.seq.seqDo<number[]>(async () => {
            const length = data.length;
            const frame = makeFrame(data, this.serialNumber);
            if (frame.length > MAX_SEND_BYTES) {
                throw formatError(DeviceSendFail, `max data length detected (${MAX_SEND_BYTES - (frame.length - length)})`);
            }
            const results = await this.cmdPort.send(frame, false, 1);
            // @ts-ignore
            const res = [...results];
            if (!this.isValidResult(res)) {
                throw formatError(DeviceSendFail, "result is not valid");
            }
            this.changeSerialNumber();
            return res;
        });

        if (results[1] !== SUCCESS) {
            if (results[1] === ERROR_I2C) {
                if (this.errorCount <= MAX_ERROR_REYRY_TIME) {
                    this.errorCount++;
                    return this.sendCommand(data);
                }
            }
            this.errorCount = 0;
            throw formatError(DeviceSendFail, `send fail errorCode: [${results[1]}]`);
        }
        return getValue(results, isScan ? 2 : undefined);
    }

    public write(data: number[] = []) {
        return this.sendCommand([WRITE, ...data]);
    }

    public read(data: number[] = []) {
        return this.sendCommand([READ, ...data]);
    }

    public async scan() {
        const res = await this.sendCommand([SCAN], true);
        const result: number[] = [];
        for (let i = 0; i < res.length; i += 2) {
            if (i === 0) {
                result.push(res[i]);
                result.push(res[i + 1]);
                continue;
            }
            result.push(res[i] + res[i + 1]);
        }
        const sensors = result.slice(2, 10);
        const matrix = result[10];
        if (this.oldMatrixNumber !== matrix) {
            const MatrixSensor = allSensors.find((sensor) => sensor.isMe(matrix));
            if (MatrixSensor) {
                this.oldMatrix = new MatrixSensor(this, 8);
            } else {
                this.oldMatrix = new UnknownMatrixSensor(this, 8);
            }
            this.emit("matrixChange", result);
        }
        this.oldMatrixNumber = matrix;
        const key = result[0];
        // const mac = result[1];
        if (typeof this.oldAKey === "undefined") {
            this.oldAKey = key === 1 || key === 3;
        }
        if (typeof this.oldBKey === "undefined") {
            this.oldBKey = key === 2 || key === 3;
        }
        switch (key) {
            case 0: {
                if (this.oldAKey === true) {
                    this.emit("keyUp", "A");
                }
                if (this.oldBKey === true) {
                    this.emit("keyUp", "B");
                }
                this.oldAKey = false;
                this.oldBKey = false;
                break;
            }
            case 1: {
                if (this.oldAKey === false) {
                    this.emit("keyDown", "A");
                }
                if (this.oldBKey === true) {
                    this.emit("keyUp", "B");
                }
                this.oldAKey = true;
                this.oldBKey = false;
                break;
            }
            case 2: {
                if (this.oldAKey === true) {
                    this.emit("keyUp", "A");
                }
                if (this.oldBKey === false) {
                    this.emit("keyDown", "B");
                }
                this.oldAKey = false;
                this.oldBKey = true;
                break;
            }
            case 3: {
                if (this.oldAKey === false) {
                    this.emit("keyDown", "A");
                }
                if (this.oldBKey === false) {
                    this.emit("keyDown", "B");
                }
                this.oldAKey = true;
                this.oldBKey = true;
                break;
            }
        }
        sensors.forEach((num, index) => {
            if (this.oldSensorNumber[index] !== num) {
                const Sensor = allSensors.find((sensor) => sensor.isMe(num));
                let result: Sensor;
                if (Sensor) {
                    result = new Sensor(this, index);
                } else {
                    result = new UnknownSensor(this, index);
                }
                this.oldSensors[index] = result;
                this.emit("change", index, result);
            }
            this.oldSensorNumber[index] = num;
        });
    }

    public getMatrix() {
        return this.oldMatrix;
    }

    public getSensors() {
        return this.oldSensors;
    }
}

export class IronManDriver extends IronMan implements Driver {
    public readonly name: string;
    public readonly type = "serialport";
    private readonly connectors: Connector[];
    // @ts-ignore
    protected cmdPort: Connector;
    // @ts-ignore
    protected burnPort: Connector;
    // @ts-ignore
    protected baudRate: BAUD_RATE;

    constructor(name: string, connectors: Connector[]) {
        super();
        if (!Array.isArray(connectors) || connectors.length !== 2) {
            throw formatError(Error, 'argument "connectors" is not valid');
        }
        this.name = name;
        this.connectors = connectors;
    }

    private onData = (data: Uint8Array) => {
        // @ts-ignore
        this.emit("data", [...data]);
    }

    public async open(baudRate: BAUD_RATE) {
        let cmdIndex = 0;
        this.baudRate = baudRate;
        this.cmdPort = this.connectors[cmdIndex];
        await this.cmdPort.open(CMD_PORT_BAUD_RATE);
        let error;
        try {
            return await this.scan();
        } catch (e) {
            if (e instanceof DeviceSendFail) {
                cmdIndex = 1;
                await this.cmdPort.close();
                this.cmdPort = this.connectors[cmdIndex];
                await this.cmdPort.open(CMD_PORT_BAUD_RATE);
            } else {
                await this.cmdPort.close();
                error = e;
            }
        }
        if (error) {
            throw error;
        } else {
            if (cmdIndex === 0) {
                this.burnPort = this.connectors[1];
                await this.burnPort.open(baudRate);
            } else {
                this.burnPort = this.connectors[0];
                await this.burnPort.open(baudRate);
            }
            const closeHandle = () => {
                this.burnPort.removeListener("close", closeHandle2);
                this.onCloseHandel();
            };
            const closeHandle2 = () => {
                this.cmdPort.removeListener("close", closeHandle);
                this.onCloseHandel();
            };
            this.cmdPort.setDataHandle(IronManCommandHandler);
            this.cmdPort.once("close", closeHandle);
            this.burnPort.once("close", closeHandle2);
            this.burnPort.on("data", this.onData);
            await this.burnPort.setDTR(false);
            await this.scan();
            this.startScanTimer();
            this.emit("connected");
        }
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
        this.burnPort.removeListener("data", this.onData);
        this.stopScanTimer();
        let error;
        try {
            await this.burnPort.setDTR(false);
            await wait(200);
            await this.burnPort.open(BURN_BAUD_RATE);
            await this.burnPort.setDTR(true);
            await wait(200);
            await this.startBurn(dataHandle, progressHandle);
        } catch (e) {
            error = e;
        }
        this.burnPort.setDataHandle(undefined);
        await this.burnPort.open(this.baudRate);
        this.startScanTimer();
        this.burnPort.on("data", this.onData);
        if (error) {
            throw error;
        }
    }

    public async setBaudRate(baudRate: BAUD_RATE) {
        await this.burnPort.open(baudRate);
        this.baudRate = baudRate;
    }

    public async close() {
        this.stopScanTimer();
        await this.cmdPort.close();
        await this.burnPort.close();
        this.cmdPort.removeAllListeners();
        this.burnPort.removeAllListeners();
        this.onCloseHandel();
    }

}

export class IronManBleDriver extends IronMan implements Driver {
    public readonly name: string;
    public readonly type = "ble";
    private readonly ble: BleConnector;
    // @ts-ignore
    protected cmdPort: BleCharacteristic;
    // @ts-ignore
    protected burnPort: BleCharacteristic;
    // @ts-ignore
    private resetPort: BleCharacteristic;
    // @ts-ignore
    private baudRatePort: BleCharacteristic;
    private baudRate: BAUD_RATE = CMD_PORT_BAUD_RATE;

    constructor(name: string, ble: BleConnector) {
        super();
        this.name = name;
        this.ble = ble;
    }

    private onData = (data: Uint8Array) => {
        // @ts-ignore
        this.emit("data", [...data]);
    }

    public async open(baudRate?: BAUD_RATE) {
        if (baudRate) {
            this.baudRate = baudRate;
        }
        await this.ble.open();
        const characteristics = await this.ble.discoverCharacteristics([SERVICE_UUID], [CHARACTERISTIC_UUID_CMD, CHARACTERISTIC_UUID_BURN, CHARACTERISTIC_UUID_RESET, CHARACTERISTIC_UUID_BAUD_RATE]);
        // @ts-ignore
        this.cmdPort = characteristics.find((item) => item.uuid === CHARACTERISTIC_UUID_CMD);
        this.cmdPort.setDataHandle(IronManCommandHandler);
        // @ts-ignore
        this.burnPort = characteristics.find((item) => item.uuid === CHARACTERISTIC_UUID_BURN);
        // @ts-ignore
        this.resetPort = characteristics.find((item) => item.uuid === CHARACTERISTIC_UUID_RESET);
        // @ts-ignore
        this.baudRatePort = characteristics.find((item) => item.uuid === CHARACTERISTIC_UUID_BAUD_RATE);
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(this.baudRate)), true);
        this.burnPort.on("data", this.onData);
        this.ble.once("close", () => {
            this.onCloseHandel();
        });
        // ???
        await wait(200);
        await this.scan();
        this.startScanTimer();
        this.emit("connected");
    }

    public async close() {
        await this.ble.close();
        this.onCloseHandel();
        this.stopScanTimer();
        this.cmdPort.removeAllListeners();
        this.burnPort.removeAllListeners();
        this.ble.removeAllListeners();
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void) {
        this.burnPort.removeListener("data", this.onData);
        this.stopScanTimer();
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(BURN_BAUD_RATE)), true);
        await this.resetPort.send(new Uint8Array([RESET]), true);
        await wait(200);
        let error;
        try {
            await super.startBurn(dataHandle, progressHandle);
        } catch (e) {
            error = e;
        }
        this.burnPort.setDataHandle(undefined);
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(this.baudRate)), true);
        await this.resetPort.send(new Uint8Array([RESET]), true);
        this.burnPort.on("data", this.onData);
        await wait(200);
        this.startScanTimer();
        if (error) {
            throw error;
        }
    }
}
