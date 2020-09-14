export interface IMConnectionData {
    content: any;
    from: {
        name: string;
        type: "ble" | "serialport";
        address: string;
        [key: string]: string | number;
    };
    message: "info" | "error" | "data" | "warning";
}

export interface IMConnectionDiscoverData {
    deviceId: string;
    name: string;
    paired: boolean;
    rssi: number;
    type: "ble" | "serialport";
}

export interface IMConnectionService {
    deviceId: string;
    uuid: string;
    name: string;
}

export interface IMConnectionCharacteristic {
    deviceId: string;
    serviceUuid: string;
    uuid: string;
    name: string;
    properties: IMConnectionProperties[];
    value: string;
}

export type IMConnectionProperties = "WriteNoResponse" | "Notify" | "Read" | "Write";
