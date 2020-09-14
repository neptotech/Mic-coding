/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the logic blocks.
 */
'use strict';

goog.provide('Blockly.MicroPython.logic');

goog.require('Blockly.MicroPython');


const LoadMicPythonControlCodeGenerator = () => {
    /**
     * Code generator to create if/if else/else statement.
     * Arduino code: loop { if (X)/else if ()/else { X } }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.MicroPython['controls_if'] = function (block) {
        return '';
    };

     /**
     * Code generator for the delay Arduino block.
     * Arduino code: loop { delay(X); }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.MicroPython['micPythonControl_time_delay'] = function (block) {
        const time = Blockly.MicroPython.importFile(`time`)
        var delayTime = Blockly.MicroPython.valueToCode(block, "DELAY_TIME_SECOND", Blockly.MicroPython.ORDER_ATOMIC) || '0';
        console.log(Blockly.MicroPython.valueToCode, 'block.valueToCodeRecursive', block, 'Blockly.MicroPython', delayTime)
        // const arg0 = block.valueToCodeRecursive(Blockly.MicroPython, 'DURATION', Blockly.MicroPython.ORDER_HIGH) || '0'
        return `${time}.sleep(${delayTime})\n`
    };
}

export default LoadMicPythonControlCodeGenerator;
