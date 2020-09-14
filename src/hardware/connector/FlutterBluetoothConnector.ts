import {BLE_FILTER_REGEXP, BLE_SCAN_LIFECYCLE, BLE_SCAN_STOP_TIMEOUT, DRIVER_SEND_TIMEOUT,} from "../constance";
import {BleCharacteristic, BleConnector, DataHandler} from "../interface";
import getDriverType from "../lib/getDriverName";
import BaseConnector from "../BaseConnector";
import ConnectError from "../exceptions/ConnectError";
import DeviceNotOpen from "../exceptions/DeviceNotOpen";
import {EventEmitter} from "events";
import {UnConnectedBleDriver} from "../driver/UnConnectedDriver";
import DeviceSendFail from "../exceptions/DeviceSendFail";
import isFlutterAppIOS from "../lib/isFlutterAppIOS";

declare var WebViewJavascriptBridge: any;
declare var WKWebViewJavascriptBridge: any;

interface IDiscoverData {
    deviceId: string;
    name: string;
    rssi: number;
}

interface IDevice {
    name: string;
    rssi: number;
    deviceId: string;
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

const discover = (data: IDiscoverData) => {
    if (filter(data.name)) {
        const name = data.name.replace(BLE_FILTER_REGEXP, "$1$2");
        const deviceInfo: IDevice = {
            name,
            rssi: data.rssi,
            deviceId: data.deviceId,
        };
        if (deviceMaps[data.name]) {
            clearTimeout(deviceMaps[data.name].timer);
        }
        deviceMaps[data.name] = {
            // @ts-ignore
            timer: setTimeout(() => {
                delete deviceMaps[data.name];
            }, BLE_SCAN_LIFECYCLE),
            device: deviceInfo,
        };
    }
};

// @ts-ignore
let stopScanTimer: NodeJS.Timer = null;

interface IFlutterCharacteristic {
    uuid: string;
    serviceUuid: string;
    properties: string[];
}

const promiseCallHandler = (funcName: string, arg: string): Promise<string> => new Promise((resolve) => {
    isFlutterAppIOS ?
        WKWebViewJavascriptBridge.callHandler(funcName, {'name':arg}, (responseData: string) => resolve(responseData)) :
        WebViewJavascriptBridge.callHandler(funcName, arg, (responseData: string) => resolve(responseData));
});
const RegisterHandler = (funcName: string, func: (data: string, responseCallback: any) => void) => {
    isFlutterAppIOS ?
        WKWebViewJavascriptBridge.registerHandler(funcName, func) :
        WebViewJavascriptBridge.registerHandler(funcName, func);
};

class BlueToothCharacteristic extends EventEmitter implements BleCharacteristic {
    private readonly characteristic: IFlutterCharacteristic;
    // @ts-ignore
    private readonly connector: BlueToothConnector = null;
    public readonly uuid: string;
    // @ts-ignore
    private customHandler: DataHandler;

    private dataHandle = (resolve: any) => (data: number[]) => {
        resolve(data);
    }

    constructor(characteristic: IFlutterCharacteristic, connector: BlueToothConnector) {
        super();
        this.setMaxListeners(20);
        this.characteristic = characteristic;
        this.uuid = this.characteristic.uuid;
        this.connector = connector;

        if (this.characteristic.properties.includes("notify")) {
            RegisterHandler(`handleNotifyData${this.uuid}`, (data: string) => {
                try {
                    const results = JSON.parse(data);
                    this.emit("data", new Uint8Array(results));
                } catch (error) {
                    // do nothing
                }
            });
        }
    }

    public setDataHandle(handler?: DataHandler) {
        // @ts-ignore
        this.customHandler = handler;
    }

    public async send(data: Uint8Array, withoutResponse: boolean = false, step = 20) {
        this.connector.isOpen(true);
        return new Promise<Uint8Array>(async (resolve, reject) => {
            if (!withoutResponse) {
                const timer = setTimeout(() => {
                    this.removeListener("data", dataHandler);
                    reject(new DeviceSendFail("send timeout"));
                }, DRIVER_SEND_TIMEOUT);
                const resolveHandler = (data: Uint8Array) => {
                    clearTimeout(timer);
                    this.removeListener("data", dataHandler);
                    resolve(data);
                };

                const dataHandler = (this.customHandler || this.dataHandle)(resolveHandler);
                this.on("data", dataHandler);
            }

            // @ts-ignore
            const stringData = String.fromCharCode.apply(null, data);
            const args = JSON.stringify(
                [this.characteristic.uuid, stringData, step.toString()]);
            await promiseCallHandler("onWrite", args);
            if (withoutResponse) {
                resolve(new Uint8Array(0));
            }
        });
    }
}

export default class BlueToothConnector extends BaseConnector implements BleConnector {
    private isOpenFlag: boolean = false;

    private closeHandle = () => {
        this.isOpenFlag = false;
        this.emit("close");
    }

    public static isReady() {
        return true;
    }

    public static unConnectBleDriver(name: string, rssi: number, deviceId: string): UnConnectedBleDriver {
        const deviceInfo: IDevice = {
            name: name,
            rssi: rssi,
            deviceId: deviceId,
        };
        const ble = new BlueToothConnector(deviceInfo);
        return new UnConnectedBleDriver(name, ble);
    }

    public static async list(): Promise<(null | UnConnectedBleDriver)[]> {
        if (stopScanTimer === null) {
            RegisterHandler("discover", (data: string, responseCallback: any) => {
                const scanData = JSON.parse(data);
                const device: IDiscoverData = {
                    name: scanData[0],
                    rssi: scanData[1],
                    deviceId: scanData[2],
                };
                discover(device);
            });
            await promiseCallHandler("onStartScan", "");
        }
        clearTimeout(stopScanTimer);
        // @ts-ignore
        stopScanTimer = setTimeout(() => {
            deviceMaps = {};
            // @ts-ignore
            stopScanTimer = null;
            promiseCallHandler("onStopScan", "");
        }, BLE_SCAN_STOP_TIMEOUT);

        return Object.keys(deviceMaps).map((key) => deviceMaps[key].device).sort((a, b) => a.rssi < b.rssi ? 1 : -1).map((item) => {
            const name = getDriverType([item]);
            if (!name) {
                return null;
            }
            const ble = new BlueToothConnector(item);
            return new UnConnectedBleDriver(name, ble);
        }).filter((item) => !!item);
    }

    public async open() {
        if (this.isOpen()) {
            throw new ConnectError("already opened");
        }
        this.isOpenFlag = true;
        RegisterHandler("disconnect", (data: string, responseCallback: any) => {
            this.close();
        });
        await promiseCallHandler("onConnect", "");
    }

    public async discoverCharacteristics(serviceUUIDs: string[], characteristicUUIDs: string[]): Promise<BleCharacteristic[]> {
        await promiseCallHandler("onDiscoverServices", JSON.stringify(serviceUUIDs));
        const response = await promiseCallHandler("onDiscoverCharacteristics", JSON.stringify(characteristicUUIDs));
        return JSON.parse(response).map((item: any) => {
            const characteristic: IFlutterCharacteristic = {
                // @ts-ignore
                uuid: characteristicUUIDs.find((uuid) => uuid === item.uuid.substring(4, 8)),
                serviceUuid: item.serviceUuid,
                properties: JSON.parse(JSON.stringify(item.properties)),
            };
            return new BlueToothCharacteristic(characteristic, this);
        });
    }

    public async close() {
        this.closeHandle();
        await promiseCallHandler("onDisconnect", "");
    }

    public isOpen(rejectWhenNotOpen: boolean = false) {
        const isEmpty = this.isOpenFlag;
        if (!isEmpty && rejectWhenNotOpen) {
            throw new DeviceNotOpen("please open first");
        }
        return isEmpty;
    }
}
