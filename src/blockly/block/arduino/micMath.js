/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Math blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.math');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadMathBlocks = () => {
    Blockly.Blocks['micMath_random_int'] = {
        /**
         * Block for random integer between [X] and [Y].
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MATH_RANDOM_INT_TITLE,
                "args0": [{
                    "type": "input_value",
                    "name": "FROM",
                    "check": Blockly.Types.NUMBER.checkList
                },
                {
                    "type": "input_value",
                    "name": "TO",
                    "check": Blockly.Types.NUMBER.checkList
                }
                ],
                "inputsInline": true,
                "output": Blockly.Types.NUMBER.output,
                "colour": Blockly.Msg.MathHUE,
                "tooltip": Blockly.Msg.MATH_RANDOM_INT_TOOLTIP,
                "helpUrl": Blockly.Msg.MATH_RANDOM_INT_HELPURL
            });
        },
        /** @return {!string} Type of the block, by definition always an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micMath_and'] = {
        /**
         * Block for logical operations: 'and', 'or'.
         * @this Blockly.Block
         */
        init: function () {
            var OPERATORS = [
                [Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
                [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']
            ];
            this.setHelpUrl(Blockly.Msg.LOGIC_OPERATION_HELPURL);
            this.setColour(Blockly.Msg.MathHUE);
            this.setOutput(true, "Boolean");
            this.appendValueInput('A')
                .setCheck(Blockly.Types.BOOLEAN.checkList);
            this.appendValueInput('B')
                .setCheck(Blockly.Types.BOOLEAN.checkList)
                .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
            this.setInputsInline(true);
            // Assign 'this' to a variable for use in the tooltip closure below.
            var thisBlock = this;
            this.setTooltip(function () {
                var op = thisBlock.getFieldValue('OP');
                var TOOLTIPS = {
                    'AND': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND,
                    'OR': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR
                };
                return TOOLTIPS[op];
            });
        },
        /** Assigns a block type, logic comparison operations result in bools. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    Blockly.Blocks['micMath_not'] = {
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
            this.setColour(Blockly.Msg.MathHUE);
            this.appendValueInput('MICMATH0')
                .setCheck(Blockly.Types.BOOLEAN.checkList);
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_MATH_NOT);
            this.setOutput(true, "Boolean");
            this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP);
        },
        /** @return {!string} The type of return value for the block, an integer. */
        getBlockType: function () {
            return Blockly.Types.BOOLEAN;
        }
    };

    // Blockly.Blocks['micMath_join'] = {
    //     /**
    //      * Block for appending to a variable in place.
    //      * @this Blockly.Block
    //      */
    //     init: function () {
    //         this.setHelpUrl(Blockly.Msg.TEXT_APPEND_HELPURL);
    //         this.setColour(Blockly.Msg.TextsHUE);
    //         this.appendValueInput('TEXT0')
    //             .appendField(Blockly.Msg.MIC_MATH_CONNECT);
    //         this.appendValueInput('TEXT1')
    //             .appendField(Blockly.Msg.MIC_MATH_AND);
    //         this.setPreviousStatement(true);
    //         this.setNextStatement(true);
    //         // Assign 'this' to a variable for use in the tooltip closure below.
    //         var thisBlock = this;
    //         this.setTooltip(function () {
    //             return Blockly.Msg.TEXT_APPEND_TOOLTIP.replace('%1',
    //                 thisBlock.getFieldValue('VAR'));
    //         });
    //     },
    //     /**
    //      * Set's the type of the variable selected in the drop down list. As there is
    //      * only one possible option, the variable input is not really checked.
    //      * @param {!string} varName Name of the variable to check type.
    //      * @return {string} String to indicate the variable type.
    //      */
    //     getVarType: function (varName) {
    //         return Blockly.Types.TEXT;
    //     }
    // };

    Blockly.Blocks['micMath_join'] = {
        /**
       * Block for creating a list with any number of elements of any type.
       * @this Blockly.Block
       */
        init: function () {
            this.setColour(Blockly.Msg.MathHUE);
            this.itemCount_ = 2;
            this.updateShape_();
            this.setOutput(true, 'String');
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
                    if (i == 0) {
                        input.appendField(Blockly.Msg.MIC_MATH_CONNECT);
                    } else if (i == 1) {
                        input.appendField(Blockly.Msg.MIC_MATH_AND);
                    }
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

    // Blockly.Blocks['micMath_charAt'] = {
    //     init: function () {
    //         this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    //         this.setColour(Blockly.Msg.TextsHUE);
    //         this.appendDummyInput()
    //             // .appendField(this.newQuote_(true))
    //             .appendField(new Blockly.FieldTextInput(''), 'TEXT')
    //         // .appendField(this.newQuote_(false));
    //         this.setOutput(true, "String");
    //         // Assign 'this' to a variable for use in the tooltip closure below.
    //         var thisBlock = this;
    //         // Text block is trivial.  Use tooltip of parent block if it exists.
    //         this.setTooltip(function () {
    //             var parent = thisBlock.getParent();
    //             return (parent && parent.getInputsInline() && parent.tooltip) ||
    //                 Blockly.Msg.TEXT_TEXT_TOOLTIP;
    //         });
    //     },
    // };

    Blockly.Blocks['micMath_charAt'] = {
        /**
       * Block for creating a list with any number of elements of any type.
       * @this Blockly.Block
       */
        init: function () {
            this.setColour(Blockly.Msg.MathHUE);
            this.itemCount_ = 2;
            this.updateShape_();
            this.setOutput(true, 'String');
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_MATH_CHARAT_INDEX);;
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
                    if (i == 1) {
                        input.appendField(Blockly.Msg.MIC_MATH_CHARAT);
                    }
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

    Blockly.Blocks['micMath_charLength'] = {
        /**
       * Block for creating a list with any number of elements of any type.
       * @this Blockly.Block
       */
        init: function () {
            this.setColour(Blockly.Msg.MathHUE);
            this.itemCount_ = 1;
            this.updateShape_();
            this.setOutput(true, 'String');
            this.appendDummyInput()
                .appendField(Blockly.Msg.MIC_MATH_CHARAT_LENGTH);
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

    Blockly.Blocks['micMath_contains'] = {
        /**
       * Block for creating a list with any number of elements of any type.
       * @this Blockly.Block
       */
        init: function () {
            this.setColour(Blockly.Msg.MathHUE);
            this.itemCount_ = 2;
            this.updateShape_();
            this.setOutput(true, 'Boolean');
            this.appendDummyInput()
                .appendField('？');
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
                    if (i == 1) {
                        input.appendField(Blockly.Msg.MIC_MATH_CHARAT_CONTAINS);
                    }
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

    Blockly.Blocks['micMath_remainder'] = {
        /**
         * Block for random integer between [X] and [Y].
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MIC_MATH_REMAINDER,
                "args0": [{
                    "type": "input_value",
                    "name": "DIVISOR",
                    "check": Blockly.Types.NUMBER.checkList
                },
                {
                    "type": "input_value",
                    "name": "DIVIDEND",
                    "check": Blockly.Types.NUMBER.checkList
                }
                ],
                "inputsInline": true,
                "output": Blockly.Types.NUMBER.output,
                "colour": Blockly.Msg.MathHUE,
                "tooltip": Blockly.Msg.MATH_RANDOM_INT_TOOLTIP,
                "helpUrl": Blockly.Msg.MATH_RANDOM_INT_HELPURL
            });
        },
        /** @return {!string} Type of the block, by definition always an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['micMath_single'] = {
        /**
         * Block for trigonometry operators.
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": "%1 %2",
                "args0": [{
                    "type": "field_dropdown",
                    "name": "OP",
                    "options": [
                        [Blockly.Msg.MIC_MATH_ABS, 'ABS'],
                        [Blockly.Msg.MIC_MATH_FLOOR, 'FLOOR'],
                        [Blockly.Msg.MIC_MATH_CEIL, 'CEIL'],
                        [Blockly.Msg.MIC_MATH_SQRT, 'SQRT'],
                        [Blockly.Msg.MATH_TRIG_SIN, 'SIN'],
                        [Blockly.Msg.MATH_TRIG_COS, 'COS'],
                        [Blockly.Msg.MATH_TRIG_TAN, 'TAN'],
                        [Blockly.Msg.MATH_TRIG_ASIN, 'ASIN'],
                        [Blockly.Msg.MATH_TRIG_ACOS, 'ACOS'],
                        [Blockly.Msg.MATH_TRIG_ATAN, 'ATAN'],
                        [Blockly.Msg.MIC_MATH_LOG, 'LOG'],
                        [Blockly.Msg.MIC_MATH_LOG10, 'LOG10']
                    ]
                },
                {
                    "type": "input_value",
                    "name": "NUM",
                    "check": Blockly.Types.DECIMAL.checkList
                }
                ],
                "output": Blockly.Types.DECIMAL.output,
                "colour": Blockly.Msg.MathHUE,
                "helpUrl": Blockly.Msg.MATH_TRIG_HELPURL
            });
            // Assign 'this' to a variable for use in the tooltip closure below.
            var thisBlock = this;
            this.setTooltip(function () {
                var mode = thisBlock.getFieldValue('OP');
                var TOOLTIPS = {
                    'SIN': Blockly.Msg.MATH_TRIG_TOOLTIP_SIN,
                    'COS': Blockly.Msg.MATH_TRIG_TOOLTIP_COS,
                    'TAN': Blockly.Msg.MATH_TRIG_TOOLTIP_TAN,
                    'ASIN': Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN,
                    'ACOS': Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS,
                    'ATAN': Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN
                };
                return TOOLTIPS[mode];
            });
        },
        /** @return {!string} Type of the block, all these operations are floats. */
        getBlockType: function () {
            return Blockly.Types.DECIMAL;
        }
    };
}
export default LoadMathBlocks;