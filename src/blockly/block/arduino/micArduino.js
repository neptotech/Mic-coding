goog.provide('Blockly.Blocks.action');
goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadMicArduinoBlocks = () => {
    Blockly.Blocks['micArduino_digital_write'] = {
        /**
         * Block for creating a 'set pin' to a state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output)
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_WRITE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_WRITE_FOR)
                .appendField(
                    new Blockly.FieldDropdown([
                        ['High', '1'],
                        ['Low', '0']
                    ]),
                    'STATE');
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_DIGITALWRITE_TIP);
        }
    };

    Blockly.Blocks['micArduino_dropdown_digital'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
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
            this.setOutput(true, "Number");
            this.setColour(Blockly.Msg.MicArduinoHUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_highlow'] = {
        /**
         * Block for creating a pin state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendDummyInput()
                .appendField(
                    new Blockly.FieldDropdown([
                        ['High', '1'],
                        ['Low', '0']
                    ]),
                    'STATE');
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['micArduino_digital_read'] = {
        init: function () {
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output)
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_READ);
            this.setOutput(true);
            this.setInputsInline(true);
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.setTooltip(Blockly.Msg.ARD_PULSE_TIP);
            this.setHelpUrl('https://www.arduino.cc/en/Reference/PulseIn');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_analog_read'] = {
        init: function () {
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output)
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_READ_BOOLEAN);
            this.setOutput(true);
            this.setInputsInline(true);
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.setTooltip(Blockly.Msg.ARD_PULSE_TIP);
            this.setHelpUrl('https://www.arduino.cc/en/Reference/PulseIn');
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_read_boolean'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
            const drapList = [
                ['A0', 'A0'],
                ['A1', 'A1'],
                ['A2', 'A2'],
                ['A3', 'A3'],
                ['A6', 'A6'],
                ['A7', 'A7']
            ];
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(drapList), 'port');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Msg.MicArduinoHUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_string_convert'] = {
        /**
       * Block for creating a list with any number of elements of any type.
       * @this Blockly.Block
       */
        init: function () {
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.itemCount_ = 1;
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_READ_STRING);
            this.updateShape_();
            this.setOutput(true, 'String');
            const drapList = [
                ['Int', 'Int'],
                ['Float', 'Float']
            ];
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_READ_STRING_TO)
                .appendField(new Blockly.FieldDropdown(drapList), 'port');
            // this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
            this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
        },
        /**
         * Create XML to represent number of array inputs.
         * @return {!Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function () {
            var container = document.createElement('mutation');
            container.setAttribute('items', this.itemCount_);
            return container;
        },
        /**
         * Parse XML to restore the array inputs.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function (xmlElement) {
            this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
            this.updateShape_();
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function (workspace) {
            var containerBlock = workspace.newBlock('lists_create_with_container');
            containerBlock.initSvg();
            var connection = containerBlock.getInput('STACK').connection;
            for (var i = 0; i < this.itemCount_; i++) {
                var itemBlock = workspace.newBlock('lists_create_with_item');
                itemBlock.initSvg();
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function (containerBlock) {
            var itemBlock = containerBlock.getInputTargetBlock('STACK');
            // Count number of inputs.
            var connections = [];
            while (itemBlock) {
                connections.push(itemBlock.valueConnection_);
                itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
            }
            // Disconnect any children that don't belong.
            for (var i = 0; i < this.itemCount_; i++) {
                var connection = this.getInput('ADD' + i).connection.targetConnection;
                if (connection && connections.indexOf(connection) == -1) {
                    connection.disconnect();
                }
            }
            this.itemCount_ = connections.length;
            this.updateShape_();
            // Reconnect any child blocks.
            for (var i = 0; i < this.itemCount_; i++) {
                Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
            }
        },
        /**
         * Store pointers to any connected child blocks.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        saveConnections: function (containerBlock) {
            var itemBlock = containerBlock.getInputTargetBlock('STACK');
            var i = 0;
            while (itemBlock) {
                var input = this.getInput('ADD' + i);
                itemBlock.valueConnection_ = input && input.connection.targetConnection;
                i++;
                itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
            }
        },
        /**
         * Modify this block to have the correct number of inputs.
         * @private
         * @this Blockly.Block
         */
        updateShape_: function () {
            if (this.itemCount_ && this.getInput('EMPTY')) {
                this.removeInput('EMPTY');
            } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
                this.appendDummyInput('EMPTY')
                    .appendField(this.newQuote_(true))
                    .appendField(this.newQuote_(false));
            }
            // Add new inputs.
            for (var i = 0; i < this.itemCount_; i++) {
                if (!this.getInput('ADD' + i)) {
                    var input = this.appendValueInput('ADD' + i);
                    // .setCheck(Blockly.Types.TEXT.checkList);
                    // if (i == 0) {
                    //     input.appendField(Blockly.Msg.MIC_MATH_CHARAT_LENGTH);
                    // }
                }
            }
            // Remove deleted inputs.
            while (this.getInput('ADD' + i)) {
                this.removeInput('ADD' + i);
                i++;
            }
        },

        getBlockType: function () {
            return Blockly.Types.ARRAY;
        }
    };

    Blockly.Blocks['micArduino_string_convert_boolean'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
            const drapList = [
                ['Int', 'Int'],
                ['Float', 'Float']
            ];
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(drapList), 'port');
            this.setOutput(true, "Number");
            this.setColour(Blockly.Msg.MicArduinoHUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_number_convert'] = {
        /**
         * Block for random integer between [X] and [Y].
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MIC_ARDUINO_NUMBER_CONVERT,
                "args0": [{
                    "type": "input_value",
                    "name": "SEED",
                    "check": Blockly.Types.NUMBER.checkList
                },
                ],
                "inputsInline": true,
                "output": Blockly.Types.NUMBER.output,
                "colour": Blockly.Msg.MicArduinoHUE,
            });
        },
        /** @return {!string} Type of the block, by definition always an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_millis'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_MILLIS);
            this.setOutput(true, "Number");
            this.setColour(Blockly.Msg.MicArduinoHUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_serial_readString'] = {
        /**
         * Block for creating a digtial pin selector.
         * @this Blockly.Block
         */
        init: function () {
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_SERIAL_READSTRING);
            this.setOutput(true, "Number");
            this.setColour(Blockly.Msg.MicArduinoHUE);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_map'] = {
        /**
         * Block for random integer between [X] and [Y].
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MIC_ARDUINO_MAP,
                "args0": [{
                    "type": "input_value",
                    "name": "NUM0",
                    "check": Blockly.Types.NUMBER.checkList
                },
                {
                    "type": "input_value",
                    "name": "NUM1",
                    "check": Blockly.Types.NUMBER.checkList
                }, {
                    "type": "input_value",
                    "name": "NUM2",
                    "check": Blockly.Types.NUMBER.checkList
                }, {
                    "type": "input_value",
                    "name": "NUM3",
                    "check": Blockly.Types.NUMBER.checkList
                }, {
                    "type": "input_value",
                    "name": "NUM4",
                    "check": Blockly.Types.NUMBER.checkList
                }
                ],
                "inputsInline": true,
                "output": Blockly.Types.NUMBER.output,
                "colour": Blockly.Msg.MicArduinoHUE,
                "tooltip": Blockly.Msg.MATH_RANDOM_INT_TOOLTIP,
                "helpUrl": Blockly.Msg.MATH_RANDOM_INT_HELPURL
            });
        },
        /** @return {!string} Type of the block, by definition always an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_constrain'] = {
        /**
         * Block for random integer between [X] and [Y].
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MIC_ARDUINO_CONSTRAIN,
                "args0": [{
                    "type": "input_value",
                    "name": "NUM0",
                    "check": Blockly.Types.NUMBER.checkList
                },
                {
                    "type": "input_value",
                    "name": "NUM1",
                    "check": Blockly.Types.NUMBER.checkList
                }, {
                    "type": "input_value",
                    "name": "NUM2",
                    "check": Blockly.Types.NUMBER.checkList
                }
                ],
                "inputsInline": true,
                "output": Blockly.Types.NUMBER.output,
                "colour": Blockly.Msg.MicArduinoHUE,
                "tooltip": Blockly.Msg.MATH_RANDOM_INT_TOOLTIP,
                "helpUrl": Blockly.Msg.MATH_RANDOM_INT_HELPURL
            });
        },
        /** @return {!string} Type of the block, by definition always an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micArduino_digital_read_boolean'] = {
        /**
         * Block for creating a pin state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_READ_BOOLEAN_INPUT);
            this.appendValueInput('PIN')
                .setCheck(Blockly.Types.NUMBER.output);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_WRITE_FOR)
                .appendField(
                    new Blockly.FieldDropdown([
                        ['High', '1'],
                        ['Low', '0']
                    ]),
                    'STATE');
            this.appendDummyInput().appendField('?');
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['micArduino_pwm_write'] = {
        /**
         * Block for creating a 'set pin' to an analogue value.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendValueInput('PWM0')
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_PWM)
                .setCheck(Blockly.Types.NUMBER.output);
            this.appendValueInput('PWM1')
                .appendField('PWM')
                .setCheck(Blockly.Types.NUMBER.output);
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_ANALOGWRITE_TIP);
        },
        /** @return {!string} The type of input value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        },
    };

    Blockly.Blocks['micArduino_variable_type'] = {
        /**
         * Block for creating a 'set pin' to a state.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_VARIABLE)
                .appendField(new Blockly.FieldVariable(
                    Blockly.Msg.TEXT_APPEND_VARIABLE), 'VAR');
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_DIGITAL_TYPE)
                .appendField(
                    new Blockly.FieldDropdown([
                        ['Boolean', 'boolean'],
                        ['Integer', 'int'],
                        ['Unsigned int8', 'uint8_t'],
                        ['Unsigned int16', 'uint16_t'],
                        ['Long int', 'long'],
                        ['Float', 'float'],
                        ['Char', 'char'],
                        ['String', 'String']
                    ]),
                    'TYPE');
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_DIGITALWRITE_TIP);
        },
        getVarType: function (varName) {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        },
        getBlockType: function () {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        }
    };

    Blockly.Blocks['micArduino_for_each'] = {
        /**
         * Block for 'do while/until' loop.
         * @this Blockly.Block
         */
        init: function () {
            var OPERATORS = [
                ['my variable', 'my_variable']
            ];
            this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_FOR_MADE)
                .appendField(new Blockly.FieldVariable(
                    Blockly.Msg.TEXT_APPEND_VARIABLE), 'VAR');
            this.jsonInit({
                "message0": Blockly.Msg.MIC_ARDUINO_FOR_EACH,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "NUM0",
                        "check": Blockly.Types.NUMBER.checkList
                    },
                    {
                        "type": "input_value",
                        "name": "NUM1",
                        "check": Blockly.Types.NUMBER.checkList
                    }, {
                        "type": "input_value",
                        "name": "NUM2",
                        "check": Blockly.Types.NUMBER.checkList
                    }
                ]
            });
            this.appendStatementInput('DO');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        },
        getVarType: function (varName) {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        },
        getBlockType: function () {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        }
    };

    Blockly.Blocks['micArduino_interval_doing'] = {
        /**
         * Block for 'do while/until' loop.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_INTERVAL_DOING_NAME)
                .appendField(new Blockly.FieldVariable(
                    Blockly.Msg.TEXT_APPEND_VARIABLE), 'VAR');
            this.jsonInit({
                "message0": Blockly.Msg.MIC_ARDUINO_INTERVAL_DOING,
                "args0": [
                    {
                        "type": "input_value",
                        "name": "NUM0",
                        "check": Blockly.Types.NUMBER.checkList
                    }
                ]
            });
            this.appendStatementInput('DO');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        },
        getVarType: function (varName) {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        },
        getBlockType: function () {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        }
    };

    Blockly.Blocks['micArduino_serial_baud'] = {
        /**
         * Block for 'do while/until' loop.
         * @this Blockly.Block
         */
        init: function () {
            var OPERATORS = [
                ['1200', '1200'],
                ['2400', '2400'],
                ['4800', '4800'],
                ['9600', '9600'],
                ['19200', '19200'],
                ['38400', '38400'],
                ['57600', '57600'],
                ['115200', '115200']
            ];
            this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.jsonInit({
                "message0": Blockly.Msg.MIC_ARDUINO_SERIAL_BAUD,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "MODE",
                        "options": OPERATORS
                    }
                ]
            });
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        }
    };

    Blockly.Blocks['micArduino_serial_print'] = {
        /**
         * Block for 'do while/until' loop.
         * @this Blockly.Block
         */
        init: function () {
            var OPERATORS = [
                [Blockly.Msg.MIC_ARDUINO_SERIAL_PRINT_OP0, '0'],
                [Blockly.Msg.MIC_ARDUINO_SERIAL_PRINT_OP1, '1']
            ];
            this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
            this.setColour(Blockly.Msg.MicArduinoHUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_ARDUINO_SERIAL_PRINT_TEXT);
            this.appendValueInput('TEXT');
            this.jsonInit({
                "message0": Blockly.Msg.MIC_ARDUINO_SERIAL_PRINT,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "MODE",
                        "options": OPERATORS
                    }
                ]
            });
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        }
    };
}
export default LoadMicArduinoBlocks;