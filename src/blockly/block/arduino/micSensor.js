goog.provide('Blockly.Blocks.action');
goog.require('Blockly.Blocks');
goog.require('Blockly.Types');
import { drapMenu } from './micMenu';

const LoadMicSensorBlocks = () => {
    Blockly.Blocks['micSensor_ir_send'] = {
        /**
         * Block for 'do while/until' loop.
         * @this Blockly.Block
         */
        init: function () {
            var OPERATORS = [
                ['NEC', 'NEC'],
                ['Sony', 'Sony'],
                ['RC5', 'RC5'],
                ['RC6', 'RC6']
            ];
            this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_SENSOR_IR_SEND);
            this.jsonInit({
                "message0": '%1',
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "MODE",
                        "options": OPERATORS
                    }
                ]
            });
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_SENSOR_IR_SEND_TEXT0);
            this.appendValueInput('TEXT');
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_SENSOR_IR_SEND_BITE);
            this.appendValueInput('NUM0')
                .setCheck(Blockly.Types.NUMBER.checkList)
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        }
    };

    Blockly.Blocks['micSensor_ir_reset_receive'] = {
        /**
         * Block for 'do while/until' loop.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_SENSOR_IR_RESET_RECEIVE)
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        }
    };

    Blockly.Blocks['micSensor_port'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
            const drapList = drapMenu;
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(drapList), 'port');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Blocks.io.HUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micSensor_joystick'] = {
        /**
         * Block for creating a pin state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Blocks.io.HUE);
            this.jsonInit({
                "message0": Blockly.Msg.MIC_SENSOR_JOYSTICK,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "ANALOGPORT",
                        "options": [
                            ['A0', 'A0'],
                            ['A1', 'A1'],
                            ['A2', 'A2'],
                            ['A3', 'A3'],
                            ['A6', 'A6'],
                            ['A7', 'A7']
                        ]
                    }, {
                        "type": "field_dropdown",
                        "name": "POSITION",
                        "options": [
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_UP, '1'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_DOWN, '2'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_LEFT, '3'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_RIGHT, '4'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_CENTER, '0']
                        ]
                    }, {
                        "type": "field_dropdown",
                        "name": "STATE",
                        "options": [
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_RELEASED, '0'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_PRESSED, '1']
                        ]
                    }
                ]
            });
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['micSensor_ir_controller'] = {
        /**
         * Block for creating a pin state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Blocks.io.HUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_SENSOR_IR_CONTROLLER_PORT);
            this.appendValueInput('PIN')
            this.jsonInit({
                "message0": "%1 %2",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "POSITION",
                        "options": [
                            ['Power', '0'],
                            ['A', '1'],
                            ['B', '2'],
                            ['C', '3'],
                            ['D', '4'],
                            ['E', '5'],
                            ['OK', '6'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_UP, '7'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_DOWN, '8'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_LEFT, '9'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_RIGHT, '10'],
                            [Blockly.Msg.MIC_SENSOR_IR_CONTROLLER_BACK, '11'],
                            [Blockly.Msg.MIC_SENSOR_IR_CONTROLLER_PLAY_PAUSE, '12'],
                            [Blockly.Msg.MIC_SENSOR_IR_CONTROLLER_VOLUME_ADD, '13'],
                            [Blockly.Msg.MIC_SENSOR_IR_CONTROLLER_VOLUME_MINUS, '14'],
                            [Blockly.Msg.MIC_SENSOR_IR_CONTROLLER_MUTE, '15']
                        ]
                    }, {
                        "type": "field_dropdown",
                        "name": "STATE",
                        "options": [
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_PRESSED, '0'],
                            [Blockly.Msg.MIC_SENSOR_JOYSTICK_RELEASED, '3']
                        ]
                    }
                ]
            });
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['micSensor_ir_receive'] = {
        init: function () {
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output)
                .appendField(Blockly.Msg.MIC_SENSOR_IR_RECEIVE);
            this.setOutput(true);
            this.setInputsInline(true);
            this.setColour(Blockly.Blocks.io.HUE);
            this.setTooltip(Blockly.Msg.ARD_PULSE_TIP);
            this.setHelpUrl('https://www.arduino.cc/en/Reference/PulseIn');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };
}
export default LoadMicSensorBlocks;