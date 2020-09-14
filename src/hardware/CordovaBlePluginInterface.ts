declare namespace ble {
    export interface IDeviceInfo {
        name: string;
        id: string;
        rssi: number;
        advertising: ArrayBuffer | { [key: string]: any };
    }

    type IDeviceDiscoverCallBack = (deviceInfo: IDeviceInfo) => void;
    type IErrorCallBack = (error: IDeviceInfo) => void;
    type ISuccessCallBack = () => void;
    type ISuccessDataCallBack = (data: any) => void;

    export function scan(services: string[], seconds: number, onDeviceDiscover: IDeviceDiscoverCallBack, onError: IErrorCallBack): void;

    export function startScan(services: string[], onDeviceDiscover: IDeviceDiscoverCallBack, onError: IErrorCallBack): void;

    export function stopScan(success: ISuccessCallBack, onError: IErrorCallBack): void;

    export function startScanWithOptions(services: string[], options: { reportDuplicates: boolean; }, onDeviceDiscover: IDeviceDiscoverCallBack, onError: IErrorCallBack): void;

// iOS only
    export function connectedPeripheralsWithServices(services: string[], success: ISuccessDataCallBack, onError: IErrorCallBack): void;

// iOS only
    export function peripheralsWithIdentifiers(identifiers: string[], success: ISuccessDataCallBack, onError: IErrorCallBack): void;

// Android only
    export function bondedDevices(success: ISuccessDataCallBack, onError: IErrorCallBack): void;

// this will probably be removed
//     export function list(success, onError: IErrorCallBack): void;

    export function connect(deviceId: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

    // export function autoConnect(deviceId: string, connectCallback, disconnectCallback): void;

    export function disconnect(deviceId: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

    // export function requestMtu(deviceId: string, mtu, success, onError: IErrorCallBack): void;

    // export function refreshDeviceCache(deviceId: string, timeoutMillis, success, onError: IErrorCallBack): void;

// characteristic value comes back as ArrayBuffer in the success callback
    export function read(deviceId: string, serviceUuid: string, characteristicUuid: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

// RSSI value comes back as an integer
    export function readRSSI(deviceId: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

// value must be an ArrayBuffer
    export function write(deviceId: string, serviceUuid: string, characteristicUuid: string, value: ArrayBuffer, success: ISuccessCallBack, onError: IErrorCallBack): void;

// value must be an ArrayBuffer
    export function writeWithoutResponse(deviceId: string, serviceUuid: string, characteristicUuid: string, value: ArrayBuffer, success: ISuccessCallBack, onError: IErrorCallBack): void;

// value must be an ArrayBuffer
    export function writeCommand(deviceId: string, serviceUuid: string, characteristicUuid: string, value: ArrayBuffer, success: ISuccessCallBack, onError: IErrorCallBack): void;

// success callback is called on notification
    export function notify(deviceId: string, serviceUuid: string, characteristicUuid: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

// success callback is called on notification
    export function startNotification(deviceId: string, serviceUuid: string, characteristicUuid: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

// success callback is called when the descriptor 0x2902 is written
    export function stopNotification(deviceId: string, serviceUuid: string, characteristicUuid: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

    export function isConnected(deviceId: string, success: ISuccessCallBack, onError: IErrorCallBack): void;

    export function isEnabled(success: ISuccessCallBack, onError: IErrorCallBack): void;

    export function enable(success: ISuccessCallBack, onError: IErrorCallBack): void;

    export function showBluetoothSettings(success: ISuccessCallBack, onError: IErrorCallBack): void;

    export function startStateNotifications(success: ISuccessCallBack, onError: IErrorCallBack): void;

    export function stopStateNotifications(success: ISuccessCallBack, onError: IErrorCallBack): void;
}
