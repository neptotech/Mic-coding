import {
    BLE_FILTER_REGEXP,
    BLE_SCAN_LIFECYCLE, BLE_SCAN_STOP_TIMEOUT, DRIVER_SEND_TIMEOUT,
} from "../constance";
import {BleCharacteristic, BleConnector, DataHandler} from "../interface";
import getDriverType from "../lib/getDriverName";
import BaseConnector from "../BaseConnector";
import DeviceNotOpen from "../exceptions/DeviceNotOpen";
import {IMConnectionCharacteristic, IMConnectionData, IMConnectionDiscoverData} from "../MConnectionInterface";
import {MBleConnection} from "../MBleConnection";
import wait from "../lib/wait";
import {ALL_CLOSE, DEVICE_TYPE_BLE} from "../MConnectionBase";
import {EventEmitter} from "events";
import ConnectError from "../exceptions/ConnectError";
import {UnConnectedBleDriver} from "../driver/UnConnectedDriver";
import DeviceSendFail from "../exceptions/DeviceSendFail";

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

const discover = (data: IMConnectionDiscoverData) => {
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
const mConnection = new MBleConnection(DEVICE_TYPE_BLE);

const openConnection = () => {
    mConnection.openConnection().catch(async () => {
        await wait(1000);
        openConnection();
    });
};

mConnection.on("connectionClosed", async () => {
    await wait(1000);
    openConnection();
});

if (!mConnection.isReady()) {
    openConnection();
}

class BlueToothCharacteristic extends EventEmitter implements BleCharacteristic {
    private readonly characteristic: IMConnectionCharacteristic;
    private readonly connector: MConnectionBlueToothConnector;
    public readonly uuid: string;
    // @ts-ignore
    private customHandler: DataHandler;

    private dataHandle = (resolve: any) => (data: number[]) => {
        resolve(data);
    }

    constructor(characteristic: IMConnectionCharacteristic, connector: MConnectionBlueToothConnector) {
        super();
        this.characteristic = characteristic;
        this.connector = connector;
        this.uuid = this.characteristic.uuid.replace(/{0000(.*?)-.*/, "$1");
        if (this.characteristic.properties.includes("Notify")) {
            let results: number[] = [];
            let timer: NodeJS.Timer;
            mConnection.setNotify(this.characteristic.deviceId, this.characteristic.serviceUuid, this.characteristic.uuid, true);
            const handler = (data: IMConnectionData) => {
                if (data.from.deviceId === this.characteristic.deviceId && data.from.serviceUuid === this.characteristic.serviceUuid && data.from.characteristicUuid === this.characteristic.uuid) {
                    results = results.concat([...data.content.receiveData]);
                    clearTimeout(timer);
                    // @ts-ignore
                    timer = setTimeout(() => {
                        this.emit("data", new Uint8Array(results));
                        results = [];
                    }, 30);
                }
            };
            mConnection.on("data", handler);
            this.connector.once("close", () => {
                mConnection.removeListener("data", handler);
            });
        }
    }

    public setDataHandle(handler?: DataHandler) {
        // @ts-ignore
        this.customHandler = handler;
    }

    public async send(data: Uint8Array, withoutResponse: boolean = false, step: number = 20) {
        await mConnection.write(this.characteristic.deviceId, this.characteristic.serviceUuid, this.characteristic.uuid, data, step);
        if (withoutResponse) {
            return new Uint8Array(0);
        }
        return new Promise<Uint8Array>((resolve, reject) => {
            const timer = setTimeout(() => {
                mConnection.removeListener("data", dataHandler);
                reject(new DeviceSendFail("send timeout"));
            }, DRIVER_SEND_TIMEOUT);
            const resolveHandler = (data: any) => {
                clearTimeout(timer);
                mConnection.removeListener("data", dataHandler);
                resolve(data);
            };

            const dataReceiver = (this.customHandler || this.dataHandle)(resolveHandler);
            const dataHandler = (data: IMConnectionData) => {
                if (data.from.deviceId === this.characteristic.deviceId && data.from.serviceUuid === this.characteristic.serviceUuid && data.from.characteristicUuid === this.characteristic.uuid) {
                    dataReceiver(data.content.receiveData);
                }
            };

            mConnection.on("data", dataHandler);
        });
    }
}

export default class MConnectionBlueToothConnector extends BaseConnector implements BleConnector {
    private isOpenFlag: boolean = false;
    // @ts-ignore
    public connectionInfo: IDevice;

    public static version() {

    }

    public static isReady() {
        return mConnection.isReady();
    }

    public static async list(): Promise<(null | UnConnectedBleDriver)[]> {
        if (!mConnection.isReady()) {
            return [];
        }
        if (stopScanTimer === null) {
            mConnection.on("discover", discover);
            mConnection.startScan();
        }
        clearTimeout(stopScanTimer);
        // @ts-ignore
        stopScanTimer = setTimeout(() => {
            deviceMaps = {};
            // @ts-ignore
            stopScanTimer = null;
            mConnection.stopScan();
        }, BLE_SCAN_STOP_TIMEOUT);
        return Object.keys(deviceMaps).map((key) => deviceMaps[key].device).sort((a, b) => a.rssi < b.rssi ? 1 : -1).map((item) => {
            const name = getDriverType([item]);
            if (!name) {
                return null;
            }
            const ble = new MConnectionBlueToothConnector(item);
            return new UnConnectedBleDriver(name, ble);
        }).filter((item) => !!item);
    }

    public async open() {
        if (this.isOpen()) {
            throw new ConnectError("already opened");
        }
        this.isOpenFlag = true;
        await mConnection.openDevice(this.connectionInfo.deviceId);
        const closeHandle = (deviceId: string) => {
            if (deviceId === ALL_CLOSE || deviceId === this.connectionInfo.deviceId) {
                mConnection.removeListener("close", closeHandle);
                this.isOpenFlag = false;
                this.emit("close");
            }
        };
        mConnection.on("close", closeHandle);
    }

    public async discoverCharacteristics(serviceUUIDs: string[], characteristicUUIDs: string[]): Promise<BleCharacteristic[]> {
        const serviceList = (await mConnection.getServiceList(this.connectionInfo.deviceId))
            .filter((service) => serviceUUIDs.find((uuid) => new RegExp(`^{0000${uuid}`).test(service.uuid))).map((item) => {
                item.deviceId = this.connectionInfo.deviceId;
                return item;
            });
        return (await Promise.all(
            serviceList.map(async (service) =>
                (await mConnection.getCharacteristicList(this.connectionInfo.deviceId, service.uuid))
                    .filter((characteristic) =>
                        characteristicUUIDs.find((uuid) =>
                            new RegExp(`^{0000${uuid}`).test(characteristic.uuid)),
                    )
                    .map((characteristic) => {
                        characteristic.deviceId = this.connectionInfo.deviceId;
                        characteristic.serviceUuid = service.uuid;
                        return characteristic;
                    })),
        )).reduce((prev, next) => prev.concat(next), []).map((characteristic) => new BlueToothCharacteristic(characteristic, this));
    }

    public async close() {
        await mConnection.closeDevice(this.connectionInfo.deviceId);
        this.emit("close");
        this.isOpenFlag = false;
    }

    public isOpen(rejectWhenNotOpen: boolean = false) {
        const isEmpty = this.isOpenFlag;
        if (!isEmpty && rejectWhenNotOpen) {
            throw new DeviceNotOpen("please open first");
        }
        return isEmpty;
    }
}
