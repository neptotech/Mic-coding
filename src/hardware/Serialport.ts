import isWeb from "./lib/isWeb";
import isNodeJs from "./lib/isNodeJs";
import {Connector} from "./interface";
import isElectron from "./lib/isElectron";
import isFlutterApp from "./lib/isFlutterApp";

let SerialPort: typeof Connector;

if (isNodeJs || isElectron) {
    try {
        SerialPort = require("./connector/SerialPortConnector").default;
    } catch (e) {
        // @ts-ignore
        SerialPort = undefined;
    }
} else if (isFlutterApp) {
    // @ts-ignore
    SerialPort = undefined;
} else if (isWeb) {
    SerialPort = require("./connector/MConnectionSerialPortConnector").default;
} else {
    throw new Error("not supported");
}

export default SerialPort;
