/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for variables blocks.
 */
'use strict';

goog.provide('Blockly.Arduino.variables');

goog.require('Blockly.Arduino');

const LoadVariableCodeGenerator = () => {
  /**
   * Code generator for variable (X) getter.
   * Arduino code: loop { X }
   * @param {Blockly.Block} block Block to generate the code from.
   * @return {array} Completed code with order of operation.
   */
  Blockly.Arduino['variables_get'] = function (block) {
    if (Blockly.Arduino.variableDB_) {
      var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
      return [code, Blockly.Arduino.ORDER_ATOMIC];
    }
    return ['', Blockly.Arduino.ORDER_ATOMIC];
  };

  /**
   * Code generator for variable (X) setter (Y).
   * Arduino code: type X;
   *               loop { X = Y; }
   * @param {Blockly.Block} block Block to generate the code from.
   * @return {string} Completed code.
   */
  Blockly.Arduino['variables_set'] = function (block) {
    var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';

    //console.log(block.getBlockType());
    //console.log(block.childBlocks_[0].type);

    if (block.childBlocks_.length) {
      if (block.childBlocks_[0].type == "lists_create_with") {
        // console.log("test1");
        var varName = block.getFieldValue('VAR');
        var decl = 'int ' + varName + '[] = ' + argument0 + ';\n';
        Blockly.Arduino.addDeclaration('create_int_list', decl);
        return '';
      } else if (block.childBlocks_[0].type == "lists_create_with2") {
        // console.log("test2");
        var varName = block.getFieldValue('VAR');
        var decl = 'String ' + varName + '[] = ' + argument0 + ';\n';
        Blockly.Arduino.addDeclaration('create_string_list', decl);
        return '';
      } else {
        // console.log('test3');

        var varName = Blockly.Arduino.variableDB_.getName(
          block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
        //var varName = block.getFieldValue('VAR');
        console.log(argument0, 'argument0argument0');
        return varName + ' = ' + argument0 + ';\n';
      }
    }
    // var argument0_Type = block.getBlockType();

    var varName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    //var varName = block.getFieldValue('VAR');
    return varName + ' = ' + argument0 + ';\n';
  };

  /**
   * Code generator for variable (X) csasting (Y).
   * Arduino code: loop { (Y)X }
   * @param {Blockly.Block} block Block to generate the code from.
   * @return {array} Completed code with order of operation.
   */
  Blockly.Arduino['variables_set_type'] = function (block) {
    var argument0 = Blockly.Arduino.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var varType = Blockly.Arduino.getArduinoType_(
      Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
    var code = '(' + varType + ')(' + argument0 + ')';
    console.log(code, '9999999999');
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };
}

export default LoadVariableCodeGenerator;
