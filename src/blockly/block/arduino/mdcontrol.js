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

    Blockly.Blocks['control_time_delay'] = {
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

    /**
     * Common HSV hue for all blocks in this category.
     */
    Blockly.Blocks['mdcontrols_repeat_ext'] = {
        /**
         * Block for repeat n times (external number).
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.CONTROLS_REPEAT_TITLE,
                "args0": [{
                    "type": "input_value",
                    "name": "TIMES",
                    "check": Blockly.Types.NUMBER.checkList
                }],
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Msg.MdControlHUE,
                "tooltip": Blockly.Msg.CONTROLS_REPEAT_TOOLTIP,
                "helpUrl": Blockly.Msg.CONTROLS_REPEAT_HELPURL
            });
            this.appendStatementInput('DO')
                .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
        }
    };

    Blockly.Blocks['mdcontrols_repeat_one'] = {
        /**
         * Block for repeat n times (external number).
         * @this Blockly.Block
         */
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.MDCONTROL_REPEAT_ONE + Blockly.Msg.CONTROLS_REPEAT_INPUT_DO,
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Msg.MdControlHUE,
                "tooltip": Blockly.Msg.CONTROLS_REPEAT_TOOLTIP,
                "helpUrl": Blockly.Msg.CONTROLS_REPEAT_HELPURL
            });
            this.appendStatementInput('DO')
        }
    };

    Blockly.Blocks['mdcontrols_if'] = {
        /**
         * Block for if/elseif/else condition.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
            this.setColour(Blockly.Msg.MdControlHUE);
            this.appendValueInput('IF0')
                .setCheck(Blockly.Types.BOOLEAN.checkList)
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
            this.appendStatementInput('DO0')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
            this.setPreviousStatement(true);
            this.appendStatementInput('ELSE')
                .appendField(Blockly.Msg.MDCONTROL_ELSE);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                'controls_if_else'
            ]));
            // Assign 'this' to a variable for use in the tooltip closure below.
            var thisBlock = this;
            this.setTooltip(function () {
                if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
                } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
                } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
                } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
                }
                return '';
            });
            this.elseifCount_ = 0;
            this.elseCount_ = 1;
        },
        /**
         * Create XML to represent the number of else-if and else inputs.
         * @return {Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function () {
            if (!this.elseifCount_ && !this.elseCount_) {
                return null;
            }
            var container = document.createElement('mutation');
            if (this.elseifCount_) {
                container.setAttribute('elseif', this.elseifCount_);
            }
            if (this.elseCount_) {
                container.setAttribute('else', 1);
            }
            return container;
        },
        /**
         * Parse XML to restore the else-if and else inputs.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function (xmlElement) {
            this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
            this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
            this.updateShape_();
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function (workspace) {
            var containerBlock = workspace.newBlock('controls_if_if');
            containerBlock.initSvg();
            var connection = containerBlock.nextConnection;
            for (var i = 1; i <= this.elseifCount_; i++) {
                var elseifBlock = workspace.newBlock('controls_if_elseif');
                elseifBlock.initSvg();
                connection.connect(elseifBlock.previousConnection);
                connection = elseifBlock.nextConnection;
            }
            if (this.elseCount_) {
                var elseBlock = workspace.newBlock('controls_if_else');
                elseBlock.initSvg();
                connection.connect(elseBlock.previousConnection);
            }
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function (containerBlock) {
            var clauseBlock = containerBlock.nextConnection.targetBlock();
            // Count number of inputs.
            this.elseifCount_ = 0;
            this.elseCount_ = 0;
            var valueConnections = [null];
            var statementConnections = [null];
            var elseStatementConnection = null;
            while (clauseBlock) {
                switch (clauseBlock.type) {
                    case 'controls_if_elseif':
                        this.elseifCount_++;
                        valueConnections.push(clauseBlock.valueConnection_);
                        statementConnections.push(clauseBlock.statementConnection_);
                        break;
                    case 'controls_if_else':
                        this.elseCount_++;
                        elseStatementConnection = clauseBlock.statementConnection_;
                        break;
                    default:
                        throw 'Unknown block type.';
                }
                clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
            }
            this.updateShape_();
            // Reconnect any child blocks.
            for (var i = 1; i <= this.elseifCount_; i++) {
                Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
                Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
            }
            Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
        },
        /**
         * Store pointers to any connected child blocks.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        saveConnections: function (containerBlock) {
            var clauseBlock = containerBlock.nextConnection.targetBlock();
            var i = 1;
            while (clauseBlock) {
                switch (clauseBlock.type) {
                    case 'controls_if_elseif':
                        var inputIf = this.getInput('IF' + i);
                        var inputDo = this.getInput('DO' + i);
                        clauseBlock.valueConnection_ =
                            inputIf && inputIf.connection.targetConnection;
                        clauseBlock.statementConnection_ =
                            inputDo && inputDo.connection.targetConnection;
                        i++;
                        break;
                    case 'controls_if_else':
                        var inputDo = this.getInput('ELSE');
                        clauseBlock.statementConnection_ =
                            inputDo && inputDo.connection.targetConnection;
                        break;
                    default:
                        throw 'Unknown block type.';
                }
                clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
            }
        },
        /**
         * Modify this block to have the correct number of inputs.
         * @private
         * @this Blockly.Block
         */
        updateShape_: function () {
            // Delete everything.
            if (this.getInput('ELSE')) {
                this.removeInput('ELSE');
            }
            var i = 1;
            while (this.getInput('IF' + i)) {
                this.removeInput('IF' + i);
                this.removeInput('DO' + i);
                i++;
            }
            // Rebuild block.
            for (var i = 1; i <= this.elseifCount_; i++) {
                this.appendValueInput('IF' + i)
                    .setCheck('Boolean')
                    .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
                this.appendStatementInput('DO' + i)
                    .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
            }
            if (this.elseCount_) {
                this.appendStatementInput('ELSE')
                    .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
            }
        }
    };

    Blockly.Blocks['control_wait'] = {
        /**
         * Chrono.h Setup
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
            this.setColour(Blockly.Msg.MdControlHUE);
            this.appendValueInput('CONTROL_TIME_WAIT')
                .setCheck(Blockly.Types.BOOLEAN.checkList)
                .appendField(Blockly.Msg.ARD_TIME_DELAY);
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP);
        }
    };

    Blockly.Blocks['micControls_if'] = {
        /**
         * Block for if/elseif/else condition.
         * @this Blockly.Block
         */
        init: function () {
            this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
            this.setColour(Blockly.Msg.MdControlHUE);
            this.appendValueInput('IF0')
                .setCheck(Blockly.Types.BOOLEAN.checkList)
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
            this.appendStatementInput('DO0')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                'controls_if_else'
            ]));
            // Assign 'this' to a variable for use in the tooltip closure below.
            var thisBlock = this;
            this.setTooltip(function () {
                if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
                } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
                } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
                } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
                    return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
                }
                return '';
            });
            this.elseifCount_ = 0;
            this.elseCount_ = 0;
        },
        /**
         * Create XML to represent the number of else-if and else inputs.
         * @return {Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function () {
            if (!this.elseifCount_ && !this.elseCount_) {
                return null;
            }
            var container = document.createElement('mutation');
            if (this.elseifCount_) {
                container.setAttribute('elseif', this.elseifCount_);
            }
            if (this.elseCount_) {
                container.setAttribute('else', 1);
            }
            return container;
        },
        /**
         * Parse XML to restore the else-if and else inputs.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function (xmlElement) {
            this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
            this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
            this.updateShape_();
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function (workspace) {
            var containerBlock = workspace.newBlock('controls_if_if');
            containerBlock.initSvg();
            var connection = containerBlock.nextConnection;
            for (var i = 1; i <= this.elseifCount_; i++) {
                var elseifBlock = workspace.newBlock('controls_if_elseif');
                elseifBlock.initSvg();
                connection.connect(elseifBlock.previousConnection);
                connection = elseifBlock.nextConnection;
            }
            if (this.elseCount_) {
                var elseBlock = workspace.newBlock('controls_if_else');
                elseBlock.initSvg();
                connection.connect(elseBlock.previousConnection);
            }
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function (containerBlock) {
            var clauseBlock = containerBlock.nextConnection.targetBlock();
            // Count number of inputs.
            this.elseifCount_ = 0;
            this.elseCount_ = 0;
            var valueConnections = [null];
            var statementConnections = [null];
            var elseStatementConnection = null;
            while (clauseBlock) {
                switch (clauseBlock.type) {
                    case 'controls_if_elseif':
                        this.elseifCount_++;
                        valueConnections.push(clauseBlock.valueConnection_);
                        statementConnections.push(clauseBlock.statementConnection_);
                        break;
                    case 'controls_if_else':
                        this.elseCount_++;
                        elseStatementConnection = clauseBlock.statementConnection_;
                        break;
                    default:
                        throw 'Unknown block type.';
                }
                clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
            }
            this.updateShape_();
            // Reconnect any child blocks.
            for (var i = 1; i <= this.elseifCount_; i++) {
                Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
                Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
            }
            Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
        },
        /**
         * Store pointers to any connected child blocks.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        saveConnections: function (containerBlock) {
            var clauseBlock = containerBlock.nextConnection.targetBlock();
            var i = 1;
            while (clauseBlock) {
                switch (clauseBlock.type) {
                    case 'controls_if_elseif':
                        var inputIf = this.getInput('IF' + i);
                        var inputDo = this.getInput('DO' + i);
                        clauseBlock.valueConnection_ =
                            inputIf && inputIf.connection.targetConnection;
                        clauseBlock.statementConnection_ =
                            inputDo && inputDo.connection.targetConnection;
                        i++;
                        break;
                    case 'controls_if_else':
                        var inputDo = this.getInput('ELSE');
                        clauseBlock.statementConnection_ =
                            inputDo && inputDo.connection.targetConnection;
                        break;
                    default:
                        throw 'Unknown block type.';
                }
                clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
            }
        },
        /**
         * Modify this block to have the correct number of inputs.
         * @private
         * @this Blockly.Block
         */
        updateShape_: function () {
            // Delete everything.
            if (this.getInput('ELSE')) {
                this.removeInput('ELSE');
            }
            var i = 1;
            while (this.getInput('IF' + i)) {
                this.removeInput('IF' + i);
                this.removeInput('DO' + i);
                i++;
            }
            // Rebuild block.
            for (var i = 1; i <= this.elseifCount_; i++) {
                this.appendValueInput('IF' + i)
                    .setCheck('Boolean')
                    .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
                this.appendStatementInput('DO' + i)
                    .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
            }
            if (this.elseCount_) {
                this.appendStatementInput('ELSE')
                    .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
            }
        }
    };

    Blockly.Blocks['control_repeat'] = {
        /**
         * Chrono.h Setup
         * @this Blockly.Block
         */
        init: function () {
            this.setColour(Blockly.Msg.MdControlHUE);
            this.appendValueInput('IF0')
                .setCheck(Blockly.Types.BOOLEAN.checkList)
                .appendField(Blockly.Msg.EVENT_WHENDEVICEOPEN_REPEATDO + Blockly.Msg.CONTROLS_IF_MSG_THEN + Blockly.Msg.MIC_CONTROL_UTIL);
            this.appendStatementInput('DO0');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
        }
    };

}
export default LoadControlBlocks;