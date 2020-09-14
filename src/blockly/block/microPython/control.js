/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blocks for Arduino Time functions.
 *     The arduino built in functions syntax can be found in
 *     http://arduino.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Blocks.control');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadControlBlocks = () => {

    /** Common HSV hue for all blocks in this category. */

    Blockly.Blocks['micPythonControl_time_delay'] = {
        /**
         * Delay block definition
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.MdControlHUE);
            this.appendValueInput('DELAY_TIME_SECOND')
                .setCheck(Blockly.Types.NUMBER.checkList)
                .appendField(Blockly.Msg.ARD_TIME_DELAY);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MDCONTROL_TIME_SECOND);
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP);
        }
    };
}
export default LoadControlBlocks;