import {ALLOWED_DRIVER, DRIVER_TYPE_IRON_MAN, DRIVER_TYPE_LEGACY, SERIAL_PORT_NAME_PREFIX} from "../constance";

export interface IDriverType {
    type: typeof DRIVER_TYPE_IRON_MAN | typeof DRIVER_TYPE_LEGACY;
    name: string;
}

export interface ISerialPortDriverInfo {
    vendorId: string;
    productId: string;
}

export interface IBlueToothDriverInfo {
    name: string;
}

const isSerialPortDriverInfo = (info: any[]): info is ISerialPortDriverInfo[] => !!info[0].productId;
const isBlueToothDriverInfo = (info: any[]): info is IBlueToothDriverInfo[] => !!info[0].name;

export default (info: ISerialPortDriverInfo[] | IBlueToothDriverInfo[], suffix: string = ""): string => {
    if (!Array.isArray(info) || info.length <= 0) {
        // @ts-ignore
        return null;
    }
    if (isSerialPortDriverInfo(info)) {
        const find = ALLOWED_DRIVER.find((item) => item.productId === (info[0].productId || "").toLowerCase() && item.vendorId === (info[0].vendorId || "").toLowerCase());
        if (!find) {
            // @ts-ignore
            return null;
        }
        return `${SERIAL_PORT_NAME_PREFIX}${suffix}`;
    } else if (isBlueToothDriverInfo(info)) {
        if (info[0].name.startsWith("ideaBot") || info[0].name.startsWith("mCookie") || info[0].name.startsWith("Microduino")) {
            return info[0].name;
        }
        // @ts-ignore
        return null;
    }
    // @ts-ignore
    return null;
};
