import {MCookieBleDriver, MCookieDriver} from "./MCookieDriver";
import {Driver} from "../interface";
import wait from "../lib/wait";
import baudRateFormat from "../lib/baudRateFormat";
import {BURN_DEVICE_TYPE_CORE_PLUS, RESET, TYPE_CORE_PLUS_3V3} from "../burnConstance";

const BURN_BAUD_RATE = 57600;

export class FingerBitDriver extends MCookieDriver implements Driver {
    protected getCoreType(sign: number[]) {
        if (sign.filter((item, index) => item === BURN_DEVICE_TYPE_CORE_PLUS[index]).length === 3) {
            return TYPE_CORE_PLUS_3V3;
        }
        throw new Error("not support device");
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void): Promise<void> {
        this.port.removeListener("data", this.onData);
        let error;
        try {
            await this.port.setDTR(false);
            await wait(200);
            await this.port.open(BURN_BAUD_RATE);
            await this.port.setDTR(true);
            await wait(200);
            await this.startBurn(dataHandle, progressHandle);
        } catch (e) {
            error = e;
        }
        this.port.setDataHandle(undefined);
        await this.port.open(this.baudRate);
        this.port.on("data", this.onData);
        if (error) {
            throw error;
        }
    }
}

export class FingerBitBleDriver extends MCookieBleDriver implements Driver {
    protected getCoreType(sign: number[]) {
        return TYPE_CORE_PLUS_3V3;
    }

    public async burn(dataHandle: (type: string) => Buffer, progressHandle?: (progress: number) => void) {
        this.port.removeListener("data", this.onData);
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(BURN_BAUD_RATE)), true);
        await this.resetPort.send(new Uint8Array([RESET]), true);
        await wait(200);
        let error;
        try {
            await super.startBurn(dataHandle, progressHandle);
        } catch (e) {
            error = e;
        }
        this.port.setDataHandle(undefined);
        await this.baudRatePort.send(new Uint8Array(baudRateFormat(this.baudRate)), true);
        await this.resetPort.send(new Uint8Array([RESET]), true);
        this.port.on("data", this.onData);
        await wait(200);
        if (error) {
            throw error;
        }
    }
}
