import {IMConnectionCharacteristic} from "./MConnectionInterface";
import {DRIVER_SEND_TIMEOUT} from "./constance";
import {ALL_MESSAGES, MConnectionBase} from "./MConnectionBase";
import {BAUD_RATE} from "./interface";

interface IDriverInfo {
    name: string;
    deviceId: string;
    manufacturer: string;
    serialNumber: string;
    pnpId: string;
    systemLocation: string;
    vendorId: number;
    productId: number;
}

export class MSerialPortConnection extends MConnectionBase  {
    // @ts-ignore
    private baudRate: BAUD_RATE;
    public async listSerialPortDevice(): Promise<IDriverInfo[]> {
        if (!this.isReady()) {
            return [];
        }
        return await this.timerSendMessage<IDriverInfo[]>({
            method: "GetDeviceList",
        }, async (e) => {
            const connected = await this.processMessage(e.data, ALL_MESSAGES.LIST_SERIAL_PORT_DEVICE);
            if (connected) {
                return connected.content.deviceInfoList;
            }
        });
    }

    public async openDevice(deviceId: string, baudRate?: BAUD_RATE) {
        await this.timerSendMessage({
            method: "ConnectDevice",
            parameter: {deviceId, baudRate},
        }, async (e) => {
            const connected = await this.processMessage(e.data, ALL_MESSAGES.DEVICE_CONNECTED);
            if (connected && connected.from.deviceId === deviceId) {
                return true;
            }
        });
        const closeHandle = async (e: MessageEvent) => {
            const disconnected = await this.processMessage(e.data, ALL_MESSAGES.DEVICE_DISCONNECTED);
            if (disconnected && disconnected.from.deviceId === deviceId) {
                this.emit("close", deviceId);
                // @ts-ignore
                this.connection.removeEventListener("message", closeHandle);
            }
        };
        // @ts-ignore
        this.connection.addEventListener("message", closeHandle);
        // @ts-ignore
        this.baudRate = baudRate;
    }

    public async updateBaudRate(deviceId: string, baudRate: BAUD_RATE) {
        if (this.baudRate === baudRate) {
            return;
        }
        await this.timerSendMessage({
            method: "SetBaudRate",
            parameter: {deviceId, baudRate},
        }, async (e) => {
            const setBaudRate = await this.processMessage(e.data, ALL_MESSAGES.SET_BAUD_RATE);
            if (setBaudRate && setBaudRate.from.deviceId === deviceId && setBaudRate.content.currentBaudRate === baudRate) {
                this.baudRate = baudRate;
                return true;
            }
        });
    }

    public async closeDevice(deviceId: string) {
        return this.timerSendMessage<Promise<void>>({
            method: "DisconnectDevice",
            parameter: {deviceId: deviceId},
        }, async (e: MessageEvent) => {
            const disconnected = await this.processMessage(e.data, ALL_MESSAGES.DEVICE_DISCONNECTED);
            if (disconnected && disconnected.from.deviceId === deviceId) {
                this.emit("close", deviceId);
                return true;
            }
        });
    }

    public async setDTR(deviceId: string, dtr: boolean) {
        return this.timerSendMessage<Promise<void>>({
            method: "SetDTR",
            parameter: {deviceId: deviceId, DTRState: dtr},
        }, async (e: MessageEvent) => {
            const setDTR = await this.processMessage(e.data, ALL_MESSAGES.DTR_STATE);
            if (setDTR && setDTR.from.deviceId === deviceId && dtr === setDTR.content.DTRState) {
                return true;
            }
        });
    }

    public async send(deviceId: string, data: Uint8Array) {
        return this.timerSendMessage<IMConnectionCharacteristic[]>({
            method: "WriteData",
            parameter: {
                // @ts-ignore
                data: [...data],
                deviceId,
            },
        }, async (e: MessageEvent) => {
            const getCharacteristic = await this.processMessage(e.data, ALL_MESSAGES.WRITE_DATA);
            if (getCharacteristic && getCharacteristic.from.deviceId === deviceId) {
                return true;
            }
        }, DRIVER_SEND_TIMEOUT);
    }
}
