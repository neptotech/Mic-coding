/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the Math blocks.
 *
 * TODO: Math on list needs lists to be implemented.
 *       math_constant and math_change needs to be tested in compiler.
 */
'use strict';

goog.provide('Blockly.Arduino.math');

goog.require('Blockly.Arduino');

const LoadMicLiteCodeGenerator = () => {

    const _ = require('lodash');
    function logo(list, elementsPerSubArray) {
        let arr = _.chunk(list, elementsPerSubArray);
        let result = [];
        for(let index of arr) {
            let element = _.chunk(index, 4);
            let resultElement = '';
            for(let minArr of element) {
                let str = '';
                for(let color of minArr) {
                    str = (color === '#000000' ? 0 : 1) + str;
                }
                resultElement = parseInt(str, 2).toString(16) + resultElement;
            }
            result.push(`0x${resultElement}`);
        }
        return result.join(', ');
    }

    /**
     * Generator for a numeric value (X).
     * Arduino code: loop { X }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {array} Completed code with order of operation.
     */
    Blockly.Arduino['micLite_led_color'] = function (block) {
        const _op = block.getFieldValue('OP')
        const _mode = 'mode';
        const _funName = 'setRGBColor';
        const _varName = 'uint8_t';
        Blockly.Arduino.addVariable('micLite_led_color0', `void ${_funName}(${_varName} ${_mode});\n`);
        Blockly.Arduino.addVariable('micLite_led_color1', `void ${_funName}(${_varName} ${_mode}){
    switch(${_mode}) {
        case 0:
            digitalWrite(8, 1);
            digitalWrite(9, 1);
            digitalWrite(10, 1);
        break;
        case 1:
            digitalWrite(8, 0);
            digitalWrite(9, 1);
            digitalWrite(10, 1);
        break;
        case 2:
            digitalWrite(8, 1);
            digitalWrite(9, 1);
            digitalWrite(10, 0);
        break;
        case 3:
            digitalWrite(8, 1);
            digitalWrite(9, 0);
            digitalWrite(10, 1);
        break;
    }
}`);
        Blockly.Arduino.addSetup('micLite_led_color0', `  pinMode(8, OUTPUT);`)
        Blockly.Arduino.addSetup('micLite_led_color1', `  pinMode(9, OUTPUT);`)
        Blockly.Arduino.addSetup('micLite_led_color2', `  pinMode(10, OUTPUT);`)
        Blockly.Arduino.addSetup('micLite_led_color3', `${_funName}(0);`)
        return `${_funName}(${_op});`;
    };

    Blockly.Arduino['display_matrix'] = function (block) {
        let colors = block.getFieldValue('field_matrixColorPicker');
        if (!Array.isArray(colors)) {
            const subStr = /#/g;
            const strList = colors.replace(subStr, ',#').split(',');
            colors = strList.slice(1)
        }
        Blockly.Arduino.addInclude("Microduino_Matrix.h", "#include <Microduino_Matrix.h>\n");
        Blockly.Arduino.addVariable('micLite_clear_screen0', `uint8_t Addr[MatrixPix_X][MatrixPix_Y] = {{48}};`);
        Blockly.Arduino.addVariable('micLite_clear_screen1', `Matrix display = Matrix(Addr, TYPE_S2);`);
        const name = Blockly.Arduino.variableDB_.getDistinctName('logoA', Blockly.VARIABLE_CATEGORY_NAME);
        Blockly.Arduino.addVariable(name, `static const uint8_t ${name}[] PROGMEM = {${logo(colors, 8)}};`);
        Blockly.Arduino.addVariable('micLite_clear_screen2', `uint8_t bitmapCache[8] = {0};`);
        Blockly.Arduino.addVariable('display_matrix1', `void showBMP(const uint8_t *bitmap) {
    if (memcmp(bitmapCache, bitmap, 8) != 0) {
        display.clearDisplay();
        memcpy(bitmapCache, bitmap, 8);
    }
    display.drawBMP(0, 0, 8, 8, bitmap);
}`);

        Blockly.Arduino.addSetup('micLite_clear_screen0', `Wire.begin();`);
        Blockly.Arduino.addSetup('micLite_clear_screen1', `display.setBrightness(255);`);
        Blockly.Arduino.addSetup('display_matrix0', `display.clearDisplay();`);

        return `showBMP(${name});\n`;
    };

    /**
     * Code generator for appending text (Y) to a variable in place (X).
     * String constructor info: http://arduino.cc/en/Reference/StringConstructor
     * Arduino code: loop { X += String(Y) }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {string} Completed code.
     */
    Blockly.Arduino['show_text'] = function (block) {
        Blockly.Arduino.addInclude("Microduino_Matrix.h", "#include <Microduino_Matrix.h>\n");
        Blockly.Arduino.addVariable('show_text0', `uint8_t Addr[MatrixPix_X][MatrixPix_Y] = {{48}};`);
        Blockly.Arduino.addVariable('show_text1', `Matrix display = Matrix(Addr, TYPE_S2);`);
        Blockly.Arduino.addVariable('show_text2', `int coordinate = 8;`);
        Blockly.Arduino.addVariable('show_text3', `unsigned long matrixmove_time;`);
        Blockly.Arduino.addVariable('show_text4', `String strcache;`);
        Blockly.Arduino.addVariable('show_text5', `uint8_t bitmapCache[8] = {0};`);
        Blockly.Arduino.addVariable('show_text6', `void matrixShow(String _str, int _time) {
    memset(bitmapCache, 0, 8);
    int str_len = display.getStringWidth(_str.c_str());
    if (strcache != _str) {
        display.clearDisplay();
        coordinate = 8;
        strcache = _str;
    }
    if (_str.length() == 1) {
        display.setCursor(1, 0);
        display.print(_str);
    } else {
        if (millis() - matrixmove_time > _time) {
            coordinate--;
            if (coordinate < (-str_len - 8)) {
                coordinate = 8;
            }
            matrixmove_time = millis();
        }
        display.setCursor(coordinate, 0);
        display.print(_str);
    }
}`
        );
        Blockly.Arduino.addSetup('show_text0', `  Wire.begin();
    display.setBrightness(255);
    display.clearDisplay();`);
        var argument0 = Blockly.Arduino.valueToCode(block, 'TEXT',
            Blockly.Arduino.ORDER_UNARY_POSTFIX);
        if (argument0 == '') {
            argument0 = '""';
        }
        return `matrixShow(${argument0}, 150);`;
    };

    /**
     * Generator for a numeric value (X).
     * Arduino code: loop { X }
     * @param {!Blockly.Block} block Block to generate the code from.
     * @return {array} Completed code with order of operation.
     */
    Blockly.Arduino['micLite_notes'] = function (block) {
        const _op = block.getFieldValue('OP')
        var delayTime = Blockly.Arduino.valueToCode(block, "DELAY_TIME_SECOND", Blockly.Arduino.ORDER_ATOMIC) || '0';
        const code = `tone(D7, ${_op});\ndelay(${delayTime} * 1000);\nnoTone(D7);`
        return `${code}`;
    };

    Blockly.Arduino['click_button_AB'] = function (block) {
        var code = block.getFieldValue('STATE');
        Blockly.Arduino.addSetup(`click_button_AB${code}`, `  pinMode(${code}, INPUT_PULLUP);`)
        const blockCode = [`!digitalRead(${code})`, Blockly.Arduino.ORDER_ATOMIC]
        return blockCode;
    };

    Blockly.Arduino['touch_robot_port'] = function (block) {
        var code = block.getFieldValue('STATE');
        Blockly.Arduino.addSetup(`touch_robot_port${code}`, `  pinMode(${code}, INPUT_PULLUP);`)
        const blockCode = [`!digitalRead(${code})`, Blockly.Arduino.ORDER_ATOMIC]
        return blockCode;
    };

    Blockly.Arduino['micLite_clear_screen'] = function (block) {
        Blockly.Arduino.addInclude("Microduino_Matrix.h", "#include <Microduino_Matrix.h>\n");
        Blockly.Arduino.addVariable('micLite_clear_screen0', `uint8_t Addr[MatrixPix_X][MatrixPix_Y] = {{48}};`);
        Blockly.Arduino.addVariable('micLite_clear_screen1', `Matrix display = Matrix(Addr, TYPE_S2);`);
        Blockly.Arduino.addVariable('micLite_clear_screen2', `uint8_t bitmapCache[8] = {0};`);
        Blockly.Arduino.addVariable('micLite_clear_screen3', `String strcache;`);
        Blockly.Arduino.addSetup('micLite_clear_screen0', `Wire.begin();`);
        Blockly.Arduino.addSetup('micLite_clear_screen1', `display.setBrightness(255);`);
        const code = `memset(bitmapCache, 0, 8);\nstrcache = "";\ndisplay.clearDisplay();`;
        return `${code}`;
    };

    Blockly.Arduino['micLite_notes_play'] = function (block) {
        const pin = 'D7'
        const op = block.getFieldValue('OP')
        Blockly.Arduino.addVariable('micLite_notes_play0', `uint8_t playSound(uint8_t pin, uint8_t songNum);`);
        Blockly.Arduino.addVariable('micLite_notes_play1', `void playingRest();`);
        Blockly.Arduino.addVariable('micLite_notes_play2', `boolean playingStop();`);
        Blockly.Arduino.addVariable('micLite_notes_play3', `#define SONG_SUM  11`);

        Blockly.Arduino.addVariable('micLite_notes_play4', `uint16_t toneList[] = { 262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1046, 1175, 1318, 1397, 1568, 1760, 1967 };`);
        Blockly.Arduino.addVariable('micLite_notes_play5', `uint8_t music_1[] = { 12, 10, 12, 10, 12, 10, 9, 10, 12, 12, 12, 10, 13, 12, 10, 12, 10, 9, 8, 9, 10, 12, 10, 9, 8, 9, 10, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play6', `uint8_t rhythm_1[] = { 4, 2, 4, 2, 2, 2, 2, 2, 8, 2, 4, 2, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play7', `uint8_t music_2[] = { 8, 9, 10, 8, 8, 9, 10, 8, 10, 11, 12, 10, 11, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play8', `uint8_t rhythm_2[] = { 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play9', `uint8_t music_3[] = { 5, 8, 8, 10, 13, 10, 12, 12, 13, 12, 10, 11, 10, 9, 6, 9, 9, 11, 14, 14, 13, 12, 11, 11, 10, 6, 7, 8, 9 , 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play11', `uint8_t rhythm_3[] = { 2, 1, 2, 1, 2, 1, 4, 2, 1, 2, 1, 2, 1, 4, 2, 1, 2, 1, 2, 1, 2, 1, 4, 2, 1, 2, 4, 2, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play12', `uint8_t music_4[] = { 5, 5, 6, 5, 8, 7, 5, 5, 6, 5, 9, 8, 5, 5, 12, 10, 8, 7, 6, 11, 11, 10, 8, 9, 8, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play13', `uint8_t rhythm_4[] = { 2, 2, 4, 4, 4, 8, 2, 2, 4, 4, 4, 8, 2, 2, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play14', `uint8_t music_5[] = { 12, 13, 12, 13, 12, 13, 12, 12, 15, 14, 13, 12, 13, 12, 12, 12, 10, 10, 12, 12, 10, 9, 11, 10, 9, 8, 9, 8, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play15', `uint8_t rhythm_5[] = { 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play16', `uint8_t music_6[] = { 8, 8, 10, 8, 8, 10, 22, 13, 13, 13, 12, 13, 12, 8, 10, 22, 15, 13, 13, 12, 13, 12, 8, 9, 22, 14, 14, 12, 10, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play17', `uint8_t rhythm_6[] = { 4, 4, 8, 2, 4, 4, 4, 4, 4, 2, 2, 4, 2, 4, 4, 4, 2, 2, 2, 2, 8, 2, 4, 4, 4, 4, 2, 2, 4, 16 };`);
        Blockly.Arduino.addVariable('micLite_notes_play18', `uint8_t music_7[] = { 6, 8, 9, 10, 12, 10, 8, 9, 6, 22, 8, 9, 10, 12, 12, 13, 9, 10, 22, 10, 12, 13, 12, 13, 15, 14, 13, 12, 13, 10, 8, 9, 10, 12, 8, 6, 8, 9, 10, 13, 12 , 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play19', `uint8_t rhythm_7[] = { 2, 2, 2, 4, 2, 2, 2, 4, 8, 2, 2, 2, 2, 4, 2, 4, 4, 8, 4, 2, 2, 8, 4, 2, 2, 1, 1, 2, 2, 4, 2, 2, 4, 2, 4, 4, 2, 2, 2, 2, 18 };`);
        Blockly.Arduino.addVariable('micLite_notes_play20', `uint8_t music_8[] = { 10, 8, 9, 6, 10, 9, 8, 9, 6, 10, 8, 9, 9, 12, 10, 7, 8, 8, 7, 6, 7, 8, 9, 5, 13, 12, 10, 10, 9, 8, 9, 10, 9, 10, 9, 12, 12, 12, 12, 12, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play21', `uint8_t rhythm_8[] = { 4, 4, 4, 4, 2, 2, 2, 2, 8, 4, 4, 4, 4, 2, 2, 4, 4, 2, 2, 4, 2, 2, 4, 4, 2, 2, 4, 4, 2, 4, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play22', `uint8_t music_9[] = { 10, 12, 15, 13, 12, 10, 12, 13, 15, 12, 15, 17, 16, 15, 16, 15, 13, 15, 12 , 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play23', `uint8_t rhythm_9[] = { 2, 2, 2, 2, 8, 2, 2, 2, 2, 8, 4, 2, 4, 4, 2, 2, 2, 2, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play24', `uint8_t music_10[] = { 10, 10, 10, 8, 5, 5, 22, 10, 10, 10, 8, 10, 22, 12, 12, 10, 8, 5, 5, 5, 6, 7, 8, 10, 9, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play25', `uint8_t rhythm_10[] = { 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play26', `uint8_t music_11[] = {8, 9, 10, 8, 8, 9, 10, 8, 10, 11, 12, 10, 11, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play27', `uint8_t rhythm_11[] = {2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play28', `const uint8_t * Pmusic[SONG_SUM] = { music_1, music_2, music_3, music_4, music_5, music_6, music_7, music_8, music_9, music_10, music_11 };`);
        Blockly.Arduino.addVariable('micLite_notes_play29', `const uint8_t * Prhythm[SONG_SUM] = { rhythm_1, rhythm_2, rhythm_3, rhythm_4, rhythm_5, rhythm_6, rhythm_7, rhythm_8, rhythm_9, rhythm_10, rhythm_11 };`);
        Blockly.Arduino.addVariable('micLite_notes_play30', `uint32_t playTimer = 0;`);
        Blockly.Arduino.addVariable('micLite_notes_play31', `int8_t songNumC = -1;`);
        Blockly.Arduino.addVariable('micLite_notes_play32', `uint8_t songIndex;`);
        Blockly.Arduino.addVariable('micLite_notes_play33', `uint8_t playIndex = 0;`);
        Blockly.Arduino.addVariable('micLite_notes_play34', `uint8_t playSound(uint8_t pin, uint8_t songNum) {
    songIndex = songNum;
    if (songNum > SONG_SUM - 1) {
        noTone(pin);
        return;
    }
    if (playIndex == 100 || songNumC != songNum) {
        playIndex = 0;
        songNumC = songNum;
    }
    if (millis() > playTimer && (*(Pmusic[songNum] + playIndex / 2))) {
        if (playIndex % 2 == 0) {
            if (*(Pmusic[songNum] + playIndex / 2) != 22) {
                tone(pin, toneList[*(Pmusic[songNum] + playIndex / 2) - 1]);
            } else {
                noTone(pin);
            }
            playTimer = millis() + *(Prhythm[songNum] + playIndex / 2) * 75;
        } else {
            noTone(pin);
            playTimer = millis() + 40;
        }
        playIndex++;
    }
}`);
        Blockly.Arduino.addVariable('micLite_notes_play35', `void playingRest() {
    playIndex = 0;
}`);
        Blockly.Arduino.addVariable('micLite_notes_play36', `boolean playingStop() {
    if (*(Pmusic[songIndex] + playIndex / 2)) {
        return false;
    } else {
        return true;
    }
}`
        );

        const code = `if (!playingStop()) {\n   playSound(${pin}, ${op}-1);\n} else {\n  playingRest();\n}`;
        return `${code}`;
    };

    Blockly.Arduino['micLite_notes_play_wait'] = function (block) {
        const pin = 'D7'
        const op = block.getFieldValue('OP')
        Blockly.Arduino.addVariable('micLite_notes_play0', `uint8_t playSound(uint8_t pin, uint8_t songNum);`);
        Blockly.Arduino.addVariable('micLite_notes_play1', `void playingRest();`);
        Blockly.Arduino.addVariable('micLite_notes_play2', `boolean playingStop();`);
        Blockly.Arduino.addVariable('micLite_notes_play3', `#define SONG_SUM  11`);

        Blockly.Arduino.addVariable('micLite_notes_play4', `uint16_t toneList[] = { 262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1046, 1175, 1318, 1397, 1568, 1760, 1967 };`);
        Blockly.Arduino.addVariable('micLite_notes_play5', `uint8_t music_1[] = { 12, 10, 12, 10, 12, 10, 9, 10, 12, 12, 12, 10, 13, 12, 10, 12, 10, 9, 8, 9, 10, 12, 10, 9, 8, 9, 10, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play6', `uint8_t rhythm_1[] = { 4, 2, 4, 2, 2, 2, 2, 2, 8, 2, 4, 2, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play7', `uint8_t music_2[] = { 8, 9, 10, 8, 8, 9, 10, 8, 10, 11, 12, 10, 11, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play8', `uint8_t rhythm_2[] = { 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play9', `uint8_t music_3[] = { 5, 8, 8, 10, 13, 10, 12, 12, 13, 12, 10, 11, 10, 9, 6, 9, 9, 11, 14, 14, 13, 12, 11, 11, 10, 6, 7, 8, 9 , 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play11', `uint8_t rhythm_3[] = { 2, 1, 2, 1, 2, 1, 4, 2, 1, 2, 1, 2, 1, 4, 2, 1, 2, 1, 2, 1, 2, 1, 4, 2, 1, 2, 4, 2, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play12', `uint8_t music_4[] = { 5, 5, 6, 5, 8, 7, 5, 5, 6, 5, 9, 8, 5, 5, 12, 10, 8, 7, 6, 11, 11, 10, 8, 9, 8, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play13', `uint8_t rhythm_4[] = { 2, 2, 4, 4, 4, 8, 2, 2, 4, 4, 4, 8, 2, 2, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play14', `uint8_t music_5[] = { 12, 13, 12, 13, 12, 13, 12, 12, 15, 14, 13, 12, 13, 12, 12, 12, 10, 10, 12, 12, 10, 9, 11, 10, 9, 8, 9, 8, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play15', `uint8_t rhythm_5[] = { 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play16', `uint8_t music_6[] = { 8, 8, 10, 8, 8, 10, 22, 13, 13, 13, 12, 13, 12, 8, 10, 22, 15, 13, 13, 12, 13, 12, 8, 9, 22, 14, 14, 12, 10, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play17', `uint8_t rhythm_6[] = { 4, 4, 8, 2, 4, 4, 4, 4, 4, 2, 2, 4, 2, 4, 4, 4, 2, 2, 2, 2, 8, 2, 4, 4, 4, 4, 2, 2, 4, 16 };`);
        Blockly.Arduino.addVariable('micLite_notes_play18', `uint8_t music_7[] = { 6, 8, 9, 10, 12, 10, 8, 9, 6, 22, 8, 9, 10, 12, 12, 13, 9, 10, 22, 10, 12, 13, 12, 13, 15, 14, 13, 12, 13, 10, 8, 9, 10, 12, 8, 6, 8, 9, 10, 13, 12 , 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play19', `uint8_t rhythm_7[] = { 2, 2, 2, 4, 2, 2, 2, 4, 8, 2, 2, 2, 2, 4, 2, 4, 4, 8, 4, 2, 2, 8, 4, 2, 2, 1, 1, 2, 2, 4, 2, 2, 4, 2, 4, 4, 2, 2, 2, 2, 18 };`);
        Blockly.Arduino.addVariable('micLite_notes_play20', `uint8_t music_8[] = { 10, 8, 9, 6, 10, 9, 8, 9, 6, 10, 8, 9, 9, 12, 10, 7, 8, 8, 7, 6, 7, 8, 9, 5, 13, 12, 10, 10, 9, 8, 9, 10, 9, 10, 9, 12, 12, 12, 12, 12, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play21', `uint8_t rhythm_8[] = { 4, 4, 4, 4, 2, 2, 2, 2, 8, 4, 4, 4, 4, 2, 2, 4, 4, 2, 2, 4, 2, 2, 4, 4, 2, 2, 4, 4, 2, 4, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play22', `uint8_t music_9[] = { 10, 12, 15, 13, 12, 10, 12, 13, 15, 12, 15, 17, 16, 15, 16, 15, 13, 15, 12 , 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play23', `uint8_t rhythm_9[] = { 2, 2, 2, 2, 8, 2, 2, 2, 2, 8, 4, 2, 4, 4, 2, 2, 2, 2, 8 };`);
        Blockly.Arduino.addVariable('micLite_notes_play24', `uint8_t music_10[] = { 10, 10, 10, 8, 5, 5, 22, 10, 10, 10, 8, 10, 22, 12, 12, 10, 8, 5, 5, 5, 6, 7, 8, 10, 9, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play25', `uint8_t rhythm_10[] = { 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play26', `uint8_t music_11[] = {8, 9, 10, 8, 8, 9, 10, 8, 10, 11, 12, 10, 11, 12, 0 };`);
        Blockly.Arduino.addVariable('micLite_notes_play27', `uint8_t rhythm_11[] = {2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 4 };`);
        Blockly.Arduino.addVariable('micLite_notes_play28', `const uint8_t * Pmusic[SONG_SUM] = { music_1, music_2, music_3, music_4, music_5, music_6, music_7, music_8, music_9, music_10, music_11 };`);
        Blockly.Arduino.addVariable('micLite_notes_play29', `const uint8_t * Prhythm[SONG_SUM] = { rhythm_1, rhythm_2, rhythm_3, rhythm_4, rhythm_5, rhythm_6, rhythm_7, rhythm_8, rhythm_9, rhythm_10, rhythm_11 };`);
        Blockly.Arduino.addVariable('micLite_notes_play30', `uint32_t playTimer = 0;`);
        Blockly.Arduino.addVariable('micLite_notes_play31', `int8_t songNumC = -1;`);
        Blockly.Arduino.addVariable('micLite_notes_play32', `uint8_t songIndex;`);
        Blockly.Arduino.addVariable('micLite_notes_play33', `uint8_t playIndex = 0;`);
        Blockly.Arduino.addVariable('micLite_notes_play34', `uint8_t playSound(uint8_t pin, uint8_t songNum) {
    songIndex = songNum;
    if (songNum > SONG_SUM - 1) {
        noTone(pin);
        return;
    }
    if (playIndex == 100 || songNumC != songNum) {
        playIndex = 0;
        songNumC = songNum;
    }
    if (millis() > playTimer && (*(Pmusic[songNum] + playIndex / 2))) {
        if (playIndex % 2 == 0) {
            if (*(Pmusic[songNum] + playIndex / 2) != 22) {
                tone(pin, toneList[*(Pmusic[songNum] + playIndex / 2) - 1]);
            } else {
                noTone(pin);
            }
            playTimer = millis() + *(Prhythm[songNum] + playIndex / 2) * 75;
        } else {
            noTone(pin);
            playTimer = millis() + 40;
        }
        playIndex++;
    }
}`);
        Blockly.Arduino.addVariable('micLite_notes_play35', `void playingRest() {
    playIndex = 0;
}`);
        Blockly.Arduino.addVariable('micLite_notes_play36', `boolean playingStop() {
    if (*(Pmusic[songIndex] + playIndex / 2)) {
        return false;
    } else {
        return true;
    }
}`
        );

        const code = `while (!playingStop()) {\n   playSound(${pin}, ${op}-1);\n}
playingRest();`;
        return `${code}`;
    };

    Blockly.Arduino['micLite_notes_stop'] = function (block) {
        const _playoff = 'playoff'
        Blockly.Arduino.addVariable('micLite_notes_stop0', `uint8_t ${_playoff}(uint8_t pin);`);
        Blockly.Arduino.addVariable('micLite_notes_play33', `uint8_t playIndex = 0;`);
        Blockly.Arduino.addVariable('micLite_notes_stop2', `uint8_t ${_playoff}(uint8_t pin) {
    playIndex = 100;
    noTone(pin);
}`);
        return `${_playoff}(D7);`;
    };

    Blockly.Arduino['micLite_notes_light'] = function (block) {
        const code = `analogRead(A6)`;
        return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
    };

    Blockly.Arduino['micLite_notes_sound'] = function (block) {
        const code = `analogRead(A7)`;
        return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
    };

    Blockly.Arduino['micLite_notes_speed'] = function (block) {
        Blockly.Arduino.addInclude("Microduino_sensorMotion.h", "#include <Microduino_sensorMotion.h>\n");
        Blockly.Arduino.addVariable('micLite_notes_speed0', `sensorMotion mma7660;`);
        Blockly.Arduino.addSetup('micLite_notes_speed0', `mma7660.begin();`)
        var operator = block.getFieldValue('OP');
        var code;
        code = `mma7660.getAccelerationRaw${operator}()`;
        return [code, Blockly.Arduino.ORDER_MULTIPLICATIVE];
    };
}
export default LoadMicLiteCodeGenerator
