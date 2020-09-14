import {IMConnectionCharacteristic, IMConnectionService} from "./MConnectionInterface";
import {DRIVER_SEND_TIMEOUT} from "./constance";
import {ALL_MESSAGES, MConnectionBase} from "./MConnectionBase";

export class MBleConnection extends MConnectionBase {
    private scanning = false;

    private scanDataHandle = async (e: MessageEvent) => {
        const start = await this.processMessage(e.data, ALL_MESSAGES.SCAN_START);
        if (start) {
            return;
        }
        const data = await this.processMessage(e.data, ALL_MESSAGES.SCAN_DATA);
        if (data) {
            if (this.scanning) {
                this.emit("discover", data.content.deviceInfo);
            }
            return;
        }
        const stop = await this.processMessage(e.data, ALL_MESSAGES.SCAN_STOP);
        if (stop) {
            // @ts-ignore
            this.connection.removeEventListener("message", this.scanDataHandle);
            if (this.scanning) {
                this.startScan();
            }
        }
    }

    public async openDevice(deviceId: string) {
        await this.timerSendMessage({
            method: "ConnectDevice",
            parameter: {deviceId},
        }, async (e) => {
            const connected = await this.processMessage(e.data, ALL_MESSAGES.DEVICE_CONNECTED);
            if (connected && connected.from.deviceId === deviceId) {
                return true;
            }
        }, 8000);
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
    }

    public async closeDevice(deviceId: string) {
        return this.timerSendMessage<Promise<void>>({
            method: "DisconnectDevice",
            parameter: {deviceId: deviceId},
        }, async (e: MessageEvent) => {
            const disconnected = await this.processMessage(e.data, ALL_MESSAGES.DEVICE_DISCONNECTED);
            if (disconnected && disconnected.from.deviceId === deviceId) {
                return true;
            }
        });
    }

    public async getServiceList(deviceId: string): Promise<IMConnectionService[]> {
        return this.timerSendMessage<IMConnectionService[]>({
            method: "GetServiceList",
            parameter: {deviceId: deviceId},
        }, async (e: MessageEvent) => {
            const getService = await this.processMessage(e.data, ALL_MESSAGES.GET_DEVICE_SERVICE_LIST);
            if (getService && getService.from.deviceId === deviceId) {
                return getService.content.bleServiceList;
            }
        });
    }

    public async getCharacteristicList(deviceId: string, serviceUuid: string): Promise<IMConnectionCharacteristic[]> {
        return this.timerSendMessage<IMConnectionCharacteristic[]>({
            method: "GetCharacteristicList",
            parameter: {deviceId: deviceId, serviceUuid: serviceUuid},
        }, async (e: MessageEvent) => {
            const getCharacteristic = await this.processMessage(e.data, ALL_MESSAGES.GET_DEVICE_CHARACTERISTIC_LIST);
            if (getCharacteristic && getCharacteristic.from.deviceId === deviceId && serviceUuid === getCharacteristic.from.serviceUuid) {
                return getCharacteristic.content.characteristicList;
            }
        });
    }

    public async setNotify(deviceId: string, serviceUuid: string, characteristicUuid: string, enableNotify: boolean) {
        return this.timerSendMessage<IMConnectionCharacteristic[]>({
            method: "SetCharacteristicNotification",
            parameter: {
                enableNotify,
                deviceId,
                characteristicUuid,
                serviceUuid,
            },
        }, async (e: MessageEvent) => {
            const getCharacteristic = await this.processMessage(e.data, ALL_MESSAGES.SET_DEVICE_NOTIFY);
            if (getCharacteristic && getCharacteristic.from.deviceId === deviceId && serviceUuid === getCharacteristic.from.serviceUuid && characteristicUuid === getCharacteristic.from.characteristicUuid && getCharacteristic.content.notification === enableNotify) {
                return true;
            }
        });
    }

    public async write(deviceId: string, serviceUuid: string, characteristicUuid: string, data: Uint8Array, bleDataStep: number) {
        return this.timerSendMessage<void>({
            method: "WriteData",
            parameter: {
                // @ts-ignore
                data: [...data],
                deviceId,
                characteristicUuid,
                serviceUuid,
                bleDataStep,
            },
        }, async (e: MessageEvent) => {
            const getCharacteristic = await this.processMessage(e.data, ALL_MESSAGES.WRITE_DATA);
            if (getCharacteristic && getCharacteristic.from.deviceId === deviceId && serviceUuid === getCharacteristic.from.serviceUuid && characteristicUuid === getCharacteristic.from.characteristicUuid) {
                return true;
            }
        }, DRIVER_SEND_TIMEOUT);
    }

    public startScan() {
        this.scanning = true;
        this.sendMessage({method: "GetDeviceList", parameter: {limitedRssi: -100}});
        // @ts-ignore
        this.connection.addEventListener("message", this.scanDataHandle);
    }

    public stopScan() {
        this.scanning = false;
        // @ts-ignore
        this.connection.removeEventListener("message", this.scanDataHandle);
        this.sendMessage({method: "StopGetDeviceList"});
    }
}
