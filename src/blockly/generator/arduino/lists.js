/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for list blocks.
 *
 * TODO: A lot of this can be converted to arrays code by creating functions to
 *       replicate this kind of behavior.
 */
'use strict';

goog.provide('Blockly.Arduino.lists');

goog.require('Blockly.Arduino');

const LoadListsCodeGenerator = () => {
    Blockly.Arduino['lists_create_with'] = function (block) {
        // Create a list with any number of elements of any type.
        var size = block.itemCount_;
        var code = new Array(this.itemCount_);
        for (var n = 0; n < this.itemCount_; n++) {
            code[n] = Blockly.Arduino.valueToCode(this, 'ADD' + n,
                Blockly.Arduino.ORDER_NONE) || '0';
        }
        var res_code = '{' + code.join(', ') + '}';
        return [res_code, Blockly.Arduino.ORDER_ATOMIC];
    };


    Blockly.Arduino['lists_create_with2'] = function (block) {
        // Create a list with any number of elements of any type.
        var size = block.itemCount_;
        var code = new Array(this.itemCount_);
        for (var n = 0; n < this.itemCount_; n++) {
            code[n] = Blockly.Arduino.valueToCode(this, 'ADD' + n,
                Blockly.Arduino.ORDER_NONE) || '"string"';
        }
        var res_code = '{' + code.join(', ') + '}';
        return [res_code, Blockly.Arduino.ORDER_ATOMIC];
    };


    //Blockly.Arduino['lists_repeat'] = Blockly.Arduino.noGeneratorCodeInline;

    Blockly.Arduino['lists_length'] = function (block) {
        var varName = Blockly.Arduino.valueToCode(this, 'VAR',
            Blockly.Arduino.ORDER_ATOMIC) || 'list';
        let code = 'sizeof(' + varName + ')/sizeof(' + varName + '[0])';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    //Blockly.Arduino['lists_isEmpty'] = Blockly.Arduino.noGeneratorCodeInline;

    //Blockly.Arduino['lists_indexOf'] = Blockly.Arduino.noGeneratorCodeInline;

    Blockly.Arduino['lists_getIndex'] = function (block) {
        // Indexing into a list is the same as indexing into a string.
        var varName = Blockly.Arduino.valueToCode(this, 'VAR',
            Blockly.Arduino.ORDER_ATOMIC) || 'list';
        var argument0 = Blockly.Arduino.valueToCode(this, 'AT',
            Blockly.Arduino.ORDER_ADDITIVE) || '0';
        if (argument0.match(/^\d+$/)) {
            // If the index is a naked number, decrement it right now.
            argument0 = parseInt(argument0, 10);
        } else {
            // If the index is dynamic, decrement it in code.
            //argument0 += ' - 1';
        }
        // console.log();
        var code = varName + '[(int)(' + argument0 + ')]';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['lists_setIndex'] = function (block) {
        // Set element at index.
        //checktip1 -- if can't success .check Blockly.Variables.NAME_TYPE
        var varName = Blockly.Arduino.valueToCode(this, 'VAR',
            Blockly.Arduino.ORDER_ATOMIC) || 'list';
        var argument0 = Blockly.Arduino.valueToCode(this, 'AT',
            Blockly.Arduino.ORDER_ADDITIVE) || '1';

        var argument1 = Blockly.Arduino.valueToCode(this, 'TO',
            Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
        // Blockly uses one-based indicies.
        if (argument0.match(/^\d+$/)) {
            // If the index is a naked number, decrement it right now.
            argument0 = parseInt(argument0, 10);
        } else {
            // If the index is dynamic, decrement it in code.
            //argument0 += ' - 1';
        }
        return varName + '[(int)(' + argument0 + ')] = ' + argument1 + ';\n';
    };

    Blockly.Arduino['lists_variable_get'] = function (block) {
        var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'),
            Blockly.Variables.NAME_TYPE);
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };
    /**
     * Code generator for array variable (X) setter (Y).
     * Arduino code: type X;
     *               loop { X = Y; }
     * @param {Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['lists_variable_set'] = function (block) {
        var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE',
            Blockly.Arduino.ORDER_ASSIGNMENT) || '{}';
        // console.log("generator_list -122- ");
        // console.log(block);
        // console.log("generator_list -122-end ");
        if (block.childBlocks_.length) {
            if (block.childBlocks_[0].type == "lists_create_with") {
                // console.log("test1");

                var varName = block.getField('VAR').getText();
                var declName = 'create_int_list_' + varName;
                var decl = 'int ' + varName + '[' + this.getChildren()[0].itemCount_ + '] = ' + argument0 + ';\n';
                Blockly.Arduino.addDeclaration(declName, decl);
                return '';
            } else if (block.childBlocks_[0].type == "lists_create_with2") {
                // console.log("test2");
                var varName = block.getField('VAR').getText();
                var declName = 'create_int_list_' + varName;
                var decl = 'String ' + varName + '[' + this.getChildren()[0].itemCount_ + '] = ' + argument0 + ';\n';
                Blockly.Arduino.addDeclaration(declName, decl);
                return '';
            }
        }

        var varName = Blockly.Arduino.variableDB_.getName(
            block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
        var decl = 'String ' + varName + '[] = ' + argument0 + ';\n';
        Blockly.Arduino.addDeclaration('create_string_list', decl);
        return '';
    };
}

export default LoadListsCodeGenerator;
