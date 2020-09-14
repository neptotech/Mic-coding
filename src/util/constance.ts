import {BlocklyToArduino, BlocklyToMicroPython} from "../blockly/codeGenerator";
import {ArduinoToolBox, MicroPythonToolBox} from "../blockly/toolboxGenerator";
import handleArduinoBurning from "../component/AssetsLibrary/component/ArduinoPanel/arduino-controlsMP";
import handleMicropythonBurning from "../component/AssetsLibrary/component/ArduinoPanel/micropython-controlsMP";

export const SUPPORT_KITS = {
    ESP: "fingerEsp32",
    ESP_LITE: "fingerBit"
};

export const BLOCKLY_TO_CODE = {
    [SUPPORT_KITS.ESP]: BlocklyToMicroPython,
    [SUPPORT_KITS.ESP_LITE]: BlocklyToArduino
};

export const TOOLBOX = {
    [SUPPORT_KITS.ESP]: MicroPythonToolBox,
    [SUPPORT_KITS.ESP_LITE]: ArduinoToolBox
};

export const HANDLE_BURNING = {
    [SUPPORT_KITS.ESP]: handleMicropythonBurning,
    [SUPPORT_KITS.ESP_LITE]: handleArduinoBurning
};
