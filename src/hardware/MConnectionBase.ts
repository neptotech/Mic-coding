import {EventEmitter} from "events";
import {IMConnectionData} from "./MConnectionInterface";

export const ALL_CLOSE = "ALL";

const WEB_SOCKET_URI = "ws://localhost:5741";

export const ALL_MESSAGES = {
    READY: "ready",
    SCAN_START: "scanStart",
    SCAN_STOP: "scanStop",
    SCAN_DATA: "scanData",
    DEVICE_CONNECTED: "deviceConnected",
    DEVICE_DISCONNECTED: "deviceDisconnected",
    GET_DEVICE_SERVICE_LIST: "getDeviceServiceList",
    GET_DEVICE_CHARACTERISTIC_LIST: "getCharacteristicList",
    SET_DEVICE_NOTIFY: "setDeviceNotify",
    WRITE_DATA: "writeData",
    RECEIVE_DATA: "receiveData",

    // serialPort
    LIST_SERIAL_PORT_DEVICE: "deviceInfoList",

    DTR_STATE: "DTRState",
    SET_BAUD_RATE: "setBaudRate",
};

const TEST_ALL_MESSAGE = {
    [ALL_MESSAGES.READY]: (messageData: IMConnectionData) => {
        return messageData.content.clientConnected === true;
    },

    [ALL_MESSAGES.SCAN_START]: (messageData: IMConnectionData) => {
        return messageData.content.bleDeviceScanState === true;
    },

    [ALL_MESSAGES.SCAN_STOP]: (messageData: IMConnectionData) => {
        return messageData.content.bleDeviceScanState === false;
    },

    [ALL_MESSAGES.SCAN_DATA]: (messageData: IMConnectionData) => {
        return typeof messageData.content.deviceInfo !== "undefined";
    },

    [ALL_MESSAGES.SCAN_DATA]: (messageData: IMConnectionData) => {
        return typeof messageData.content.deviceInfo !== "undefined";
    },

    [ALL_MESSAGES.DEVICE_CONNECTED]: (messageData: IMConnectionData) => {
        return messageData.content.deviceConnected === true;
    },

    [ALL_MESSAGES.DEVICE_DISCONNECTED]: (messageData: IMConnectionData) => {
        return messageData.content.deviceDisconnected === true;
    },

    [ALL_MESSAGES.GET_DEVICE_SERVICE_LIST]: (messageData: IMConnectionData) => {
        return typeof messageData.content.bleServiceList !== "undefined";
    },

    [ALL_MESSAGES.GET_DEVICE_CHARACTERISTIC_LIST]: (messageData: IMConnectionData) => {
        return typeof messageData.content.characteristicList !== "undefined";
    },

    [ALL_MESSAGES.SET_DEVICE_NOTIFY]: (messageData: IMConnectionData) => {
        return typeof messageData.content.notification !== "undefined";
    },

    [ALL_MESSAGES.WRITE_DATA]: (messageData: IMConnectionData) => {
        return messageData.content.writeDataSccessed === true;
    },

    [ALL_MESSAGES.RECEIVE_DATA]: (messageData: IMConnectionData) => {
        return typeof messageData.content.receiveData !== "undefined";
    },

    [ALL_MESSAGES.LIST_SERIAL_PORT_DEVICE]: (messageData: IMConnectionData) => {
        return typeof messageData.content.deviceInfoList !== "undefined";
    },

    [ALL_MESSAGES.DTR_STATE]: (messageData: IMConnectionData) => {
        return typeof messageData.content.DTRState !== "undefined";
    },

    [ALL_MESSAGES.SET_BAUD_RATE]: (messageData: IMConnectionData) => {
        return typeof messageData.content.currentBaudRate !== "undefined";
    },
};

export const DEVICE_TYPE_SERIAL_PORT = "serialport";
export const DEVICE_TYPE_BLE = "ble";

export type IDeviceType = "serialport" | "ble";

export class MConnectionBase extends EventEmitter {
    protected connection: WebSocket | undefined;
    private ready = false;
    private readonly deviceType: IDeviceType;

    constructor(deviceType: IDeviceType) {
        super();
        this.deviceType = deviceType;
    }

    protected async processMessage(data: string, cmdType: string) {
        let messageData: IMConnectionData;
        try {
            messageData = JSON.parse(data);
        } catch (e) {
            return;
        }
        if (!messageData.content || !messageData.message || !messageData.from) {
            return;
        }
        switch (messageData.message) {
            case "info": {
                return await this.processInfoMessage(messageData, cmdType);
            }
            case "data": {
                return this.processDataMessage(messageData, cmdType);
            }
            default: {
                return this.processError(messageData, cmdType);
            }
        }
    }

    protected timerSendMessage<T>(message: any, handle: (e: MessageEvent) => Promise<any>, timeout: number = 2000) {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
                // @ts-ignore
                this.connection.removeEventListener("message", messageHandle);
                reject(new Error("timeout"));
            }, timeout);
            const messageHandle = async (e: MessageEvent) => {
                try {
                    const result = await handle(e);
                    if (result) {
                        // @ts-ignore
                        this.connection.removeEventListener("message", messageHandle);
                        clearTimeout(timer);
                        resolve(result);
                    }
                } catch (e) {
                    // @ts-ignore
                    this.connection.removeEventListener("message", messageHandle);
                    reject(e);
                }
            };
            // @ts-ignore
            this.connection.addEventListener("message", messageHandle);
            this.sendMessage(message);
        });
    }

    protected sendMessage(data: any) {
        if (!data.parameter) {
            data.parameter = {};
        }
        data.parameter.deviceType = this.deviceType;
        // @ts-ignore
        if (this.connection.OPEN) {
            // @ts-ignore
            this.connection.send(JSON.stringify(data));
        }
    }

    private async processError(messageData: IMConnectionData, cmdType: string) {
        throw new Error(`[${cmdType}]${JSON.stringify(messageData)}`);
    }

    private async processInfoMessage(messageData: IMConnectionData, cmdType: string) {
        if (!cmdType || typeof TEST_ALL_MESSAGE[cmdType] !== "function") {
            return;
        }

        if (TEST_ALL_MESSAGE[cmdType](messageData)) {
            return messageData;
        }
    }

    private processDataMessage(messageData: IMConnectionData, cmdType: string) {
        return this.processInfoMessage(messageData, cmdType);
    }

    public async openConnection() {
        if (this.ready) {
            return;
        }
        return new Promise((resolve, reject) => {
            this.connection = new WebSocket(WEB_SOCKET_URI);
            this.connection.onerror = () => {
                this.emit("connectionClosed");
            };
            this.connection.onopen = () => {
                const readyHandle = async (e: MessageEvent) => {
                    const message = await this.processMessage(e.data, ALL_MESSAGES.READY);
                    if (message) {
                        this.ready = true;
                        // @ts-ignore
                        this.connection.removeEventListener("message", readyHandle);
                        const dataHandle = async (e: MessageEvent) => {
                            const data = await this.processMessage(e.data, ALL_MESSAGES.RECEIVE_DATA);
                            if (data) {
                                this.emit("data", data);
                                return;
                            }
                            const close = await this.processMessage(e.data, ALL_MESSAGES.DEVICE_DISCONNECTED);
                            if (close) {
                                this.emit("close", close.from.deviceId);
                            }
                        };
                        const closeEmitHandle = () => {
                            if (this.connection) {
                                this.connection.removeEventListener("message", dataHandle);
                                this.connection.removeEventListener("close", closeEmitHandle);
                            }
                            this.emit("close", ALL_CLOSE);
                            this.emit("connectionClosed");
                        };
                        // @ts-ignore
                        this.connection.addEventListener("message", dataHandle);
                        // @ts-ignore
                        this.connection.addEventListener("close", closeEmitHandle);
                        resolve();
                    }
                };
                const closeHandle = () => {
                    this.ready = false;
                    if (this.connection) {
                        this.connection.removeEventListener("message", readyHandle);
                        this.connection.removeEventListener("close", closeHandle);
                    }
                    reject();
                };
                // @ts-ignore
                this.connection.addEventListener("close", closeHandle);
                // @ts-ignore
                this.connection.addEventListener("message", readyHandle);
            };
        });
    }

    public closeConnection() {
        if (this.connection) {
            if (this.connection.OPEN) {
                this.connection.close();
            }
        }
        this.emit("connectionClosed");
    }

    public isReady() {
        return this.ready;
    }

}
