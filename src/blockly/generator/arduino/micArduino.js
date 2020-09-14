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

const LoadMicArduinoCodeGenerator = () => {
    /**
     * Function for 'set pin' (X) to a state (Y).
     * Arduino code: setup { pinMode(X, OUTPUT); }
     *               loop  { digitalWrite(X, Y); }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['micArduino_digital_write'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        var stateOutput = block.getFieldValue('STATE') || '0';

        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

        var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
        Blockly.Arduino.addSetup(`micArduino_digital_write${pin}`, pinSetupCode, false);

        var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
        return `${code}`;

    };

    Blockly.Arduino['micArduino_dropdown_digital'] = function (block) {
        var code = block.getFieldValue('port');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    }

    Blockly.Arduino['micArduino_highlow'] = function (block) {
        var code = block.getFieldValue('STATE');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micArduino_digital_read'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        Blockly.Arduino.addSetup(`micArduino_digital_read0`, `pinMode(${pin}, INPUT);`);
        var code = 'digitalRead(' + pin + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];;
    };

    Blockly.Arduino['micArduino_analog_read'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || 'A0';

        var code = 'analogRead(' + pin + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];;
    };

    Blockly.Arduino['micArduino_string_convert'] = function (block) {
        // Create a list with any number of elements of any type.
        var size = block.itemCount_;
        var code = new Array(this.itemCount_);
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || 'Int';
        const arg0 = Blockly.Arduino.valueToCode(this, 'ADD0',
            Blockly.Arduino.ORDER_NONE);
        code = `${arg0}.to${pin}()`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micArduino_read_boolean'] = Blockly.Arduino['micArduino_dropdown_digital'];
    Blockly.Arduino['micArduino_string_convert_boolean'] = Blockly.Arduino['micArduino_dropdown_digital'];

    Blockly.Arduino['micArduino_number_convert'] = function (block) {
        // Create a list with any number of elements of any type.
        const arg0 = Blockly.Arduino.valueToCode(this, 'SEED',
            Blockly.Arduino.ORDER_NONE) || 0;
        var code = `String(${arg0})`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micArduino_millis'] = function (block) {
        var code = `millis()`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micArduino_serial_readString'] = function (block) {
        var code = `Serial.readString()`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micArduino_map'] = function (block) {
        var arg0 = Blockly.Arduino.valueToCode(block, 'NUM0',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg1 = Blockly.Arduino.valueToCode(block, 'NUM1',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg2 = Blockly.Arduino.valueToCode(block, 'NUM2',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg3 = Blockly.Arduino.valueToCode(block, 'NUM3',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg4 = Blockly.Arduino.valueToCode(block, 'NUM4',
            Blockly.Arduino.ORDER_NONE) || '0';
        var code = `map(${arg0}, ${arg1}, ${arg2}, ${arg3}, ${arg4})`;
        return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
    };

    Blockly.Arduino['micArduino_constrain'] = function (block) {
        const _myconstrain = 'myconstrain'
        Blockly.Arduino.addVariable('micArduino_constrain0', `int ${_myconstrain}(int _val, int _min, int _max);`);
        Blockly.Arduino.addVariable('micArduino_constrain1', `int ${_myconstrain}(int _val, int _min, int _max) {
    if (_val < _min) {
        return _min;
    } else if (_val > _max) {
        return _max;
    }
    return _val;
}`);
        var arg0 = Blockly.Arduino.valueToCode(block, 'NUM0',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg1 = Blockly.Arduino.valueToCode(block, 'NUM1',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg2 = Blockly.Arduino.valueToCode(block, 'NUM2',
            Blockly.Arduino.ORDER_NONE) || '0';
        var code = `${_myconstrain}(${arg0}, ${arg1}, ${arg2})`;
        return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
    };

    Blockly.Arduino['micArduino_digital_read_boolean'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '2';
        var stateOutput = block.getFieldValue('STATE') || '0';

        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

        var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
        Blockly.Arduino.addSetup(`micArduino_digital_write0${pin}`, pinSetupCode, false);

        var code = stateOutput == 1 ? `digitalWrite(${pin})` : `!digitalWrite(${pin})`;
        return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];

    };

    Blockly.Arduino['micArduino_pwm_write'] = function (block) {
        var pwm0 = Blockly.Arduino.valueToCode(
            block, 'PWM0', Blockly.Arduino.ORDER_ATOMIC) || '3';
        var pwm1 = Blockly.Arduino.valueToCode(
            block, 'PWM1', Blockly.Arduino.ORDER_ATOMIC) || '100';

        var code = `analogWrite(${pwm0}, ${pwm1});`;
        return `${code}`;
    };

    Blockly.Arduino['micArduino_variable_type'] = function (block) {
        var variable = Blockly.Arduino.variableDB_.getName(
            block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

        var type = block.getFieldValue('TYPE') || 'boolean';
        Blockly.Arduino.addVariable('define_variable0', `${type} ${variable};`);
        return '';
    };

    Blockly.Arduino['micArduino_for_each'] = function (block) {
        // Do while/until loop.
        var mode = Blockly.Arduino.variableDB_.getName(
            block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
        var arg0 = Blockly.Arduino.valueToCode(block, 'NUM0',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg1 = Blockly.Arduino.valueToCode(block, 'NUM1',
            Blockly.Arduino.ORDER_NONE) || '0';
        var arg2 = Blockly.Arduino.valueToCode(block, 'NUM2',
            Blockly.Arduino.ORDER_NONE) || '0';
        Blockly.Arduino.addVariable('define_variable0', `int ${mode};`);

        var branch = Blockly.Arduino.statementToCode(block, 'DO');
        branch = Blockly.Arduino.addLoopTrap(branch, block.id);
        var symbol = arg2 < 1 ? '>=' : '<=';
        // branch = Blockly.Arduino.addLoopTrap(branch, block.id);
        var code = `for(${mode} = (${arg0}); ${mode} ${symbol} (${arg1}); ${mode} += (${arg2})) { 
            ${branch}
}`
        return `${code}`;

    };

    Blockly.Arduino['micArduino_interval_doing'] = function (block) {
        // Do while/until loop.
        var mode = Blockly.Arduino.variableDB_.getName(
            block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
        var arg0 = Blockly.Arduino.valueToCode(block, 'NUM0',
            Blockly.Arduino.ORDER_NONE) || '0';
        Blockly.Arduino.addVariable('define_variable0', `unsigned long ${mode} = millis();`, true);

        var branch = Blockly.Arduino.statementToCode(block, 'DO');
        branch = Blockly.Arduino.addLoopTrap(branch, block.id);
        // branch = Blockly.Arduino.addLoopTrap(branch, block.id);
        var code = `if(${mode} > millis()) ${mode} = millis();
    if(millis() - my_variable > ${arg0}) {
        ${branch}
        my_variable = millis();
    }`;
        return `${code}`;

    };

    Blockly.Arduino['micArduino_serial_baud'] = function (block) {
        // Do while/until loop.
        var mode = block.getFieldValue('MODE') || 'my_variable';
        var code = `Serial.begin(${mode});`;
        return `${code}`;

    };

    Blockly.Arduino['micArduino_serial_print'] = function (block) {
        // Do while/until loop.
        var mode = block.getFieldValue('MODE') || '0';
        var argument0 = Blockly.Arduino.valueToCode(block, 'TEXT',
            Blockly.Arduino.ORDER_UNARY_POSTFIX);
        var code = mode == 1 ? 'ln' : ''
        code = `Serial.print${code}(${argument0});`;
        return `${code}`;
    };
}
export default LoadMicArduinoCodeGenerator;