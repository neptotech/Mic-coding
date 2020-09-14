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
 * @fileoverview Event blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.event');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

const LoadEventBlocks = () => {
    Blockly.HSV_SATURATION = 0.7;
    Blockly.HSV_VALUE = 0.9;

    Blockly.Blocks['event_whendeviceopen'] = {
        init: function () {
            this.jsonInit({
                "message0": Blockly.Msg.EVENT_WHENDEVICEOPEN_INITIALIZE,
                "previousStatement": null,
                "nextStatement": null,
                "colour": Blockly.Msg.EventHUE,
                "tooltip": Blockly.Msg.CONTROLS_REPEAT_TOOLTIP,
                "helpUrl": Blockly.Msg.CONTROLS_REPEAT_HELPURL
            });
            this.appendStatementInput('DO0')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
            this.appendStatementInput('ELSE')
                .appendField(Blockly.Msg.EVENT_WHENDEVICEOPEN_REPEATDO);
        }
    };
}

export default LoadEventBlocks;
