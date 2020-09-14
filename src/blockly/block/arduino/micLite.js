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

import FieldColorpicker from '../widgets/field-colorpicker';

goog.provide('Blockly.Blocks.control');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadMicLiteBlocks = () => {

    /** Common HSV hue for all blocks in this category. */
    Blockly.Blocks['micLite_led_color'] = {
        /**
         * Block for boolean data type: true and false.
         * @this Blockly.Block
         */
        // init: function () {
        //     this.jsonInit({
        //         "message0": "LED彩灯亮 %1",
        //         "args0": [{
        //             "type": "field_dropdown",
        //             "name": "OP",
        //             "options": [
        //                 [Blockly.Msg.COLOUR_RGB_RED, '1'],
        //                 [Blockly.Msg.COLOUR_RGB_GREEN, '2'],
        //                 [Blockly.Msg.COLOUR_RGB_BLUE, '3'],
        //                 [Blockly.Msg.MIC_CLOSED, '0']
        //             ]
        //         }],
        //         "previousStatement": null,
        //         "nextStatement": null,
        //         "colour": Blockly.Msg.MathHUE,
        //         "helpUrl": Blockly.Msg.MATH_CHANGE_HELPURL
        //     });
        // }

        init: function () {
            var OPERATORS = [
                [Blockly.Msg.COLOUR_RGB_RED, '1'],
                [Blockly.Msg.COLOUR_RGB_GREEN, '2'],
                [Blockly.Msg.COLOUR_RGB_BLUE, '3'],
                [Blockly.Msg.MIC_CLOSED, '0']
            ]
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput('LED_COLOR')
                .appendField(Blockly.Msg.MIC_LED_LITE_COLOR)
                .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP);
        }
    };

    Blockly.Blocks['show_text'] = {
        /**
         * Block for appending to a variable in place.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.TEXT_APPEND_HELPURL);
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendValueInput('TEXT')
                .appendField(Blockly.Msg.MIC_LED_SHOW_TEXT);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            // Assign 'this' to a variable for use in the tooltip closure below.
            var thisBlock = this;
            this.setTooltip(function () {
                return Blockly.Msg.TEXT_APPEND_TOOLTIP.replace('%1',
                    thisBlock.getFieldValue('VAR'));
            });
        },
        /**
         * Set's the type of the variable selected in the drop down list. As there is
         * only one possible option, the variable input is not really checked.
         * @param {!string} varName Name of the variable to check type.
         * @return {string} String to indicate the variable type.
         */
        getVarType: function (varName) {
            return Blockly.Types.TEXT;
        }
    };

    Blockly.Blocks['display_matrix'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_MATRIX)
                .appendField(new FieldColorpicker(), 'field_matrixColorPicker')
                .appendField("  ");
            this.setInputsInline(false);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(Blockly.Msg.SerialHUE);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

    Blockly.Blocks['micLite_notes'] = {
        /**
         * Block for boolean data type: true and false.
         * @this Blockly.Block
         */

        init: function () {
            var OPERATORS = [
                ['C4「Bass do」', '262'],
                ['D4「Bass re」', '294'],
                ['E4「Bass mi」', '330'],
                ['F4「Bass fa」', '349'],
                ['G4「Bass sol」', '392'],
                ['A4「Bass la」', '440'],
                ['B4「Bass xi」', '494'],
                ['C5「Midrange do」', '523'],
                ['D5「Midrange re」', '587'],
                ['E5「Midrange mi」', '659'],
                ['F5「Midrange fa」', '698'],
                ['G5「Midrange sol」', '784'],
                ['A5「Midrange la」', '880'],
                ['B5「Midrange xi」', '988'],
                ['C6「Treble do」', '1047'],
                ['D6「Treble re」', '1175'],
                ['E6「Treble mi」', '1319'],
                ['F6「Treble fa」', '1397'],
                ['G6「Treble sol」', '1568'],
                ['A6「Treble la」', '1760'],
                ['B6「Treble xi」', '1976']
            ]
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput('LITE_NOTES')
                .appendField(Blockly.Msg.MIC_LED_NOTES + ' ' + Blockly.Msg.MIC_LED_NOTES_TONES)
                .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
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

    Blockly.Blocks['click_button_AB'] = {
        /**
         * Block for creating a pin state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_LITE_PRESS)
                .appendField(
                    new Blockly.FieldDropdown([
                        ['A', '5'],
                        ['B', '6']
                    ]),
                    'STATE')
                .appendField(Blockly.Msg.MIC_LITE_BUTTON);
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['touch_robot_port'] = {
        /**
         * Block for creating a pin state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_LITE_TOUCH)
                .appendField(
                    new Blockly.FieldDropdown([
                        ['0', '14'],
                        ['1', '15'],
                        ['2', '16'],
                        ['3', '17'],
                        ['4', '18']
                    ]),
                    'STATE')
                .appendField(Blockly.Msg.MIC_LITE_BUTTON);
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['micLite_clear_screen'] = {
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput('LITE_CLEAR_SCREEN')
                .appendField(Blockly.Msg.MIC_LITE_CLEAR_SCREEN)
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP);
        }
    };


    Blockly.Blocks['micLite_notes_play'] = {
        /**
         * Block for boolean data type: true and false.
         * @this Blockly.Block
         */
        init: function () {
            var OPERATORS = [
                [Blockly.Msg.MIC_LITE_A_TASKET, '1'],
                [Blockly.Msg.MIC_LITE_TWO_TIGERS, '2'],
                [Blockly.Msg.MIC_LITE_DORAEMON, '3'],
                [Blockly.Msg.MIC_LITE_LITTLE_APPLE, '8']
            ]
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput('NOTES_PLAY')
                .appendField(Blockly.Msg.MIC_LED_NOTES + ' ' + Blockly.Msg.MIC_LITE_NOTES_PLAY)
                .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP);
        }
    };

    Blockly.Blocks['micLite_notes_play_wait'] = {
        /**
         * Block for boolean data type: true and false.
         * @this Blockly.Block
         */
        init: function () {
            var OPERATORS = [
                [Blockly.Msg.MIC_LITE_A_TASKET, '1'],
                [Blockly.Msg.MIC_LITE_TWO_TIGERS, '2'],
                [Blockly.Msg.MIC_LITE_DORAEMON, '3'],
                [Blockly.Msg.MIC_LITE_LITTLE_APPLE, '8']
            ]
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput('NOTES_PLAY')
                .appendField(Blockly.Msg.MIC_LED_NOTES + ' ' + Blockly.Msg.MIC_LITE_NOTES_PLAY)
                .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
            this.appendDummyInput('NOTES_PLAY')
                .appendField(Blockly.Msg.MIC_LITE_NOTES_PLAY_WAIT);
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP);
        }
    };

    Blockly.Blocks['micLite_notes_stop'] = {
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput('LITE_CLEAR_SCREEN')
                .appendField(`${Blockly.Msg.MIC_LED_NOTES}${Blockly.Msg.MIC_LITE_NOTES_STOP}`)
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP);
        }
    };

    Blockly.Blocks['micLite_notes_light'] = {
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_LITE_NOTES_LIGHT);
            this.setOutput(true, "Number");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micLite_notes_sound'] = {
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Msg.SerialHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_LITE_NOTES_SOUND);
            this.setOutput(true, "Number");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micLite_notes_speed'] = {
        /**
         * Block for rounding functions.
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MIC_LITE_NOTES_SPEED,
                "args0": [{
                    "type": "field_dropdown",
                    "name": "OP",
                    "options": [
                        [Blockly.Msg.MIC_LITE_NOTES_SPEEDX, 'X'],
                        [Blockly.Msg.MIC_LITE_NOTES_SPEEDY, 'Y'],
                        [Blockly.Msg.MIC_LITE_NOTES_SPEEDZ, 'Z']
                    ]
                }
                ],
                "output": Blockly.Types.NUMBER.output,
                "colour": Blockly.Msg.SerialHUE,
                "tooltip": Blockly.Msg.MATH_ROUND_TOOLTIP,
                "helpUrl": Blockly.Msg.MATH_ROUND_HELPURL
            });
        },
        /** @return {!string} Type of the block, round always returns a float. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };
}

export default LoadMicLiteBlocks;
