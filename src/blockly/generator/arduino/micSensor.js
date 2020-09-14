/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Arduino Digital and Analogue input/output.
 *     Arduino built in function docs: http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Arduino.IO');

goog.require('Blockly.Arduino');

const LoadMicSensorCodeGenerator = () => {

    Blockly.Arduino['micSensor_ir_send'] = function (block) {
        // Do while/until loop.
        var _irsend = 'irsend';
        Blockly.Arduino.addInclude("IRremote.h", "#include <IRremote.h>\n");
        Blockly.Arduino.addVariable('micSensor_joystick0', `IRsend ${_irsend};`);
        var mode = block.getFieldValue('MODE') || 'NEC';
        var argument0 = Blockly.Arduino.valueToCode(block, 'TEXT',
            Blockly.Arduino.ORDER_UNARY_POSTFIX);
        var num0 = Blockly.Arduino.valueToCode(block, 'NUM0',
            Blockly.Arduino.ORDER_NONE) || '32';
        return `${_irsend}.send${mode}(${argument0}, ${num0});`;
    };

    Blockly.Arduino['micSensor_ir_reset_receive'] = function (block) {
        Blockly.Arduino.addInclude("IRremote.h", "#include <IRremote.h>\n");
        const _irrecv = 'irrecv_';
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        Blockly.Arduino.addVariable('micSensor_port0', `IRrecv ${_irrecv}${pin}(${pin});`);
        return `${_irrecv}${pin}.enableIRIn();`;
    };

    Blockly.Arduino['micSensor_port'] = function (block) {
        var code = block.getFieldValue('port');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    }

    Blockly.Arduino['micSensor_joystick'] = function (block) {
        const _keyAnalog = 'keyAnalog_'
        Blockly.Arduino.addInclude("Microduino_Key.h", "#include <Microduino_Key.h>\n");
        const menuMap = [
            '0, 50',
            '700 - 50, 700 + 50',
            '330 - 50, 330 + 50',
            '512 - 50, 512 + 50',
            '860 - 50, 860 + 50'
        ];
        const pressMap = [
            'RELEASED',
            'PRESSED'
        ]
        var arg0 = block.getFieldValue('ANALOGPORT') || 'A0';
        var arg1 = block.getFieldValue('POSITION') || 0;
        var arg2 = block.getFieldValue('STATE') || 1;
        Blockly.Arduino.addVariable(`micSensor_joystick${arg0}`, `AnalogKey ${_keyAnalog}${arg0}[5] = {(${arg0}), (${arg0}), (${arg0}), (${arg0}), (${arg0})};`);
        Blockly.Arduino.addSetup('micSensor_joystick0', `for (uint8_t a = 0; a < 5; a++) {
    ${_keyAnalog}${arg0}[a].begin(INPUT);
  }`)
        var code = `${_keyAnalog}${arg0}[${arg1}].readVal(${menuMap[arg1]}, KEY_${pressMap[arg2]})`
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micSensor_ir_controller'] = function (block) {
        let irDataMap = [
            '0x1FE48B7',
            '0x1FE807F',
            '0x1FE40BF',
            '0x1FEC03F',
            '0x1FE20DF',
            '0x1FE609F',
            '0x1FEA05F',
            '0x1FED827',
            '0x1FEE01F',
            '0x1FE906F',
            '0x1FE10EF',
            '0x1FE50AF',
            '0x1FEF807',
            '0x1FE708F',
            '0x1FEB04F',
            '0x1FE30CF'
        ]
        Blockly.Arduino.addInclude("Microduino_Key.h", "#include <Microduino_Key.h>");
        Blockly.Arduino.addInclude("IRremote.h", "#include <IRremote.h>\n");
        const irrecv = 'irrecv';
        const _uint32_t = 'uint32_t';
        const irData = 'irData';
        const _irData = '_irData';
        const irDataCache = 'irDataCache';
        const _irDataCache = '_irDataCache';
        const _irTime = '_irTime';
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        var arg0 = block.getFieldValue('POSITION') || 0;
        var arg1 = block.getFieldValue('STATE') || 0;
        Blockly.Arduino.addVariable('micSensor_ir_controller0', `${_uint32_t} dump(decode_results *results);`);
        Blockly.Arduino.addVariable('micSensor_ir_controller1', `${_uint32_t} irFluse();`);
        Blockly.Arduino.addVariable('micSensor_ir_controller2', `${_uint32_t} irDataShift();`);
        Blockly.Arduino.addVariable('micSensor_ir_controller3', `bool irButton(uint8_t sta, uint32_t _irButton);`);
        Blockly.Arduino.addVariable('micSensor_ir_controller4', `VirtualKey keyVirtual;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller5', `IRrecv ${irrecv}_(${pin});`);
        Blockly.Arduino.addVariable('micSensor_ir_controller6', `decode_results results;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller7', `${_uint32_t} ${irData} = 0x00000000;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller8', `${_uint32_t} ${irDataCache} = 0x00000000;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller9', `${_uint32_t} ${_irData} = 0x00000000;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller10', `${_uint32_t} ${_irDataCache} = 0x00000000;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller11', `boolean buttonsta[3];`);
        Blockly.Arduino.addVariable('micSensor_ir_controller12', `${_uint32_t} ${_irTime} = 0;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller13', `int my_variable = 0;`);
        Blockly.Arduino.addVariable('micSensor_ir_controller14', `${_uint32_t} dump(decode_results *results) {
    int count = results->rawlen;
    if (results->decode_type != UNKNOWN) {
        ${_irDataCache} = ${_irData};
        if (results->value == 0xFFFFFFFF) {
            ${_irData} = ${_irDataCache};
        } else {
            ${_irData} = results->value;
        }
    }
}`);
        Blockly.Arduino.addVariable('micSensor_ir_controller15', `${_uint32_t} irFluse() {
    if (${irrecv}.decode(&results)) {
        dump(&results);
        ${irrecv}.resume();
        ${_irTime} = millis();
    }
    if (millis() - ${_irTime} > 200) {
        ${_irData} = 0x00000000;
    }
    return ${_irData};`);
        Blockly.Arduino.addVariable('micSensor_ir_controller16', `uint32_t irDataShift() {
    ${irData} = irFluse();
    switch (keyVirtual.readVal(${irData})) {
        case KEY_RELEASED:
            buttonsta[0] = false;
            break;
        case KEY_PRESSED:
            irDataCache = irData;
            buttonsta[0] = true;
            break;
        case KEY_PRESSING:
            buttonsta[1] = true;
            break;
        case KEY_RELEASING:
            buttonsta[2] = true;
            break;
    }
}`);
        Blockly.Arduino.addVariable('micSensor_ir_controller17', `bool irButton(uint8_t sta, uint32_t _irButton) {
    irDataShift();
    if (!buttonsta[0] && (sta == 1) && (irData == 0))
        return true;
    else if (buttonsta[0] && (sta == 2) && (irData == _irButton))
        return true;
    else if (buttonsta[1] && (sta == 0) && (irData == _irButton)) {
        buttonsta[1] = false;
        return true;
    } else if (buttonsta[2] && (sta == 3) && (irData == 0) && (irDataCache == _irButton)) {
        buttonsta[2] = false;
        return true;
    }
    return false;
}`);
        Blockly.Arduino.addSetup('micSensor_ir_controller0', `keyVirtual.begin();`);
        Blockly.Arduino.addSetup('micSensor_ir_controller1', `irrecv.enableIRIn();`);

        var code = `if(irButton(${arg1}, ${irDataMap[arg0]})) {

        }`
        return [code, Blockly.Arduino.ORDER_ATOMIC];
};

    Blockly.Arduino['micSensor_ir_receive'] = function (block) {
        Blockly.Arduino.addInclude("IRremote.h", "#include <IRremote.h>\n");
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        const _results = `results_${pin}`
        Blockly.Arduino.addVariable('micSensor_ir_receive0', `uint32_t dump(decode_results *${_results});`);
        Blockly.Arduino.addVariable('micSensor_ir_receive1', `uint32_t irFluse();`);
        Blockly.Arduino.addVariable('micSensor_ir_receive2', `IRrecv irrecv_2(2);`);
        Blockly.Arduino.addVariable('micSensor_ir_receive3', `decode_results ${_results};`);
        Blockly.Arduino.addVariable('micSensor_ir_receive4', `uint32_t _irData = 0x00000000;`);
        Blockly.Arduino.addVariable('micSensor_ir_receive5', `uint32_t _irDataCache = 0x00000000;`);
        Blockly.Arduino.addVariable('micSensor_ir_receive6', `uint32_t _irTime = 0;`);
        Blockly.Arduino.addVariable('micSensor_ir_receive7', `int my_variable = 0;`);
        Blockly.Arduino.addVariable('micSensor_ir_receive8', `uint32_t dump(decode_results *${_results}) {
    int count = ${_results}->rawlen;
    if (${_results}->decode_type != UNKNOWN) {
        _irDataCache = _irData;
        if (${_results}->value == 0xFFFFFFFF) {
			_irData = _irDataCache;
		} else {
			_irData = ${_results}->value;
        }
    }
}`);
        Blockly.Arduino.addVariable('micSensor_ir_receive9', `uint32_t irFluse() {
	if (irrecv_2.decode(&${_results})) {
		dump(&${_results});
		irrecv_2.resume();
		_irTime = millis();
	}
	if (millis() - _irTime > 200) {
		_irData = 0x00000000;
	}
	return _irData;
}`);
        Blockly.Arduino.addSetup('micSensor_ir_receive0', `irrecv_${pin}.enableIRIn();`);

        return [`irFluse()`, Blockly.Arduino.ORDER_ATOMIC];

    };
}
export default LoadMicSensorCodeGenerator;