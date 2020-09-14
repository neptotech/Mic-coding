import isWeb from "./lib/isWeb";
import isNodeJs from "./lib/isNodeJs";
import {Connector} from "./interface";
import isElectron from "./lib/isElectron";
import isCordovaApp from "./lib/isCordovaApp";
import isFlutterApp from "./lib/isFlutterApp";

let BlueTooth: typeof Connector;

if (isCordovaApp) {
    // BlueTooth = require("./connector/CordovaBluetoothConnector").default;
} else if (isNodeJs || isElectron) {
    try {
        BlueTooth = require("./connector/BluetoothConnector").default;
    } catch (e) {
        // @ts-ignore
        BlueTooth = undefined;
    }
} else if (isFlutterApp) {
    BlueTooth = require("./connector/FlutterBluetoothConnector").default;
} else if (isWeb) {
    BlueTooth = require("./connector/MConnectionBluetoothConnector").default;
} else {
    throw new Error("not supported");
}

// @ts-ignore
export default BlueTooth;
