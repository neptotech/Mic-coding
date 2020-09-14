import {DRIVER_SEND_TIMEOUT} from "../constance";
import {BAUD_RATE, Connector, DataHandler} from "../interface";
import {SerialPort} from "../SerialPortInterface";
import groupBy from "../lib/groupBy";
import getDriverName from "../lib/getDriverName";
import BaseConnector from "../BaseConnector";
import ConnectError from "../exceptions/ConnectError";
import DeviceNotOpen from "../exceptions/DeviceNotOpen";
import DeviceSendFail from "../exceptions/DeviceSendFail";
import buf2hex from "../lib/buf2hex";
import CloseError from "../exceptions/CloseError";
import isElectron from "../lib/isElectron";
import md5 from "../md5";
import {UnConnectedSerialportDriver} from "../driver/UnConnectedDriver";

interface IDriverInfo {
    comName: string;
    manufacturer: string;
    serialNumber: string;
    pnpId: string;
    locationId: string;
    vendorId: string;
    productId: string;
}

const SerialPortClass: typeof SerialPort = require("serialport");

export default class SerialPortConnector extends BaseConnector implements Connector {
    // @ts-ignore
    private port: SerialPort;
    private customHandler: DataHandler | undefined;

    private closeHandle = () => {
        this.emit("close");
    }

    private dataHandle = (resolve: any) => (data: Buffer) => {
        resolve(buf2hex(data));
    }

    public static isReady() {
        return true;
    }

    public static async list(): Promise<(null | UnConnectedSerialportDriver)[]> {
        const list: IDriverInfo[] = await SerialPortClass.list();
        return groupBy(
            list
                .filter((item) => !/usbserial-/.test(item.comName))
            , (item) => (item.serialNumber || item.locationId),
        ).map((item) => {
            const name = getDriverName(item.members, md5(item.key, 6));
            if (name === null) {
                return null;
            }
            const connectors = item.members.map((member) => new SerialPortConnector({path: member.comName}));
            return new UnConnectedSerialportDriver(name, connectors);
        }).filter((item) => !!item);
    }

    public async open(baudRate: BAUD_RATE) {
        if (this.isOpen()) {
            return new Promise<void>((resolve, reject) => {
                this.port.update({
                    baudRate: baudRate,
                }, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        }
        return new Promise<void>((resolve, reject) => {
            const callback = (error: Error) => {
                if (error) {
                    console.error(error);
                    reject(new ConnectError("connect failed"));
                    return;
                }
                resolve();
            };
            this.port = new SerialPortClass(this.connectionInfo.path, {
                baudRate,
                lock: true,
                autoOpen: false,
            });
            this.port.open(callback);
            this.port.once("close", this.closeHandle);
            if (isElectron) {
                window.addEventListener("beforeunload", () => {
                    this.close();
                });
            }
            this.port.on("data", (data) => {
                if (data) {
                    this.emit("data", new Uint8Array(buf2hex(data)));
                }
            });
        });
    }

    public async close() {
        return new Promise<void>((resolve, reject) => {
            this.port.removeAllListeners();
            this.port.close((error) => {
                if (error) {
                    console.error(error);
                    reject(new CloseError("close"));
                    return;
                }
                resolve();
            });
        });
    }

    public isOpen(rejectWhenNotOpen: boolean = false) {
        const isOpen = this.port && this.port.isOpen;
        if (!isOpen && rejectWhenNotOpen) {
            throw new DeviceNotOpen("please open first");
        }
        return isOpen;
    }

    public async setDTR(dtr?: boolean) {
        return new Promise<void>((resolve, reject) => {
            this.port.set({dtr}, ((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }));
        });
    }

    public setDataHandle(handler?: DataHandler) {
        this.customHandler = handler;
    }

    public async send(data: Uint8Array, withoutResponse: boolean = false) {
        this.isOpen(true);
        return new Promise<Uint8Array>((resolve, reject) => {
            let dataHandler: any;
            let results: any;
            let isOk = false;
            if (!withoutResponse) {
                const timer = setTimeout(() => {
                    this.port.removeListener("data", dataHandler);
                    reject(new DeviceSendFail("send timeout"));
                }, DRIVER_SEND_TIMEOUT);
                const resolveHandler = (data: any) => {
                    clearTimeout(timer);
                    this.port.removeListener("data", dataHandler);
                    results = data;
                    if (isOk) {
                        resolve(results);
                    }
                    isOk = true;
                };
                dataHandler = (this.customHandler || this.dataHandle)(resolveHandler);
                this.port.on("data", dataHandler);
            }
            this.port.write(data as any, "utf8", (error) => {
                if (error) {
                    this.port.removeListener("data", dataHandler);
                    reject(new DeviceSendFail(error.message));
                    return;
                }
            });
            this.port.drain((error) => {
                if (error) {
                    this.port.removeListener("data", dataHandler);
                    reject(new DeviceSendFail(error.message));
                    return;
                }
                if (withoutResponse) {
                    resolve(new Uint8Array(0));
                } else {
                    if (isOk) {
                        resolve(results);
                    }
                }
                isOk = true;
            });
        });
    }
}
