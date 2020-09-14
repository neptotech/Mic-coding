import {EventEmitter} from "events";

export class CordovaBle extends EventEmitter {
    private enable() {
        return new Promise((resolve, reject) => {
            ble.enable(resolve, reject);
        });
    }

    private isEnabled() {
        return new Promise((resolve) => {
            ble.isEnabled(() => resolve(true), () => resolve(false));
        });
    }

    public startScanning() {
        return new Promise(async (resolve, reject) => {
            const isEnabled = await this.isEnabled();
            if (!isEnabled) {
                await this.enable();
            }
            ble.startScanWithOptions([], {reportDuplicates: true}, (deviceInfo) => {
                    this.emit("discover", deviceInfo);
                    resolve();
                }, (error) => {
                    reject(error);
                },
            );
        });
    }

    public stopScanning() {
        return new Promise((resolve, reject) => {
            ble.stopScan(() => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    }

    public connect(deviceId: string) {
        return new Promise((resolve, reject) => {
            ble.connect(deviceId, resolve, reject);
        });
    }

    public disconnect(deviceId: string) {
        return new Promise((resolve, reject) => {
            ble.disconnect(deviceId, resolve, reject);
        });
    }

    public isConnected(deviceId: string) {
        return new Promise((resolve) => {
            ble.isConnected(deviceId, () => resolve(true), () => resolve(false));
        });
    }
}
