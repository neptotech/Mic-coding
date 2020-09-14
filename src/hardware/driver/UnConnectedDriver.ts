import {BAUD_RATE, BleConnector, Connector} from "../interface";
import {BLE_KIT_DRIVER_MAP, SERIAL_PORT_KIT_DRIVER_MAP} from "../constance";

export class UnConnectedSerialportDriver {
    public readonly name: string;
    public readonly type = "serialport";
    private readonly connectors: Connector[];

    constructor(name: string, connectors: Connector[]) {
        this.name = name;
        this.connectors = connectors;
    }

    public async openWithKit(kit: string, baudRate: BAUD_RATE) {
        const Driver = SERIAL_PORT_KIT_DRIVER_MAP[kit];
        if (typeof Driver === "undefined") {
            throw new Error("kit not support");
        }
        const device = new Driver(this.name, this.connectors);
        await device.open(baudRate);
        return device;
    }
}

export class UnConnectedBleDriver {
    public readonly name: string;
    public readonly type = "ble";
    private readonly ble: BleConnector;

    constructor(name: string, ble: BleConnector) {
        this.name = name;
        this.ble = ble;
    }

    public async openWithKit(kit: string, baudRate?: BAUD_RATE) {
        const Driver = BLE_KIT_DRIVER_MAP[kit];
        if (typeof Driver === "undefined") {
            throw new Error("kit not support");
        }
        const device = new Driver(this.name, this.ble);
        await device.open(baudRate);
        return device;
    }
}
