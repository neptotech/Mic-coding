import {BAUD_RATE, Connector, DataHandler} from "../interface";
import BaseConnector from "../BaseConnector";
import DeviceNotOpen from "../exceptions/DeviceNotOpen";
import {MSerialPortConnection} from "../MSerialPortConnection";
import wait from "../lib/wait";
import groupBy from "../lib/groupBy";
import {DRIVER_SEND_TIMEOUT} from "../constance";
import {ALL_CLOSE, DEVICE_TYPE_SERIAL_PORT} from "../MConnectionBase";
import {IMConnectionData} from "../MConnectionInterface";
import md5 from "../md5";
import isChromeOs from "../lib/isChromeOs";
import {UnConnectedSerialportDriver} from "../driver/UnConnectedDriver";
import getDriverName from "../lib/getDriverName";
import DeviceSendFail from "../exceptions/DeviceSendFail";

const mConnection = new MSerialPortConnection(DEVICE_TYPE_SERIAL_PORT);

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

export default class MConnectionSerialPortConnector extends BaseConnector implements Connector {
    private isOpenFlag: boolean = false;
    // @ts-ignore
    private customHandler: DataHandler;

    private dataHandle = (resolve: any) => (data: number[]) => {
        resolve(data);
    }

    public static isReady() {
        return mConnection.isReady();
    }

    public static async list(): Promise<(null | UnConnectedSerialportDriver)[]> {
        if (!mConnection.isReady()) {
            return [];
        }
        const list = await mConnection.listSerialPortDevice();
        const results = list
            .map((item) => ({
                ...item,
                ...{
                    productId: item.productId.toString(16),
                    vendorId: item.vendorId.toString(16),
                },
            }))
            .filter((item) => !/usbserial-/.test(item.deviceId));
        if (isChromeOs) {
            // MARK 在chromeOS下，拿不到serialNumber，所以要生成一个，会导致每次拿到的serialNumber不一样，也就是显示的名字会每次不一样
            let ct = "";
            for (const item of results) {
                if (item.vendorId.toLowerCase() === "10c4" && item.productId.toLowerCase() === "ea70") {
                    if (ct) {
                        item.serialNumber = ct;
                        ct = "";
                        continue;
                    }
                    ct = item.deviceId;
                    item.serialNumber = ct;
                } else {
                    item.serialNumber = item.deviceId;
                }
            }
        }
        return groupBy(
            results
            , (item) => (item.serialNumber || item.deviceId),
        )
            .map((item) => {
                const name = getDriverName(item.members, md5(item.key, 6));
                if (name === null) {
                    return null;
                }
                const connectors = item.members.map((member) => new MConnectionSerialPortConnector({deviceId: member.deviceId}));
                return new UnConnectedSerialportDriver(name, connectors);
            })
            .filter((item) => !!item);
    }

    public async setDTR(dtr: boolean) {
        return mConnection.setDTR(this.connectionInfo.deviceId, dtr);
    }

    public setDataHandle(handler?: DataHandler) {
        // @ts-ignore
        this.customHandler = handler;
    }

    public async send(data: Uint8Array, withoutResponse: boolean = false): Promise<Uint8Array> {
        this.isOpen(true);
        await mConnection.send(this.connectionInfo.deviceId, data);
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
                if (data.from.deviceId === this.connectionInfo.deviceId) {
                    dataReceiver(data.content.receiveData);
                }
            };
            mConnection.on("data", dataHandler);
        });
    }

    public async open(baudRate: BAUD_RATE): Promise<void> {
        if (this.isOpen()) {
            return mConnection.updateBaudRate(this.connectionInfo.deviceId, baudRate);
        }
        await mConnection.openDevice(this.connectionInfo.deviceId, baudRate);
        const closeHandle = (deviceId: string) => {
            if (deviceId === ALL_CLOSE || deviceId === this.connectionInfo.deviceId) {
                mConnection.removeListener("close", closeHandle);
                mConnection.removeListener("data", handler);
                this.emit("close");
            }
        };
        const handler = (data: IMConnectionData) => {
            if (data.from.deviceId === this.connectionInfo.deviceId) {
                this.emit("data", new Uint8Array(data.content.receiveData));
            }
        };
        mConnection.on("data", handler);
        mConnection.on("close", closeHandle);
        this.isOpenFlag = true;
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
