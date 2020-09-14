'use strict';

goog.provide('Blockly.FieldColorpicker');

goog.require('Blockly.Events.BlockChange');
goog.require('Blockly.Gesture');
goog.require('Blockly.Field');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.userAgent');

import React from 'react'
import ReactDOM from 'react-dom'
import './index.less'
import DotColor from "../DotColor";

class FieldColorpicker extends Blockly.Field {
    onChange = (colours_) => {
        this.setValue(colours_);
    }
    onClose = () => {
        document.body.removeChild(document.querySelector(`.${this.editWp}`));
    }

    constructor() {
        super();
        this.colours_ = new Array(64).fill('#000000');
        this.cardSize = 40;
        this.tableArray = [...new Array(8)];
        this.editWp = 'widget-wrapper';
    }

    init() {
        super.init()
        const blockComponent =
            <g className={`FieldColorPicker`}>
                <foreignObject x={0} y={0} width={this.cardSize} height={this.cardSize}>
                    <table className={`table`}>
                        <tbody>
                            {this.tableArray.map((v, i) =>
                                <tr key={`tr${i}`}>
                                    {this.tableArray.map((vv, ii) => <td key={`td${ii}`} />)}
                                </tr>)}
                        </tbody>
                    </table>
                </foreignObject>
            </g>

        ReactDOM.render(blockComponent, this.fieldGroup_);
        this.size_.width = this.cardSize;
        this.size_.height = this.cardSize;
        if (this.getValue() === undefined) {
            this.setValue(this.colours_);
        } else {
            this.setValue(this.getValue());
        }
    }

    showEditor_() {
        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = this.editWp;
        document.body.append(widgetWrapper);

        const { x, y } = goog.style.getPageOffset(this.getClickTarget_());
        const defaultFill = '#00FF00';
        const dotColor = '#b8b8b8';
        ReactDOM.render(
            <DotColor allowChoseColor={false} absolute={{ x, y: y + 35 }} defaultFill={defaultFill} dotColor={dotColor} hidden={false}
                onClose={this.onClose} onChange={this.onChange} value={this.colours_} />,
            widgetWrapper
        );
    }

    setValue(newValue) {
        if (newValue === null || newValue === undefined) {
            return; // No change if null.
        }

        const temp = newValue.toString().replace(/,/g, '');
        if (this.sourceBlock_) { // && Blockly.Events.isEnabled()) {
            Blockly.Events.fire(new Blockly.Events.BlockChange(
                this.sourceBlock_, 'field', this.name, this.value_, temp));
        }
        this.value_ = temp;
        let coloursArray = [];
        if (typeof this.value_ === 'string') {
            for (let i = 0; i < this.value_.length; i++) {
                if (i % 7 === 0) {
                    coloursArray.push(this.value_.slice(i, i + 7));
                }
            }
        } else {
            coloursArray = this.value_;
        }
        this.colours_ = coloursArray;
        if (this.fieldGroup_) {
            const table = this.fieldGroup_.querySelector('table');
            if (table) {
                for (let rowNum = 0; rowNum < 8; rowNum++) {
                    const tr = table.querySelectorAll('tr').item(rowNum);
                    for (let columnNum = 0; columnNum < 8; columnNum++) {
                        const td = tr.querySelectorAll('td').item(columnNum);
                        const color = this.colours_[8 * rowNum + columnNum];
                        td.setAttribute('style', `background:${color === '#000000' ? '#b8b8b8' : color}`);
                    }
                }
            }
        }
    }

    getValue() {
        return this.value_;
    }
}

FieldColorpicker.fromJson = function (options) {
    return new FieldColorpicker(options);
}

export default FieldColorpicker;
