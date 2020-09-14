import * as Stream from "stream";
import {BAUD_RATE} from "./interface";

export declare class SerialPort extends Stream.Duplex {
    constructor(path: string, callback?: SerialPort.ErrorCallback);
    constructor(path: string, options?: SerialPort.IOpenOptions, callback?: SerialPort.ErrorCallback);

    public readonly baudRate: BAUD_RATE;
    public readonly binding: SerialPort.BaseBinding;
    public readonly isOpen: boolean;
    public readonly path: string;

    public open(callback?: SerialPort.ErrorCallback): void;

    public update(options: SerialPort.IUpdateOptions, callback?: SerialPort.ErrorCallback): void;

    public write(data: string | number[] | Buffer, callback?: (error: any, bytesWritten: number) => void): boolean;
    public write(buffer: string | number[] | Buffer, encoding?: "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "binary" | "hex", callback?: (error: any, bytesWritten: number) => void): boolean;

    public read(size?: number): string | Buffer | null;

    public close(callback?: (error: Error) => void): void;

    public set(options: SerialPort.ISetOptions, callback?: SerialPort.ErrorCallback): void;

    public get(callback?: SerialPort.ModemBitsCallback): void;

    public flush(callback?: SerialPort.ErrorCallback): void;

    public drain(callback?: SerialPort.ErrorCallback): void;

    public pause(): this;

    public resume(): this;

    public on(event: string, callback: (data?: any) => void): this;

    public static Binding: SerialPort.BaseBinding;

    public static list(): Promise<any>;
}

export declare namespace SerialPort {
    // Callbacks Type Defs
    type ErrorCallback = (error: Error) => void;
    type ModemBitsCallback = (error: Error, status: { cts: boolean, dsr: boolean, dcd: boolean }) => void;
    type ListCallback = (error: Error, port: any[]) => void;

    // Options Type Defs
    interface IOpenOptions {
        autoOpen?: boolean;
        baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number;
        dataBits?: 8 | 7 | 6 | 5;
        highWaterMark?: number;
        lock?: boolean;
        stopBits?: 1 | 2;
        parity?: "none" | "even" | "mark" | "odd" | "space";
        rtscts?: boolean;
        xon?: boolean;
        xoff?: boolean;
        xany?: boolean;
        binding?: BaseBinding;
        bindingOptions?: {
            vmin?: number;
            vtime?: number;
        };
    }

    interface IUpdateOptions {
        baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number;
    }

    interface ISetOptions {
        brk?: boolean;
        cts?: boolean;
        dsr?: boolean;
        dtr?: boolean;
        rts?: boolean;
    }

    namespace parsers {
        class ByteLength extends Stream.Transform {
            constructor(options: { length: number });
        }

        class CCTalk extends Stream.Transform {
            constructor();
        }

        class Delimiter extends Stream.Transform {
            constructor(options: { delimiter: string | Buffer | number[], includeDelimiter?: boolean });
        }

        class Readline extends Delimiter {
            constructor(options: { delimiter: string | Buffer | number[], encoding?: "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "binary" | "hex" });
        }

        class Ready extends Stream.Transform {
            constructor(options: { data: string | Buffer | number[] });
        }

        class Regex extends Stream.Transform {
            constructor(options: { regex: RegExp });
        }
    }

    // Binding Type Defs
    type win32Binding = BaseBinding;
    type darwinBinding = BaseBinding;
    type linuxBinding = BaseBinding;

    // Binding Type Def
    class BaseBinding {
        constructor(options: any);

        public open(path: string, options: IOpenOptions): Promise<any>;

        public close(): Promise<any>;

        public read(data: Buffer, offset: number, length: number): Promise<any>;

        public write(data: Buffer): Promise<any>;

        public update(options?: IUpdateOptions): Promise<any>;

        public set(options?: ISetOptions): Promise<any>;

        public get(): Promise<any>;

        public flush(): Promise<any>;

        public drain(): Promise<any>;

        public static list(): Promise<any>;
    }
}
