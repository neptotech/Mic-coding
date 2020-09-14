goog.provide('Blockly.Blocks.action');
goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadActionBlocks = () => {

    Blockly.Blocks['action_motorplus_speed'] = {
        init: function() {
            this.jsonInit({
                "message0": Blockly.Msg.ACTION_MOTORPLUS_SPEED,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "motorpin",
                        "options": [
                            [Blockly.Msg.LEFT, '1'],
                            [Blockly.Msg.RIGHT, '2']
                        ]
                    },
                    {
                        "type": "input_value",
                        "name": "speed"
                    }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Msg.ActionHUE
            });
        }
    }

    Blockly.Blocks['action_motorplus_brake'] = {
        init: function() {
            this.jsonInit({
                "message0": Blockly.Msg.ACTION_MOTORPLUS_BRAKE,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "motorpin",
                        "options": [
                            [Blockly.Msg.LEFT, '1'],
                            [Blockly.Msg.RIGHT, '2']
                        ]
                    }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Msg.ActionHUE
            });
        }
    }

    Blockly.Blocks['action_servo'] = {
        init: function() {
            this.jsonInit({
                "message0": Blockly.Msg.ACTION_SERVO,
                "args0": [
                   {
                       "type": "input_value",
                       "name": "port"
                   },
                   {
                        "type": "input_value",
                        "name": "angle"
                   },
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Msg.ActionHUE
            });
        }
    }

    Blockly.Blocks['action_servo_rotate'] = {
        init: function() {
            this.jsonInit({
                "message0": Blockly.Msg.ACTION_SERVO_ROTATE,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "port"
                    },
                    {
                         "type": "input_value",
                         "name": "angle_begin"
                    },
                    {
                        "type": "input_value",
                        "name": "angle_end"
                    },
                    {
                        "type": "input_value",
                        "name": "duration"
                    },
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Msg.ActionHUE
            });
        }
    }

    Blockly.Blocks['action_servo_drop_digital'] = {
        init: function() {
            const drapList = [
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9'],
                ['10', '10'],
                ['11', '11'],
                ['12', '12'],
                ['13', '13'],
                ['A0', 'A0'],
                ['A1', 'A1'],
                ['A2', 'A2'],
                ['A3', 'A3']
             ];
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(drapList), 'port');
            this.setOutput(true, "String");
            this.setColour(Blockly.Msg.ActionHUE);
        },
        getBlockType: function() {
            return Blockly.Types.NUMBER;
        }
    }



}

export default LoadActionBlocks;