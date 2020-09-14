/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the Math blocks.
 *
 * TODO: Math on list needs lists to be implemented.
 *       math_constant and math_change needs to be tested in compiler.
 */
'use strict';

goog.provide('Blockly.Arduino.micShow');

goog.require('Blockly.Arduino');

const LoadMicShowCodeGenerator = () => {

    Blockly.Arduino['micShow_rgb'] = function (block) {
        var r = Blockly.Arduino.valueToCode(block, 'RED',
            Blockly.Arduino.ORDER_NONE) || '255';
        var g = Blockly.Arduino.valueToCode(block, 'GREEN',
            Blockly.Arduino.ORDER_NONE) || '0';
        var b = Blockly.Arduino.valueToCode(block, 'BLUE',
            Blockly.Arduino.ORDER_NONE) || '0';
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'micShow_rgb', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.micShow_rgb.random_function = functionName;
        return [`(uint32_t(${r}) << 16) + (uint32_t(${g}) << 8) + uint8_t(${b})`, Blockly.Arduino.ORDER_UNARY_POSTFIX];
    };

    Blockly.Arduino['micDisplay_colorLED_transition'] = function (block) {
        Blockly.Arduino.addInclude("Microduino_ColorLED.h", "#include <Microduino_ColorLED.h>\n");
        Blockly.Arduino.addVariable('micDisplay_colorLED_transition0', `void strip_transition(ColorLED &strip_led, uint8_t num, long colorbegin, long colorend, int _duration);`);
        const order = Blockly.Arduino.ORDER_NONE;
        var color_begin = Blockly.Arduino.valueToCode(
            block, 'COLOR_BEGIN', Blockly.Arduino.ORDER_ATOMIC) || '#7276a5';
        const duration = Blockly.Arduino.valueToCode(block, 'duration', order) || '0.5';
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        var color_end = Blockly.Arduino.valueToCode(
            block, 'COLOR_END', Blockly.Arduino.ORDER_ATOMIC) || '#0d4593';
        var num = Blockly.Arduino.valueToCode(block, 'NUM0',
            Blockly.Arduino.ORDER_NONE) || '0';
        Blockly.Arduino.addVariable(`micDisplay_colorLED${pin}`, `ColorLED strip_${pin} = ColorLED(16, ${pin});`);
        Blockly.Arduino.addVariable('micDisplay_colorLED_transition2', `void strip_transition(ColorLED &strip_led, uint8_t num, long colorbegin, long colorend, int _duration) {
    uint8_t ColorR[3], ColorG[3], ColorB[3];
    ColorR[0] = colorbegin >> 16;
    ColorG[0] = colorbegin >> 8 & 0xFF;
    ColorB[0] = colorbegin & 0xFF;
    ColorR[1] = colorend >> 16;
    ColorG[1] = colorend >> 8 & 0xFF;
    ColorB[1] = colorend & 0xFF;
    for (int i = 0; i < _duration; i++) {
        ColorR[2] = map(i, 0, _duration, ColorR[0], ColorR[1]);
        ColorG[2] = map(i, 0, _duration, ColorG[0], ColorG[1]);
        ColorB[2] = map(i, 0, _duration, ColorB[0], ColorB[1]);
        strip_led.setPixelColor(num, ColorR[2], ColorG[2] , ColorB[2]);
        strip_led.show();
        delay(1);
    }
    delay(15);
}`);
        if (color_begin.indexOf('#') != -1) {
            color_begin = `0x${color_begin.slice(1, 7)}`;
        }
        if(color_end.indexOf('#') != -1) {
            color_end = `0x${color_end.slice(1, 7)}`;
        }
        Blockly.Arduino.addSetup(`micDisplay_colorLED${pin}`, `strip_${pin}.begin();`);
        return `\nstrip_transition(strip_${pin}, ${num}, ${color_begin}, ${color_end}, ${duration} * 1000);`;
    };

    Blockly.Arduino['micDisplay_colorLED_port'] = function (block) {
        var code = block.getFieldValue('port');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['mic_LED_color'] = function (block) {
        var code = block.getFieldValue('FIELDNAME');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micdisplay_colorLED_color'] = function (block) {
        Blockly.Arduino.addInclude("Microduino_ColorLED.h", "#include <Microduino_ColorLED.h>\n");
        var color_begin = Blockly.Arduino.valueToCode(
            block, 'COLOR_BEGIN', Blockly.Arduino.ORDER_ATOMIC) || '#d23135';
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        var num = Blockly.Arduino.valueToCode(block, 'NUM0',
            Blockly.Arduino.ORDER_NONE) || '0';
        Blockly.Arduino.addVariable(`micDisplay_colorLED${pin}`, `ColorLED strip_${pin} = ColorLED(16, ${pin});`);
        Blockly.Arduino.addSetup(`micDisplay_colorLED${pin}`, `strip_${pin}.begin();`);
        if (color_begin.indexOf('#') != -1) {
            color_begin = `0x${color_begin.slice(1, 7)}`;
        }
        return `\nstrip_${pin}.setPixelColor(${num}, ${color_begin});
strip_${pin}.show();`;
    }

}
export default LoadMicShowCodeGenerator
