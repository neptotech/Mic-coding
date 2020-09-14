/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blocks for Arduino Digital and Analogue input and output
 *     functions. The Arduino function syntax can be found at
 *     http://arduino.cc/en/Reference/HomePage
 *
 * TODO: maybe change this to a "PIN" BlocklyType
 */
'use strict';

goog.provide('Blockly.Blocks.io');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadIOBlocks = () => {
    /** Common HSV hue for all blocks in this category. */
    Blockly.Blocks.io.HUE = '#f3ab3a';

    Blockly.Blocks['io_digitalwrite'] = {
        /**
         * Block for creating a 'set pin' to a state.
         * @this Blockly.Block
         */
        init: function() {
            this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output)
                .appendField(Blockly.Msg.ARD_DIGITALWRITE);
            this.appendValueInput('STATE')
                //.appendField(Blockly.Msg.ARD_DIGITALWRITE)
                //.appendField(new Blockly.FieldTextInput("1"), "PIN")
                // .appendField(new Blockly.FieldDropdown(
                //     Blockly.Arduino.Boards.selected.digitalPins), 'PIN')
                .appendField(Blockly.Msg.ARD_WRITE_TO)
                .setCheck(Blockly.Types.BOOLEAN.checkList);

            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_DIGITALWRITE_TIP);
        },
        /**
         * Updates the content of the the pin related fields.
         * @this Blockly.Block
         */
        updateFields: function() {
            Blockly.Arduino.Boards.refreshBlockFieldDropdown(
                this, 'PIN', 'digitalPins');
        }
    };

    Blockly.Blocks['io_digitalread'] = {
        /**
         * Block for creating a 'read pin'.
         * @this Blockly.Block
         */
        init: function() {
            this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
            this.setColour(Blockly.Blocks.io.HUE);
            // this.appendDummyInput()
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output)
                .appendField(Blockly.Msg.ARD_DIGITALREAD);
            // .appendField(new Blockly.FieldDropdown(
            //     Blockly.Arduino.Boards.selected.digitalPins), 'PIN');
            // .appendField(new Blockly.FieldTextInput("1"), "PIN");
            this.setInputsInline(true);
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_DIGITALREAD_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.BOOLEAN;
        },
        /**
         * Updates the content of the the pin related fields.
         * @this Blockly.Block
         */
        updateFields: function() {
            Blockly.Arduino.Boards.refreshBlockFieldDropdown(
                this, 'PIN', 'digitalPins');
        }
    };

    Blockly.Blocks['io_builtin_led'] = {
        /**
         * Block for setting built-in LED to a state.
         * @this Blockly.Block
         */
        init: function() {
            this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendValueInput('STATE')
                .appendField(Blockly.Msg.ARD_BUILTIN_LED)
                .appendField(new Blockly.FieldDropdown(
                    Blockly.Arduino.Boards.selected.builtinLed), 'BUILT_IN_LED')
                .appendField('to')
                .setCheck(Blockly.Types.BOOLEAN.checkList);
            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_BUILTIN_LED_TIP);
        },
        /**
         * Updates the content of the the pin related fields.
         * @this Blockly.Block
         */
        updateFields: function() {
            Blockly.Arduino.Boards.refreshBlockFieldDropdown(
                this, 'BUILT_IN_LED', 'builtinLed');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.BOOLEAN;
        },
    };

    Blockly.Blocks['io_analogwrite'] = {
        /**
         * Block for creating a 'set pin' to an analogue value.
         * @this Blockly.Block
         */
        init: function() {
            this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendValueInput('PIN')
                .setCheck([Blockly.Types.NUMBER.output, Blockly.Types.TEXT.output])
                .appendField(Blockly.Msg.ARD_ANALOGWRITE);
            this.appendValueInput('ANALOGNUM')

                // .appendField(new Blockly.FieldDropdown(
                //     Blockly.Arduino.Boards.selected.pwmPins), 'PIN')
                // .appendField(new Blockly.FieldNumber(1, 0, 13, 1), "PIN")
                .appendField(Blockly.Msg.ARD_WRITE_TO)
                .setCheck(Blockly.Types.NUMBER.output);
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_ANALOGWRITE_TIP);
        },
        /**
         * Updates the content of the the pin related fields.
         * @this Blockly.Block
         */
        updateFields: function() {
            Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'pwmPins');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        },
    };

    Blockly.Blocks['io_analogread'] = {
        /**
         * Block for reading an analogue input.
         * @this Blockly.Block
         */
        init: function() {
            this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
            this.setColour(Blockly.Blocks.io.HUE);
            // this.appendDummyInput()
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output)
                .appendField(Blockly.Msg.ARD_ANALOGREAD)
            // .appendField(new Blockly.FieldDropdown(
            //     Blockly.Arduino.Boards.selected.analogPins), 'PIN');
            // .appendField(new Blockly.FieldTextInput("A0"), "PIN");
            this.setInputsInline(true);
            this.setOutput(true, "Number");

            this.setTooltip(Blockly.Msg.ARD_ANALOGREAD_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        },
        /**
         * Updates the content of the the pin related fields.
         * @this Blockly.Block
         */
        updateFields: function() {
            Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'analogPins');
        }
    };

    Blockly.Blocks['io_pwmwrite'] = {
        /**
         * Block for creating a 'set pin' to an analogue value.
         * @this Blockly.Block
         */
        init: function() {
            this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendValueInput('PIN')
                .setCheck([Blockly.Types.NUMBER.output, Blockly.Types.TEXT.output])
                .appendField(Blockly.Msg.ARD_PWMWRITE);
            this.appendValueInput('PWMVALUE')

                // .appendField(new Blockly.FieldDropdown(
                //     Blockly.Arduino.Boards.selected.pwmPins), 'PIN')
                // .appendField(new Blockly.FieldNumber(1, 0, 13, 1), "PIN")
                .appendField(Blockly.Msg.ARD_WRITE_TO)
                .setCheck(Blockly.Types.NUMBER.output);
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_ANALOGWRITE_TIP);
        },
        /**
         * Updates the content of the the pin related fields.
         * @this Blockly.Block
         */
        updateFields: function() {
            Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'pwmPins');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        },
    };

    Blockly.Blocks['io_highlow'] = {
        /**
         * Block for creating a pin state.
         * @this Blockly.Block
         */
        init: function() {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendDummyInput()
                .appendField(
                    new Blockly.FieldDropdown([
                        [Blockly.Msg.ARD_HIGH, 'HIGH'],
                        [Blockly.Msg.ARD_LOW, 'LOW']
                    ]),
                    'STATE');
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['io_pulsein'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(Blockly.Msg.ARD_PULSEREAD);
            this.appendValueInput("PULSETYPE")
                .setCheck(Blockly.Types.BOOLEAN.check);
            this.appendDummyInput()
                .appendField(Blockly.Msg.ARD_PULSEON)
                .appendField(new Blockly.FieldDropdown(
                    Blockly.Arduino.Boards.selected.digitalPins), "PULSEPIN");
            this.setOutput(true);
            this.setInputsInline(true);
            this.setColour(Blockly.Blocks.io.HUE);
            this.setTooltip(Blockly.Msg.ARD_PULSE_TIP);
            this.setHelpUrl('https://www.arduino.cc/en/Reference/PulseIn');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['io_pulsetimeout'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(Blockly.Msg.ARD_PULSEREAD);
            this.appendValueInput("PULSETYPE")
                .setCheck(Blockly.Types.BOOLEAN.check);
            this.appendDummyInput()
                .appendField(Blockly.Msg.ARD_PULSEON)
                .appendField(new Blockly.FieldDropdown(
                    Blockly.Arduino.Boards.selected.digitalPins), "PULSEPIN");
            this.appendDummyInput()
                .appendField(Blockly.Msg.ARD_PULSETIMEOUT);
            this.appendValueInput('TIMEOUT')
                .setCheck(Blockly.Types.NUMBER.output);
            this.appendDummyInput()
                .appendField(Blockly.Msg.ARD_PULSETIMEOUT_MS);
            this.setOutput(true);
            this.setInputsInline(true);
            this.setColour(Blockly.Blocks.io.HUE);
            this.setTooltip(Blockly.Msg.ARD_PULSETIMEOUT_TIP);
            this.setHelpUrl('https://www.arduino.cc/en/Reference/PulseIn');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['io_dropdown_digital'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(
                    Blockly.Arduino.Boards.selected.digitalPins), 'SELECTPIN');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Blocks.io.HUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['io_dropdown_analog'] = {
        /**
         * Block for creating a analog pin selector.
         * @this Blockly.Block
         */
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(
                    Blockly.Arduino.Boards.selected.analogPins), 'SELECTPIN');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Blocks.io.HUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['io_dropdown_pwm'] = {
        /**
         * Block for creating a analog pin selector.
         * @this Blockly.Block
         */
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(
                    Blockly.Arduino.Boards.selected.pwmPins), 'SELECTPIN');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Blocks.io.HUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['analogread'] = {
        /**
         * Block for reading an analogue input.
         * @this Blockly.Block
         */
        init: function () {
          this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
          this.setColour(Blockly.Blocks.io.HUE);
          // this.appendDummyInput()
          this.appendValueInput('PIN')
            .setCheck(Blockly.Types.NUMBER.output)
            .appendField(Blockly.Msg.ARD_ANALOGREAD)
          // .appendField(new Blockly.FieldDropdown(
          //     Blockly.Arduino.Boards.selected.analogPins), 'PIN');
          // .appendField(new Blockly.FieldTextInput("A0"), "PIN");
          this.setInputsInline(true);
          this.setOutput(true, "Number");
    
          this.setTooltip(Blockly.Msg.ARD_ANALOGREAD_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
          return Blockly.Types.NUMBER;
        },
        /**
         * Updates the content of the the pin related fields.
         * @this Blockly.Block
         */
        updateFields: function () {
          Blockly.Arduino.Boards.refreshBlockFieldDropdown(this, 'PIN', 'analogPins');
        }
    };
}

export default LoadIOBlocks;