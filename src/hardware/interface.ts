import {EventEmitter} from "events";
import {UnConnectedBleDriver, UnConnectedSerialportDriver} from "./driver/UnConnectedDriver";

export declare class Driver {
    public readonly name: string;
    public readonly type: "serialport" | "ble";

    constructor(name: string, connector: Connector[] | BleConnector);

    public open(baudRate?: BAUD_RATE): Promise<any>;

    public close(): Promise<void>;

    public send(data: number[], withoutResponse?: boolean): Promise<number[]>;

    public burn(dataCallback: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void>;

    public setBaudRate(baudRate: BAUD_RATE): Promise<void>;

    public on(event: "close" | "connected", listener: () => void): this;
    public on(event: "data", listener: (data: Uint8Array) => void): this;

    public once(event: "close" | "connected", listener: () => void): this;
    public once(event: "data", listener: (data: Uint8Array) => void): this;

    public removeListener(event: "close" | "connected", listener: () => void): this;
    public removeListener(event: "data", listener: (data: Uint8Array) => void): this;
}

export declare class Connector extends EventEmitter {
    public static isReady(): boolean;

    public static version?(): Promise<string>;

    public static list(): Promise<UnConnectedSerialportDriver[]>;

    public open(baudRate?: BAUD_RATE): Promise<void>;

    public close(): Promise<void>;

    public send(data: Uint8Array, withoutResponse?: boolean, step?: number): Promise<Uint8Array>;

    public setDataHandle: (handler?: DataHandler) => void;

    public isOpen(): boolean;

    public setDTR(dtr: boolean): Promise<void>;

    public on(event: "close", listener: () => void): this;
    public on(event: "data", listener: (data: Uint8Array) => void): this;

    public once(event: "close", listener: () => void): this;
    public once(event: "data", listener: (data: Uint8Array) => void): this;

    public removeListener(event: "close", listener: () => void): this;
    public removeListener(event: "data", listener: (data: Uint8Array) => void): this;
}

export declare class BleConnector extends EventEmitter {
    public static isReady(): boolean;

    public static version?(): Promise<string>;

    public static list(): Promise<UnConnectedBleDriver[]>;

    public open(): Promise<any>;

    public close(): Promise<void>;

    public isOpen(): boolean;

    public discoverCharacteristics(serviceUUIDs: string[], characteristicUUIDs: string[]): Promise<BleCharacteristic[]>;

    public on(event: "close", listener: () => void): this;

    public once(event: "close", listener: () => void): this;

    public removeListener(event: "close", listener: () => void): this;
}

export declare class BleCharacteristic extends EventEmitter {
    public readonly uuid: string;

    public send(data: Uint8Array, withoutResponse?: boolean, step?: number): Promise<Uint8Array>;

    public setDataHandle: (handler?: DataHandler) => void;

    public on(event: "data", listener: (data: Uint8Array) => void): this;

    public once(event: "data", listener: (data: Uint8Array) => void): this;

    public removeListener(event: "data", listener: (data: Uint8Array) => void): this;
}

export declare class Sensor {
    public static isMe(num: number): boolean;

    constructor(driver: Driver, index: number);

    [key: string]: any;
}

export type BAUD_RATE =
    110
    | 300
    | 600
    | 1200
    | 2400
    | 4800
    | 9600
    | 14400
    | 19200
    | 38400
    | 57600
    | 115200
    | 128000
    | 256000;

export type DataHandler = (resolve: any) => (data: Buffer) => void;
