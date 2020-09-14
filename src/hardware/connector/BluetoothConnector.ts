import {
    BLE_FILTER_REGEXP,
    BLE_SCAN_LIFECYCLE, BLE_SCAN_STOP_TIMEOUT, DRIVER_SEND_TIMEOUT,
} from "../constance";
import {BleCharacteristic, BleConnector, DataHandler} from "../interface";
import getDriverType from "../lib/getDriverName";
import BaseConnector from "../BaseConnector";
import ConnectError from "../exceptions/ConnectError";
import DeviceNotOpen from "../exceptions/DeviceNotOpen";
import DeviceSendFail from "../exceptions/DeviceSendFail";
import {BlueToothInterface} from "../BlueToothInterface";
import isElectron from "../lib/isElectron";
import {EventEmitter} from "events";
import {UnConnectedBleDriver} from "../driver/UnConnectedDriver";
import buf2hex from "../lib/buf2hex";

const BluetoothClass: typeof BlueToothInterface = require("@s524797336/noble-mac");

if (isElectron) {
    window.addEventListener("beforeunload", () => {
        BluetoothClass.removeAllListeners();
        BluetoothClass.stopScanning();
    });
}

interface IDevice {
    name: string;
    rssi: number;
    connectName: string;
    peripheral: BlueToothInterface.Peripheral;
}

interface IDeviceLifecycle {
    timer: NodeJS.Timer;
    device: IDevice;
}

interface IDeviceMaps {
    [key: string]: IDeviceLifecycle;
}

let deviceMaps: IDeviceMaps = {};

const filter = (localName: string) => localName && BLE_FILTER_REGEXP.test(localName);

const discover = (peripheral: BlueToothInterface.Peripheral) => {
    if (peripheral.connectable) {
        if (filter(peripheral.advertisement.localName)) {
            const name = peripheral.advertisement.localName.replace(BLE_FILTER_REGEXP, "$1$2");
            const deviceInfo: IDevice = {
                name,
                rssi: peripheral.rssi,
                connectName: peripheral.address === "unknow" ? peripheral.address : peripheral.uuid,
                peripheral,
            };
            if (deviceMaps[peripheral.advertisement.localName]) {
                clearTimeout(deviceMaps[peripheral.advertisement.localName].timer);
            }
            deviceMaps[peripheral.advertisement.localName] = {
                // @ts-ignore
                timer: setTimeout(() => {
                    delete deviceMaps[peripheral.advertisement.localName];
                }, BLE_SCAN_LIFECYCLE),
                device: deviceInfo,
            };
        }
    }
};

// @ts-ignore
let stopScanTimer: NodeJS.Timer = null;

class BlueToothCharacteristic extends EventEmitter implements BleCharacteristic {
    private readonly characteristic: BlueToothInterface.Characteristic;
    // @ts-ignore
    private readonly connector: BlueToothConnector = null;
    public readonly uuid: string;
    // @ts-ignore
    private customHandler: DataHandler;

    private dataHandle = (resolve: any) => (data: Buffer) => {
        resolve(buf2hex(data));
    }

    constructor(characteristic: BlueToothInterface.Characteristic, connector: BlueToothConnector) {
        super();
        this.characteristic = characteristic;
        this.characteristic.setMaxListeners(20);
        this.uuid = this.characteristic.uuid;
        this.connector = connector;
        if (this.characteristic.properties.includes("notify")) {
            this.characteristic.subscribe();
            let results: number[] = [];
            let timer: NodeJS.Timer;
            const handler = (data: Buffer) => {
                if (data) {
                    // @ts-ignore
                    results = results.concat([...data]);
                    clearTimeout(timer);
                    // @ts-ignore
                    timer = setTimeout(() => {
                        this.emit("data", new Uint8Array(results));
                        results = [];
                    }, 30);
                }
            };
            this.characteristic.on("data", handler);
            this.connector.once("close", () => {
                this.characteristic.removeListener("data", handler);
            });
        }
    }

    public setDataHandle(handler?: DataHandler) {
        // @ts-ignore
        this.customHandler = handler;
    }

    public send(data: Uint8Array, withoutResponse: boolean = false, step = 20) {
        this.connector.isOpen(true);
        return new Promise<Uint8Array>((resolve, reject) => {
            let dataHandler: any;
            const total = Math.ceil((data.length - 1) / step);
            if (!withoutResponse) {
                const timer = setTimeout(() => {
                    this.characteristic.removeListener("data", dataHandler);
                    reject(new DeviceSendFail("send timeout"));
                }, DRIVER_SEND_TIMEOUT);
                const resolveHandler = (data: any) => {
                    clearTimeout(timer);
                    this.characteristic.removeListener("data", dataHandler);
                    resolve(data);
                };
                dataHandler = (this.customHandler || this.dataHandle)(resolveHandler);
                this.characteristic.on("data", dataHandler);
            }

            for (let i = 0; i <= total; i++) {
                const start = i * step;
                const end = start + step;
                // @ts-ignore
                this.characteristic.write(Buffer.from(new Uint8Array([...(data.slice(start, end))])), true, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (withoutResponse && i >= total) {
                        resolve(new Uint8Array(0));
                    }
                });
            }
        });
    }
}

export default class BlueToothConnector extends BaseConnector implements BleConnector {
    private readonly peripheral: BlueToothInterface.Peripheral;
    private isOpenFlag: boolean = false;

    private closeHandle = () => {
        this.isOpenFlag = false;
        this.emit("close");
    }

    public static isReady() {
        return BluetoothClass.state === "poweredOn";
    }

    public static async list(): Promise<(null | UnConnectedBleDriver)[]> {
        if (BluetoothClass.state !== "poweredOn") {
            return [];
        }

        if (stopScanTimer === null) {
            BluetoothClass.on("discover", discover);
            BluetoothClass.startScanning([], true);
        }

        clearTimeout(stopScanTimer);
        // @ts-ignore
        stopScanTimer = setTimeout(() => {
            BluetoothClass.removeListener("discover", discover);
            deviceMaps = {};
            // @ts-ignore
            stopScanTimer = null;
            BluetoothClass.stopScanning();
        }, BLE_SCAN_STOP_TIMEOUT);

        return Object.keys(deviceMaps).map((key) => deviceMaps[key].device).sort((a, b) => a.rssi < b.rssi ? 1 : -1).map((item) => {
            const name = getDriverType([item]);
            if (!name) {
                return null;
            }
            const ble = new BlueToothConnector({
                peripheral: item.peripheral,
            });
            return new UnConnectedBleDriver(name, ble);
        }).filter((item) => !!item);
    }

    constructor(info: any) {
        super(info);
        this.peripheral = this.connectionInfo.peripheral;
    }

    public async open() {
        if (this.isOpen()) {
            throw new ConnectError("already opened");
        }
        this.isOpenFlag = true;
        return new Promise((resolve, reject) => {
            this.peripheral.connect((error) => {
                if (error) {
                    this.isOpenFlag = false;
                    reject(new ConnectError("connect failed"));
                    return;
                }
                resolve();
            });
            this.peripheral.once("disconnect", this.closeHandle);
            if (isElectron) {
                window.addEventListener("beforeunload", () => {
                    this.peripheral.disconnect();
                });
            }
        });
    }

    public async discoverCharacteristics(serviceUUIDs: string[], characteristicUUIDs: string[]) {
        return new Promise<BlueToothCharacteristic[]>((resolve, reject) => {
            this.peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, (error, services, characteristics) => {
                if (error) {
                    reject(new ConnectError("connect failed"));
                    return;
                }
                const results = characteristics.map((item) => new BlueToothCharacteristic(item, this));
                resolve(results);
            });
        });
    }

    public async close() {
        return new Promise<void>((resolve) => {
            this.peripheral.disconnect(() => {
                this.peripheral.removeAllListeners();
                this.isOpenFlag = false;
                resolve();
            });
        });
    }

    public isOpen(rejectWhenNotOpen: boolean = false) {
        const isEmpty = this.isOpenFlag;
        if (!isEmpty && rejectWhenNotOpen) {
            throw new DeviceNotOpen("please open first");
        }
        return isEmpty;
    }
}
