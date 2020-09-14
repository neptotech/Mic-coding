/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the event blocks.
 */
'use strict';

goog.provide('Blockly.Arduino.event');

goog.require('Blockly.Arduino');


const LoadEventCodeGenerator = () => {
    /**
     * Code generator to create if/if else/else statement.
     * Arduino code: loop { if (X)/else if ()/else { X } }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['event_whendeviceopen'] = function (block) {
        Blockly.Arduino.addInclude("Arduino.h", "#include <Arduino.h>\n");
        var n = 0;
        var branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
        Blockly.Arduino.addSetup('event_whendeviceopen0', `${branch}`)
        console.log(branch, 'branchbranch')
        var code = Blockly.Arduino.statementToCode(block, 'ELSE');
        return code;
    };

}

export default LoadEventCodeGenerator;
