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

goog.provide('Blockly.Blocks.micShow');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');
import { drapMenu } from './micMenu';

const LoadMicShowBlocks = () => {

    /** Common HSV hue for all blocks in this category. */

    Blockly.Blocks['micShow_rgb'] = {
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MICSHOW_RGB,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "RED",
                        "check": Blockly.Types.NUMBER.checkList
                    },
                    {
                        "type": "input_value",
                        "name": "GREEN",
                        "check": Blockly.Types.NUMBER.checkList
                    },
                    {
                        "type": "input_value",
                        "name": "BLUE",
                        "check": Blockly.Types.NUMBER.checkList
                    }
                ],
                "inputsInline": true,
                "output": Blockly.Types.NUMBER.output,
                "colour": Blockly.Msg.ProceduresHUE,
                "tooltip": Blockly.Msg.MICSHOW_RGB_TOOLTIP,
                "helpUrl": Blockly.Msg.MICSHOW_RGB_HELPURL
            });
        },
        /** @return {!string} Type of the block, by definition always an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micDisplay_colorLED_transition'] = {
        // init: function () {
        //     this.appendDummyInput()
        //         .appendField('colour:')
        //         .appendField(new Blockly.FieldColour('#ff0000'), 'FIELDNAME');
        // }
        init: function () {
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_DISPLAY_COLORLED_TRANSITION_PORT)
            this.appendValueInput('PIN');
            this.jsonInit({
                "message0": Blockly.Msg.MIC_DISPLAY_COLORLED_TRANSITION,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "NUM0",
                        "check": Blockly.Types.NUMBER.checkList
                    },
                    {
                        "type": "input_value",
                        "name": "COLOR_BEGIN"
                    },
                    {
                        "type": "input_value",
                        "name": "COLOR_END"
                    }, {
                        "type": "input_value",
                        "name": "duration"
                    }
                ],
                "colour": Blockly.Msg.ProceduresHUE,
                "tooltip": Blockly.Msg.MICSHOW_RGB_TOOLTIP,
                "helpUrl": Blockly.Msg.MICSHOW_RGB_HELPURL
            });
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
        }
    };

    Blockly.Blocks['micDisplay_colorLED_port'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
            const drapList = drapMenu;
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(drapList), 'port');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Msg.ProceduresHUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micdisplay_colorLED_color'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_DISPLAY_COLORLED_TRANSITION_PORT)
            this.appendValueInput('PIN');
            this.jsonInit({
                "message0": Blockly.Msg.MIC_DISPLAY_COLORLED_COLOR,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "NUM0",
                        "check": Blockly.Types.NUMBER.checkList
                    },
                    {
                        "type": "input_value",
                        "name": "COLOR_BEGIN"
                    }
                ],
                "colour": Blockly.Msg.ProceduresHUE,
                "tooltip": Blockly.Msg.MICSHOW_RGB_TOOLTIP,
                "helpUrl": Blockly.Msg.MICSHOW_RGB_HELPURL
            });
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
        }
    };

    Blockly.Blocks['mic_LED_color'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldColour('#ff0000'), 'FIELDNAME');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Msg.ProceduresHUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };
}

export default LoadMicShowBlocks;
