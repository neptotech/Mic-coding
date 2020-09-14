// Type definitions for noble
// Project: https://github.com/sandeepmistry/noble
// Definitions by: Seon-Wook Park <https://github.com/swook>
//                 Shantanu Bhadoria <https://github.com/shantanubhadoria>
//                 Luke Libraro <https://github.com/lukel99>
//                 Dan Chao <https://github.com/bioball>
//                 Michal Lower <https://github.com/keton>
//                 Rob Moran <https://github.com/thegecko>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

import events = require("events");

export declare namespace BlueToothInterface {
    export function startScanning(callback?: (error?: Error) => void): void;
    export function startScanning(serviceUUIDs: string[], callback?: (error?: Error) => void): void;
    export function startScanning(serviceUUIDs: string[], allowDuplicates: boolean, callback?: (error?: Error) => void): void;

    export function stopScanning(callback?: () => void): void;

    export function on(event: "stateChange", listener: (state: string) => void): events.EventEmitter;
    export function on(event: "scanStart" | "scanStop" | string, listener: () => void): events.EventEmitter;
    export function on(event: "discover", listener: (peripheral: Peripheral) => void): events.EventEmitter;

    export function once(event: string, listener: () => void): events.EventEmitter;

    export function removeListener(event: "stateChange", listener: (state: string) => void): events.EventEmitter;
    export function removeListener(event: "scanStart" | "scanStop" | string, listener: () => void): events.EventEmitter;
    export function removeListener(event: "discover", listener: (peripheral: Peripheral) => void): events.EventEmitter;

    export function removeAllListeners(event?: string | symbol): events.EventEmitter;
    export function removeAllListeners(event?: string | symbol): events.EventEmitter;

    export function listenerCount(type: string | symbol): number;

    export let state: string;

    export class Peripheral extends events.EventEmitter {
        public id: string;
        public uuid: string;
        public address: string;
        public addressType: string;
        public connectable: boolean;
        public advertisement: IAdvertisement;
        public rssi: number;
        public services: Service[];
        public state: "error" | "connecting" | "connected" | "disconnecting" | "disconnected";

        public connect(callback?: (error: string) => void): void;

        public disconnect(callback?: () => void): void;

        public updateRssi(callback?: (error: string, rssi: number) => void): void;

        public discoverServices(serviceUUIDs: string[], callback?: (error: string, services: Service[]) => void): void;

        public discoverAllServicesAndCharacteristics(callback?: (error: string, services: Service[], characteristics: Characteristic[]) => void): void;

        public discoverSomeServicesAndCharacteristics(serviceUUIDs: string[], characteristicUUIDs: string[], callback?: (error: string, services: Service[], characteristics: Characteristic[]) => void): void;

        public readHandle(handle: Buffer, callback: (error: string, data: Buffer) => void): void;

        public writeHandle(handle: Buffer, data: Buffer, withoutResponse: boolean, callback: (error: string) => void): void;

        public toString(): string;

        public on(event: "connect" | "disconnect", listener: (error: string) => void): this;
        public on(event: "rssiUpdate", listener: (rssi: number) => void): this;
        public on(event: "servicesDiscover", listener: (services: Service[]) => void): this;
        public on(event: string, listener: () => void): this;
    }

    export interface IAdvertisement {
        localName: string;
        serviceData: {
            uuid: string;
            data: Buffer;
        };
        txPowerLevel: number;
        manufacturerData: Buffer;
        serviceUuids: string[];
    }

    export class Service extends events.EventEmitter {
        public uuid: string;
        public name: string;
        public type: string;
        public includedServiceUuids: string[];
        public characteristics: Characteristic[];

        public discoverIncludedServices(serviceUUIDs: string[], callback?: (error: string, includedServiceUuids: string[]) => void): void;

        public discoverCharacteristics(characteristicUUIDs: string[], callback?: (error: string, characteristics: Characteristic[]) => void): void;

        public toString(): string;

        public on(event: "includedServicesDiscover", listener: (includedServiceUuids: string[]) => void): this;
        public on(event: "characteristicsDiscover", listener: (characteristics: Characteristic[]) => void): this;
        public on(event: string, listener: () => void): this;
    }

    export class Characteristic extends events.EventEmitter {
        public uuid: string;
        public name: string;
        public type: string;
        public properties: string[];
        public descriptors: Descriptor[];

        public read(callback?: (error: string, data: Buffer) => void): void;

        public write(data: Buffer, notify: boolean, callback?: (error: string) => void): void;

        public broadcast(broadcast: boolean, callback?: (error: string) => void): void;

        public notify(notify: boolean, callback?: (error: string) => void): void;

        public discoverDescriptors(callback?: (error: string, descriptors: Descriptor[]) => void): void;

        public toString(): string;

        public subscribe(callback?: (error: string) => void): void;

        public unsubscribe(callback?: (error: string) => void): void;

        public on(event: "read" | "data", listener: (data: Buffer, isNotification: boolean) => void): this;
        public on(event: "write", withoutResponse: boolean, listener: (error: string) => void): this;
        public on(event: "broadcast" | "notify", listener: (state: string) => void): this;
        public on(event: "descriptorsDiscover", listener: (descriptors: Descriptor[]) => void): this;
        public on(event: string, listener: () => void): this;
        public on(event: string, option: boolean, listener: () => void): this;
    }

    export class Descriptor extends events.EventEmitter {
        public uuid: string;
        public name: string;
        public type: string;

        public readValue(callback?: (error: string, data: Buffer) => void): void;

        public writeValue(data: Buffer, callback?: (error: string) => void): void;

        public toString(): string;

        public on(event: "valueRead", listener: (error: string, data: Buffer) => void): this;
        public on(event: "valueWrite", listener: (error: string) => void): this;
        public on(event: string, listener: () => void): this;
    }

}
