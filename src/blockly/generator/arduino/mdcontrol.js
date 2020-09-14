/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Arduino code generator for the Time blocks.
 *     Arduino built-in function docs: http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Arduino.time');

goog.require('Blockly.Arduino');

const LoadTimeCodeGenerator = () => {
    /**
     * Code generator for the delay Arduino block.
     * Arduino code: loop { delay(X); }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['control_time_delay'] = function (block) {
        console.log(Blockly.Arduino, 'Blockly.Arduino', block, 'Blockly.Arduino')
        var delayTime = Blockly.Arduino.valueToCode(block, "DELAY_TIME_SECOND", Blockly.Arduino.ORDER_ATOMIC) || '0';
        console.log(Blockly.Arduino.valueToCode, 'delayTimedelayTime', block)
        var code = 'delay(' + delayTime + ' * 1000);\n';
        return code;
    };

    /**
     * Generator for the repeat block (using external number block) using a
     * For loop statement.
     * Arduino code: loop { for (int count = 0; count < X; count++) { Y } }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['mdcontrols_repeat_ext'] = function (block) {
        var repeats = Blockly.Arduino.valueToCode(block, 'TIMES',
            Blockly.Arduino.ORDER_ADDITIVE) || '0';
        var branch = Blockly.Arduino.statementToCode(block, 'DO');
        branch = Blockly.Arduino.addLoopTrap(branch, block.id);
        var code = '';
        var loopVar = Blockly.Arduino.variableDB_.getDistinctName(
            'count', Blockly.Variables.NAME_TYPE);
        var endVar = repeats;
        if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
            var endVar = Blockly.Arduino.variableDB_.getDistinctName(
                'repeat_end', Blockly.Variables.NAME_TYPE);
            code += 'int ' + endVar + ' = ' + repeats + ';\n';
        }
        code += 'for (int ' + loopVar + ' = 0; ' +
            loopVar + ' < ' + endVar + '; ' +
            loopVar + '++) {\n' +
            branch + '}\n';
        return code;
    };

    Blockly.Arduino['mdcontrols_repeat_one'] = function (block) {
        var branch = Blockly.Arduino.statementToCode(block, 'DO');
        branch = Blockly.Arduino.addLoopTrap(branch, block.id);
        return 'while (1) {\n' + branch + '}\n';
    };

    Blockly.Arduino['mdcontrols_if'] = function (block) {
        var n = 0;
        var argument = Blockly.Arduino.valueToCode(block, 'IF' + n,
            Blockly.Arduino.ORDER_NONE) || 'false';
        var branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
        var code = 'if (' + argument + ') {\n' + branch + '}';
        for (n = 1; n <= block.elseifCount_; n++) {
            argument = Blockly.Arduino.valueToCode(block, 'IF' + n,
                Blockly.Arduino.ORDER_NONE) || 'false';
            branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
            code += ' else if (' + argument + ') {\n' + branch + '}';
        }
        if (block.elseCount_) {
            branch = Blockly.Arduino.statementToCode(block, 'ELSE');
            code += ' else {\n' + branch + '}';
        }
        return code + '\n';
    };

    Blockly.Arduino['control_wait'] = function (block) {
        var argument = Blockly.Arduino.valueToCode(block, 'CONTROL_TIME_WAIT',
            Blockly.Arduino.ORDER_NONE)
        // var argument = Blockly.Arduino.valueToCode(block, 'CONTROL_TIME_WAIT',
        //     Blockly.Arduino.ORDER_NONE) || 'false';
        var code = argument ? `(${argument})` : 'false';
        return `while(!${code});\n`;
    };

    Blockly.Arduino['control_repeat'] = function (block) {
        var n = 0
        var argument = Blockly.Arduino.valueToCode(block, 'IF' + n,
            Blockly.Arduino.ORDER_NONE)
        var code = argument ? `(${argument})` : 'false';
        var branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
        var blockCode = `while(!${code}) {\n ${branch} \n}`;
        return `${blockCode}`;
    };

    Blockly.Arduino['micControls_if'] = function (block) {
        var n = 0;
        var argument = Blockly.Arduino.valueToCode(block, 'IF' + n,
            Blockly.Arduino.ORDER_NONE) || 'false';
        var branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
        var code = 'if (' + argument + ') {\n' + branch + '}';
        for (n = 1; n <= block.elseifCount_; n++) {
            argument = Blockly.Arduino.valueToCode(block, 'IF' + n,
                Blockly.Arduino.ORDER_NONE) || 'false';
            branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
            code += ' else if (' + argument + ') {\n' + branch + '}';
        }
        if (block.elseCount_) {
            branch = Blockly.Arduino.statementToCode(block, 'ELSE');
            code += ' else {\n' + branch + '}';
        }
        return code + '\n';
    };
}
export default LoadTimeCodeGenerator;
