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

const LoadIOCodeGenerator = () => {
    /**
     * Function for 'set pin' (X) to a state (Y).
     * Arduino code: setup { pinMode(X, OUTPUT); }
     *               loop  { digitalWrite(X, Y); }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['io_digitalwrite'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '1';
        var stateOutput = Blockly.Arduino.valueToCode(
            block, 'STATE', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';

        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

        var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
        Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

        var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
        return code;
    };

    /**
     * Function for reading a digital pin (X).
     * Arduino code: setup { pinMode(X, INPUT); }
     *               loop  { digitalRead(X)     }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {array} Completed code with order of operation.
     */
    Blockly.Arduino['io_digitalread'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '1';
        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

        var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
        Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

        var code = 'digitalRead(' + pin + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    /**
     * Function for setting the state (Y) of a built-in LED (X).
     * Arduino code: setup { pinMode(X, OUTPUT); }
     *               loop  { digitalWrite(X, Y); }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['io_builtin_led'] = function (block) {
        var pin = block.getFieldValue('BUILT_IN_LED');
        var stateOutput = Blockly.Arduino.valueToCode(
            block, 'STATE', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';

        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Set LED');

        var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
        Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

        var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
        return code;
    };

    /**
     * Function for setting the state (Y) of an analogue output (X).
     * Arduino code: setup { pinMode(X, OUTPUT); }
     *               loop  { analogWrite(X, Y);  }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['io_analogwrite'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
        var stateOutput = Blockly.Arduino.valueToCode(
            block, 'ANALOGNUM', Blockly.Arduino.ORDER_ATOMIC) || '0';
        var reg = /A[0-9]/g;
        var isAnalogInput = true;
        isAnalogInput = reg.test(pin);
        // console.log("io.js-input isAnalogInput: "+ isAnalogInput);
        var pinI = '';
        if (!isAnalogInput) {
            Blockly.Arduino.addDeclaration('io_analogPinList', 'const int analogPIN[8]={A0,A1,A2,A3,A4,A5,A6,A7};');
            Blockly.Arduino.addSetup('io_A0', 'pinMode(A0, OUTPUT);');
            Blockly.Arduino.addSetup('io_A1', 'pinMode(A1, OUTPUT);');
            Blockly.Arduino.addSetup('io_A2', 'pinMode(A2, OUTPUT);');
            Blockly.Arduino.addSetup('io_A3', 'pinMode(A3, OUTPUT);');
            Blockly.Arduino.addSetup('io_A4', 'pinMode(A4, OUTPUT);');
            Blockly.Arduino.addSetup('io_A5', 'pinMode(A5, OUTPUT);');
            Blockly.Arduino.addSetup('io_A6', 'pinMode(A6, OUTPUT);');
            Blockly.Arduino.addSetup('io_A7', 'pinMode(A7, OUTPUT);');

            pinI = "analogPIN[" + pin + "]";

        } else {
            Blockly.Arduino.reservePin(
                block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Analogue Write');
            var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
            Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);
        }
        // Warn if the input value is out of range
        if ((stateOutput < 0) || (stateOutput > 255)) {
            block.setWarningText('The analogue value set must be between 0 and 255',
                'pwm_value');
        } else {
            block.setWarningText(null, 'pwm_value');
        }
        if (isAnalogInput) {
            var code = 'analogWrite(' + pin + ', ' + stateOutput + ');\n';
        } else {
            var code = 'analogWrite(' + pinI + ', ' + stateOutput + ');\n';
        }
        return code;
    };

    /**
     * Function for reading an analogue pin value (X).
     * Arduino code: setup { pinMode(X, INPUT); }
     *               loop  { analogRead(X)      }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {array} Completed code with order of operation.
     */
    Blockly.Arduino['io_analogread'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';

        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analogue Read');

        var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
        Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

        var code = 'analogRead(' + pin + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['io_pwmwrite'] = function (block) {
        var pin = Blockly.Arduino.valueToCode(
            block, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
        var stateOutput = Blockly.Arduino.valueToCode(
            block, 'PWMVALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
        var reg = /[0-9]/g;
        var isVarInput = false;
        isVarInput = !reg.test(pin);
        // console.log("io.js-input isPwmInput: "+ isVarInput);
        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'PWM Write');
        var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
        Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);
        var code = 'analogWrite(' + pin + ', ' + stateOutput + ');\n';
        return code;
    };

    /**
     * Value for defining a digital pin state.
     * Arduino code: loop { HIGH / LOW }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {array} Completed code with order of operation.
     */
    Blockly.Arduino['io_highlow'] = function (block) {
        var code = block.getFieldValue('STATE');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['io_pulsein'] = function (block) {
        var pin = block.getFieldValue("PULSEPIN");
        var type = Blockly.Arduino.valueToCode(block, "PULSETYPE", Blockly.Arduino.ORDER_ATOMIC);

        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.INPUT, 'Pulse Pin');

        var pinSetupCode = 'pinMode(' + pin + ', INPUT);\n';
        Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

        var code = 'pulseIn(' + pin + ', ' + type + ')';

        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['io_pulsetimeout'] = function (block) {
        var pin = block.getFieldValue("PULSEPIN");
        var type = Blockly.Arduino.valueToCode(block, "PULSETYPE", Blockly.Arduino.ORDER_ATOMIC);
        var timeout = Blockly.Arduino.valueToCode(block, "TIMEOUT", Blockly.Arduino.ORDER_ATOMIC);

        Blockly.Arduino.reservePin(
            block, pin, Blockly.Arduino.PinTypes.INPUT, 'Pulse Pin');

        var pinSetupCode = 'pinMode(' + pin + ', INPUT);\n';
        Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

        var code = 'pulseIn(' + pin + ', ' + type + ', ' + timeout + ')';

        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['io_dropdown_digital'] = function (block) {
        var code = block.getFieldValue('SELECTPIN');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };
    Blockly.Arduino['io_dropdown_analog'] = function (block) {
        var code = block.getFieldValue('SELECTPIN');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };
    Blockly.Arduino['io_dropdown_pwm'] = function (block) {
        var code = block.getFieldValue('SELECTPIN');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };
}

export default LoadIOCodeGenerator;
