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
 * @fileoverview List blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.lists');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadListsBlocks = () => {
    /**
     * Common HSV hue for all blocks in this category.
     */
    Blockly.Blocks.lists.HUE = '#15bfa0';

    //modified
    Blockly.Blocks['lists_create_with'] = {
        /**
         * Block for creating a list with any number of elements of any type.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
            this.setColour(Blockly.Blocks.lists.HUE);
            this.itemCount_ = 3;
            this.updateShape_();
            this.setOutput(true, 'Array');
            this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
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
                    var input = this.appendValueInput('ADD' + i)
                        .setCheck(Blockly.Types.NUMBER.checkList);
                    if (i == 0) {
                        input.appendField(Blockly.Msg.LISTS_INT_CREATE_WITH_INPUT_WITH);
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


    Blockly.Blocks['lists_create_with2'] = {
        /**
         * Block for creating a list with any number of elements of any type.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
            this.setColour(Blockly.Blocks.lists.HUE);
            this.itemCount_ = 2;
            this.updateShape_();
            this.setOutput(true, 'String');
            this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
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
                        input.appendField(Blockly.Msg.LISTS_STRING_CREATE_WITH_INPUT_WITH);
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


    Blockly.Blocks['lists_create_with_container'] = {
        /**
         * Mutator block for list container.
         * @this Blockly.Block
         */
        init: function () {
            this.setColour(Blockly.Blocks.lists.HUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD);
            this.appendStatementInput('STACK');
            this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
            this.contextMenu = false;
        }
    };

    Blockly.Blocks['lists_create_with_item'] = {
        /**
         * Mutator bolck for adding items.
         * @this Blockly.Block
         */
        init: function () {
            this.setColour(Blockly.Blocks.lists.HUE);
            this.appendDummyInput()
                .appendField(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
            this.contextMenu = false;
        }
    };

    Blockly.Blocks['lists_length'] = {
        /**
         * Block for list length.
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.LISTS_THE_LENGTH_OF,
                "args0": [{
                    "type": "input_value",
                    "name": "VAR",

                }],
                "output": "Number",
                "colour": Blockly.Blocks.lists.HUE,
                "tooltip": Blockly.Msg.LISTS_LENGTH_TOOLTIP,
                "helpUrl": Blockly.Msg.LISTS_LENGTH_HELPURL
            });
        },
        /** @return {!string} Type of the block, text length always an integer. */
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['lists_getIndex'] = {

        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.LISTS_GETINDEX,
                "args0": [{
                    "type": "input_value",
                    "name": "VAR",
                    "check": "Array"
                },
                {
                    "type": "input_value",
                    "name": "AT",
                    "check": "Number"
                }
                ],
                "output": null,
                "colour": Blockly.Blocks.lists.HUE,
                "inputsInline": true,
                "tooltip": Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM_START
            });
        },
        getVarType: function (varName) {
            return Blockly.Types.NUNBER;
        },
        getBlockType: function () {
            return Blockly.Types.NUMBER;
        }
    };

    Blockly.Blocks['lists_setIndex'] = {
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.LISTS_SETINDEX,
                "args0": [{
                    "type": "input_value",
                    "name": "VAR"
                },
                {
                    "type": "input_value",
                    "name": "AT",
                    "check": "Number"
                },
                {
                    "type": "input_value",
                    "name": "TO",
                    "check": ["Number", "String"]
                }
                ],
                "colour": Blockly.Blocks.lists.HUE,
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "tooltip": Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM_START
                //"helpUrl": Blockly.Msg.LISTS_LENGTH_HELPURL
            });
        }
    };

    Blockly.Blocks['lists_variable_get'] = {
        /**
         * Block for Array variable getter.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
            //this.setColour(Blockly.Blocks.variables.HUE);
            this.appendDummyInput()
                .appendField(new Blockly.FieldVariable(
                    Blockly.Msg.VARIABLES_DEFAULT_NAME), 'VAR');
            this.setOutput(true);
            this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
            this.setColour(30);
            this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
        },
        contextMenuType_: 'lists_variables_set',
        /**
         * Add menu option to create getter/setter block for this setter/getter.
         * @param {!Array} options List of menu options to add to.
         * @this Blockly.Block
         */
        customContextMenu: function (options) {
            var option = { enabled: true };
            var name = this.getFieldValue('VAR');
            option.text = this.contextMenuMsg_.replace('%1', name);
            var xmlField = goog.dom.createDom('field', null, name);
            xmlField.setAttribute('name', 'VAR');
            var xmlBlock = goog.dom.createDom('block', null, xmlField);
            xmlBlock.setAttribute('type', this.contextMenuType_);
            option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
            options.push(option);
        },
        /**
         * @return {!string} Retrieves the type (stored in varType) of this block.
         * @this Blockly.Block
         */
        getBlockType: function () {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        },
        /**
         * Gets the stored type of the variable indicated in the argument. As only one
         * variable is stored in this block, no need to check input
         * @this Blockly.
         * @param {!string} varName Name of this block variable to check type.
         * @return {!string} String to indicate the type of this block.
         */
        getVarType: function (varName) {
            return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
        },
    };

    Blockly.Blocks['lists_variable_set'] = {
        /**
         * Block for Array variable setter.
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.VARIABLES_SET,
                "args0": [{
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": Blockly.Msg.VARIABLES_DEFAULT_NAME
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Array"
                }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Blocks.lists.HUE,
                "tooltip": Blockly.Msg.VARIABLES_SET_TOOLTIP,
                "helpUrl": Blockly.Msg.VARIABLES_SET_HELPURL
            });
            this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        },
        contextMenuType_: 'lists_variable_get',
        customContextMenu: Blockly.Blocks['lists_variable_get'].customContextMenu,
        /**
         * Searches through the nested blocks to find a variable type.
         * @this Blockly.Block
         * @param {!string} varName Name of this block variable to check type.
         * @return {string} String to indicate the type of this block.
         */

        getVarType: function (varName) {
            return Blockly.Types.getChildBlockType(this);
        }
    };

    Blockly.Blocks["array_declare"] = {
        init: function () {
            this.appendDummyInput()
                .appendField(Blockly.Msg.ARRAY_CREATE)
                .appendField(new Blockly.FieldDropdown([
                    [Blockly.Msg.ARRAY_LIST, "d1"],
                    [Blockly.Msg.ARRAY_ARRAY, "d2"]
                ]), "dim")
                .appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
                .appendField(Blockly.Msg.VARIABLES_AS)
                .appendField(new Blockly.FieldDropdown(Blockly.Types.getValidTypeArray()), "type");
            this.appendValueInput("contenu")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldDropdown([
                    [Blockly.Msg.ARRAY_TAILLE, "c1"],
                    [Blockly.Msg.ARRAY_CONTIENT, "c2"]
                ]), "choix");
            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(Blockly.Blocks.array.HUE);
            this.setTooltip(Blockly.Msg.ARRAY_GETINDEX_TOOLTIP2);
            this.setHelpUrl(Blockly.Msg.HELPURL);
        }
    };
}

export default LoadListsBlocks;