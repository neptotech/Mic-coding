/**
 * Visual Blocks Language
 *
 * Copyright 2012 Fred Lin.
 * https://github.com/gasolin/BlocklyDuino
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
 * @fileoverview Helper functions for generating.MicroPython blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */


goog.provide('Blockly.MicroPython.base');

goog.require('Blockly.MicroPython');

const LoadBaseCodeGenerator = () => {
  Blockly.MicroPython.delayMicroseconds = function () {
    const delay_time = Blockly.MicroPython.valueToCode(this, 'DELAY_TIME', Blockly.MicroPython.ORDER_ATOMIC) || '1000';
    const code = `delayMicroseconds(${delay_time});\n`;
    return code;
  };

  Blockly.MicroPython.base_delay = function () {
    const delay_time = Blockly.MicroPython.valueToCode(this, 'DELAY_TIME', Blockly.MicroPython.ORDER_ATOMIC) || '1000';
    const code = `delay(${delay_time});\n`;
    return code;
  };

  Blockly.MicroPython.base_map = function () {
    const value_num = Blockly.MicroPython.valueToCode(this, 'NUM', Blockly.MicroPython.ORDER_NONE);
    const value_dmax = Blockly.MicroPython.valueToCode(this, 'DMAX', Blockly.MicroPython.ORDER_ATOMIC);
    const code = `map(${value_num}, 0, 1024, 0, ${value_dmax})`;
    return [code, Blockly.MicroPython.ORDER_NONE];
  };

  Blockly.MicroPython.inout_buildin_led = function () {
    const dropdown_stat = this.getFieldValue('STAT');
    Blockly.MicroPython.setups_.setup_output_13 = 'pinMode(13, OUTPUT);';
    const code = `digitalWrite(13, ${dropdown_stat});\n`;
    return code;
  };

  Blockly.MicroPython.inout_digital_write = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    const dropdown_stat = this.getFieldValue('STAT');
    Blockly.MicroPython.setups_[`setup_output_${dropdown_pin}`] = `pinMode(${dropdown_pin}, OUTPUT);`;
    const code = `digitalWrite(${dropdown_pin}, ${dropdown_stat});\n`;
    return code;
  };

  Blockly.MicroPython.inout_digital_read = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    Blockly.MicroPython.setups_[`setup_input_${dropdown_pin}`] = `pinMode(${dropdown_pin}, INPUT);`;
    const code = `digitalRead(${dropdown_pin})`;
    return [code, Blockly.MicroPython.ORDER_ATOMIC];
  };

  Blockly.MicroPython.inout_analog_write = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    // var dropdown_stat = this.getFieldValue('STAT');
    const value_num = Blockly.MicroPython.valueToCode(this, 'NUM', Blockly.MicroPython.ORDER_ATOMIC);
    // Blockly.MicroPython.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
    const code = `analogWrite(${dropdown_pin}, ${value_num});\n`;
    return code;
  };

  Blockly.MicroPython.inout_analog_read = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    // Blockly.MicroPython.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
    const code = `analogRead(${dropdown_pin})`;
    return [code, Blockly.MicroPython.ORDER_ATOMIC];
  };

  Blockly.MicroPython.inout_tone = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    const value_num = Blockly.MicroPython.valueToCode(this, 'NUM', Blockly.MicroPython.ORDER_ATOMIC);
    Blockly.MicroPython.setups_[`setup_output${dropdown_pin}`] = `pinMode(${dropdown_pin}, OUTPUT);`;
    const code = `tone(${dropdown_pin}, ${value_num});\n`;
    return code;
  };

  Blockly.MicroPython.inout_notone = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    Blockly.MicroPython.setups_[`setup_output${dropdown_pin}`] = `pinMode(${dropdown_pin}, OUTPUT);`;
    const code = `noTone(${dropdown_pin});\n`;
    return code;
  };

  Blockly.MicroPython.inout_highlow = function () {
    // Boolean values HIGH and LOW.
    const code = (this.getFieldValue('BOOL') == 'HIGH') ? 'HIGH' : 'LOW';
    return [code, Blockly.MicroPython.ORDER_ATOMIC];
  };

  Blockly.MicroPython.servo_move = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    const value_degree = Blockly.MicroPython.valueToCode(this, 'DEGREE', Blockly.MicroPython.ORDER_ATOMIC);

    Blockly.MicroPython.definitions_.define_servo = '#include <Servo.h>\n';
    Blockly.MicroPython.definitions_[`var_servo${dropdown_pin}`] = `Servo servo_${dropdown_pin};\n`;
    Blockly.MicroPython.setups_[`setup_servo_${dropdown_pin}`] = `servo_${dropdown_pin}.attach(${dropdown_pin});\n`;

    const code = `servo_${dropdown_pin}.write(${value_degree});\n`;
    return code;
  };

  Blockly.MicroPython.servo_read_degrees = function () {
    const dropdown_pin = this.getFieldValue('PIN');

    Blockly.MicroPython.definitions_.define_servo = '#include <Servo.h>\n';
    Blockly.MicroPython.definitions_[`var_servo${dropdown_pin}`] = `Servo servo_${dropdown_pin};\n`;
    Blockly.MicroPython.setups_[`setup_servo_${dropdown_pin}`] = `servo_${dropdown_pin}.attach(${dropdown_pin});\n`;

    const code = `servo_${dropdown_pin}.read()`;
    return code;
  };

  Blockly.MicroPython.serial_print = function () {
    const content = Blockly.MicroPython.valueToCode(this, 'CONTENT', Blockly.MicroPython.ORDER_ATOMIC) || '0';
    // content = content.replace('(','').replace(')','');

    Blockly.MicroPython.setups_[`setup_serial_${Blockly.MicroPython.profile.default.serial}`] = `Serial.begin(${Blockly.MicroPython.profile.default.serial});\n`;

    const code = `Serial.println(${content});\n`;
    return code;
  };
}

export default LoadBaseCodeGenerator;
