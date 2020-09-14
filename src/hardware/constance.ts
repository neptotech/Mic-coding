import {MCookieBleDriver, MCookieDriver} from "./driver/MCookieDriver";
import {BuggyBleDriver, BuggyDriver} from "./driver/BuggyDriver";
import {IronManBleDriver, IronManDriver} from "./driver/IronManDriver";
import {IdeaBoxBleDriver, IdeaBoxDriver} from "./driver/IdeaBoxDriver";
import {FingerEsp32Driver} from "./driver/FingerEsp32Driver";
import {FingerBitBleDriver, FingerBitDriver} from "./driver/FingerBitDriver";
import {IdeaBoardBleDriver, IdeaBoardDriver} from "./driver/IdeaBoardDriver";

export const DRIVER_CONNECT_TIMEOUT = 1000;
export const DRIVER_SEND_TIMEOUT = 4000;

export const VALIAD_VERSION_REGEX = /^(sp|B3|MB3|s3)V(\*|\d+(\.\d+){0,2}(\.\*)?)/;

export const DRIVER_TYPE_LEGACY = "legacy";
export const DRIVER_TYPE_IRON_MAN = "ironMan";

export const MAX_SEND_BYTES = 16;

export const ALLOWED_DRIVER: Array<{
    vendorId: string,
    productId: string,
}> = [{
    vendorId: "1a86",
    productId: "7523",
}, {
    vendorId: "0403",
    productId: "6001",
}, {
    vendorId: "10c4",
    productId: "ea60",
}, {
    vendorId: "10c4",
    productId: "ea70",
}];

export const BLE_FILTER_REGEXP = new RegExp(`^(mCookie|ideaBot|Microduino)*?([A-Z0-9]{4})*$`);
export const BLE_SCAN_LIFECYCLE = 5000;
export const BLE_SCAN_STOP_TIMEOUT = 5000;

export const SERIAL_PORT_NAME_PREFIX = "microduino-";

export const SUPPORT_KITS = {
    M_COOKIE: "mCookie",
    BUGGY: "IBB",
    ZOOMBOT: "LudoBot",
    IRON_MAN: "ironman",
    IDEA_BOX: "ideaBox",
    FINGER_ESP32: "fingerEsp32",
    FINGER_BIT: "fingerBit",
    IDEA_BOARD: "ideaBoard",
};

export const SERIAL_PORT_KIT_DRIVER_MAP = {
    [SUPPORT_KITS.M_COOKIE]: MCookieDriver,
    [SUPPORT_KITS.BUGGY]: BuggyDriver,
    [SUPPORT_KITS.ZOOMBOT]: BuggyDriver,
    [SUPPORT_KITS.IRON_MAN]: IronManDriver,
    [SUPPORT_KITS.IDEA_BOX]: IdeaBoxDriver,
    [SUPPORT_KITS.FINGER_ESP32]: FingerEsp32Driver,
    [SUPPORT_KITS.FINGER_BIT]: FingerBitDriver,
    [SUPPORT_KITS.IDEA_BOARD]: IdeaBoardDriver,
};

export const BLE_KIT_DRIVER_MAP = {
    [SUPPORT_KITS.M_COOKIE]: MCookieBleDriver,
    [SUPPORT_KITS.BUGGY]: BuggyBleDriver,
    [SUPPORT_KITS.ZOOMBOT]: BuggyBleDriver,
    [SUPPORT_KITS.IRON_MAN]: IronManBleDriver,
    [SUPPORT_KITS.IDEA_BOX]: IdeaBoxBleDriver,
    [SUPPORT_KITS.FINGER_BIT]: FingerBitBleDriver,
    [SUPPORT_KITS.IDEA_BOARD]: IdeaBoardBleDriver,
};
