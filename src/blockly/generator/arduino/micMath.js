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

goog.provide('Blockly.Arduino.math');

goog.require('Blockly.Arduino');

const LoadMathCodeGenerator = () => {
    Blockly.Arduino['micMath_random_int'] = function (block) {
        var argument0 = Blockly.Arduino.valueToCode(block, 'FROM',
            Blockly.Arduino.ORDER_NONE) || '0';
        var argument1 = Blockly.Arduino.valueToCode(block, 'TO',
            Blockly.Arduino.ORDER_NONE) || '0';
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_random_int', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_random_int.random_function = functionName;
        var code = `random(${argument0}, ${argument1})`;
        return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
    };

    Blockly.Arduino['micMath_and'] = function (block) {
        var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
        var order = (operator == '&&') ? Blockly.Arduino.ORDER_LOGICAL_AND :
            Blockly.Arduino.ORDER_LOGICAL_OR;
        var argument0 = Blockly.Arduino.valueToCode(block, 'A', order) || 'false';
        var argument1 = Blockly.Arduino.valueToCode(block, 'B', order) || 'false';
        if (!argument0 && !argument1) {
            // If there are no arguments, then the return value is false.
            argument0 = 'false';
            argument1 = 'false';
        } else {
            // Single missing arguments have no effect on the return value.
            var defaultArgument = (operator == '&&') ? 'true' : 'false';
            if (!argument0) {
                argument0 = defaultArgument;
            }
            if (!argument1) {
                argument1 = defaultArgument;
            }
        }
        var code = argument0 + ' ' + operator + ' ' + argument1;
        return [code, order];
    };

    Blockly.Arduino['micMath_not'] = function (block) {
        var order = Blockly.Arduino.ORDER_UNARY_PREFIX;
        var argument0 = Blockly.Arduino.valueToCode(block, 'MICMATH0', order) || 'false';
        var code = `(!${argument0})`;
        return [code, order];
    };

    Blockly.Arduino['micMath_join'] = function (block) {
        // Create a list with any number of elements of any type.
        var size = block.itemCount_;
        var code = new Array(this.itemCount_);
        for (var n = 0; n < this.itemCount_; n++) {
            const arg = Blockly.Arduino.valueToCode(this, 'ADD' + n,
                Blockly.Arduino.ORDER_NONE)
            code[n] = `String(${arg})` || '"string"';
        }
        var res_code = code.join('  + ');
        return [res_code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micMath_charAt'] = function (block) {
        // Create a list with any number of elements of any type.
        var size = block.itemCount_;
        var code = new Array(this.itemCount_);
        const arg0 = Blockly.Arduino.valueToCode(this, 'ADD0',
            Blockly.Arduino.ORDER_NONE);
        const arg1 = Blockly.Arduino.valueToCode(this, 'ADD1',
            Blockly.Arduino.ORDER_NONE);
        code = `String(${arg0}).charAt(${arg1} - 1)`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micMath_charLength'] = function (block) {
        // Create a list with any number of elements of any type.
        var size = block.itemCount_;
        var code = new Array(this.itemCount_);
        const arg0 = Blockly.Arduino.valueToCode(this, 'ADD0',
            Blockly.Arduino.ORDER_NONE);
        code = `strlen((String(${arg0}).c_str()))`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micMath_contains'] = function (block) {
        // Create a list with any number of elements of any type.
        var size = block.itemCount_;
        var code = new Array(this.itemCount_);
        const arg0 = Blockly.Arduino.valueToCode(this, 'ADD0',
            Blockly.Arduino.ORDER_NONE);
        const arg1 = Blockly.Arduino.valueToCode(this, 'ADD1',
            Blockly.Arduino.ORDER_NONE);
        code = `stringContains(${arg0}, ${arg1})`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['micMath_remainder'] = function (block) {
        var argument0 = Blockly.Arduino.valueToCode(block, 'DIVISOR',
            Blockly.Arduino.ORDER_NONE) || '0';
        var argument1 = Blockly.Arduino.valueToCode(block, 'DIVIDEND',
            Blockly.Arduino.ORDER_NONE) || '0';
        var code = `(${argument0} % ${argument1})`;
        return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
    };

    Blockly.Arduino['micMath_single'] = function (block) {
        var operator = block.getFieldValue('OP');
        var code;
        var arg;
        if (operator == 'NEG') {
            // Negation is a special case given its different operator precedents.
            arg = Blockly.Arduino.valueToCode(block, 'NUM',
                Blockly.Arduino.ORDER_UNARY_PREFIX) || '0';
            if (arg[0] == '-') {
                // --3 is not legal in C++ in this context.
                arg = ' ' + arg;
            }
            code = '-' + arg;
            return [code, Blockly.Arduino.ORDER_UNARY_PREFIX];
        }
        if (operator == 'ABS' || operator.substring(0, 5) == 'ROUND') {
            arg = Blockly.Arduino.valueToCode(block, 'NUM',
                Blockly.Arduino.ORDER_UNARY_POSTFIX) || '0';
        } else if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
            arg = Blockly.Arduino.valueToCode(block, 'NUM',
                Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
        } else {
            arg = Blockly.Arduino.valueToCode(block, 'NUM',
                Blockly.Arduino.ORDER_NONE) || '0';
        }
        // First, handle cases which generate values that don't need parentheses.
        switch (operator) {
            case 'ABS':
                code = 'abs(' + arg + ')';
                break;
            case 'FLOOR':
                code = 'floor(' + arg + ')';
                break;
            case 'CEIL':
                code = 'ceil(' + arg + ')';
                break;
            case 'SQRT':
                code = 'sort(' + arg + ')';
                break;
            case 'FLOOR':
                code = 'floor(' + arg + ')';
                break;
            case 'FLOOR':
                code = 'floor(' + arg + ')';
                break;
            case 'FLOOR':
                code = 'floor(' + arg + ')';
                break;
            case 'ROOT':
                code = 'sqrt(' + arg + ')';
                break;
            case 'LOG':
                code = 'log(' + arg + ')';
                break;
            case 'EXP':
                code = 'exp(' + arg + ')';
                break;
            case 'POW10':
                code = 'pow(10,' + arg + ')';
                break;
            case 'ROUND':
                code = 'round(' + arg + ')';
                break;
            case 'ROUNDUP':
                code = 'ceil(' + arg + ')';
                break;
            case 'ROUNDDOWN':
                code = 'floor(' + arg + ')';
                break;
            case 'SIN':
                code = 'sin(' + arg + ')';
                break;
            case 'COS':
                code = 'cos(' + arg + ')';
                break;
            case 'TAN':
                code = 'tan(' + arg + ')';
                break;
        }
        if (code) {
            return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
        }
        // Second, handle cases which generate values that may need parentheses.
        switch (operator) {
            case 'LOG10':
                code = 'log10(' + arg + ')';
                break;
            case 'ASIN':
                code = 'asin(' + arg + ') / M_PI * 180';
                break;
            case 'ACOS':
                code = 'acos(' + arg + ') / M_PI * 180';
                break;
            case 'ATAN':
                code = 'atan(' + arg + ') / M_PI * 180';
                break;
            default:
                throw 'Unknown math operator: ' + operator;
        }
        return [code, Blockly.Arduino.ORDER_MULTIPLICATIVE];
    };
}
export default LoadMathCodeGenerator;