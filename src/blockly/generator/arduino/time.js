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
    Blockly.Arduino['time_delay'] = function (block) {
        var delayTime = Blockly.Arduino.valueToCode(
            block, 'DELAY_TIME_MILI', Blockly.Arduino.ORDER_ATOMIC) || '0';
        var code = 'delay(' + delayTime + ');\n';
        return code;
    };

    /**
     * Code generator for the delayMicroseconds block.
     * Arduino code: loop { delayMicroseconds(X); }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['time_delaymicros'] = function (block) {
        var delayTimeMs = Blockly.Arduino.valueToCode(
            block, 'DELAY_TIME_MICRO', Blockly.Arduino.ORDER_ATOMIC) || '0';
        var code = 'delayMicroseconds(' + delayTimeMs + ');\n';
        return code;
    };

    /**
     * Code generator for the elapsed time in milliseconds block.
     * Arduino code: loop { millis() }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {array} Completed code with order of operation.
     */
    Blockly.Arduino['time_millis'] = function (block) {
        var code = 'millis()';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    /**
     * Code generator for the elapsed time in microseconds block.
     * Arduino code: loop { micros() }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {array} Completed code with order of operation.
     */
    Blockly.Arduino['time_micros'] = function (block) {
        var code = 'micros()';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    /**
     * Code generator for the wait forever (end of program) block
     * Arduino code: loop { while(true); }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['infinite_loop'] = function (block) {
        return 'while(true);\n';
    };


    Blockly.Arduino['time_chrono_setup'] = function (block) {
        Blockly.Arduino.addInclude("chrono.h", "#include <Chrono.h>\n");
        Blockly.Arduino.addDeclaration("chrono_dec", "Chrono myChrono;\n");
        return '';
    }

    Blockly.Arduino['time_chrono_reset'] = function (block) {
        var code = "myChrono.restart();\n";
        return code;
    }

    Blockly.Arduino['time_chrono_elapsed'] = function (block) {
        var code = "myChrono.elapsed()";
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    }

    Blockly.Arduino['time_chrono_timeCheck'] = function (block) {
        var time = Blockly.Arduino.valueToCode(this, "TIME", Blockly.Arduino.ORDER_ATOMIC);
        var code = "myChrono.hasPassed(" + time + ")";
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    }

    Blockly.Arduino['time_everySecond'] = function (block) {
        var time = Blockly.Arduino.valueToCode(this, "TIME", Blockly.Arduino.ORDER_ATOMIC);
        Blockly.Arduino.addDeclaration("everySecondState_" + time, "int everySecondState_" + time + " = 0;")
        var stack_statements = Blockly.Arduino.statementToCode(block, "STACK", Blockly.Arduino.ORDER_ATOMIC)
        if (time >= 2)
            var code = "if ((millis() / 1000) % " + time + " == " + (time - 2) + " && everySecondState_" + time + " == 0) {\n" +
                "  " + stack_statements + "\n" +
                "  everySecondState_" + time + " = 1;\n" +
                "} else if ((millis() / 1000) % " + time + " == " + (time - 1) + ") {\n" +
                "  everySecondState_" + time + " = 0;\n" +
                "}\n"
        else {
            var code = "if ((millis() / 100) % 10 == 1 && everySecondState_" + time + " == 0) {\n" +
                "  " + stack_statements + "\n" +
                "  everySecondState_" + time + " = 1;\n" +
                "} else if ((millis() / 100) % 10 == 2 && everySecondState_" + time + " == 1) {\n" +
                "  everySecondState_" + time + " = 0;\n" +
                "}\n"
        }
        return code;
    }


    Blockly.Arduino['time_everyMilliSecond'] = function (block) {
        var time = Blockly.Arduino.valueToCode(this, "TIME", Blockly.Arduino.ORDER_ATOMIC);
        Blockly.Arduino.addDeclaration("timePeriodExecutionState_" + time, "int timePeriodExecutionState_" + time + " = 0;")
        var stack_statements = Blockly.Arduino.statementToCode(block, "STACK", Blockly.Arduino.ORDER_ATOMIC)
        var code = "if ((millis()) % " + time + " == " + (time - 1) + " && timePeriodExecutionState_" + time + " == 0) {\n" +
            "  " + stack_statements + "\n" +
            "  timePeriodExecutionState_" + time + " = 1;\n" +
            "} else if ((millis()) % " + time + " == " + 0 + ") {\n" +
            "  timePeriodExecutionState_" + time + " = 0;\n" +
            "}\n"
        return code;
    }
}

export default LoadTimeCodeGenerator;
