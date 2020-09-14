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
 * @fileoverview Helper functions for generating Arduino blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */


goog.provide('Blockly.Arduino.base');

goog.require('Blockly.Arduino');

const LoadBaseCodeGenerator = () => {
  Blockly.Arduino.delayMicroseconds = function () {
    const delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
    const code = `delayMicroseconds(${delay_time});\n`;
    return code;
  };

  Blockly.Arduino.base_delay = function () {
    const delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
    const code = `delay(${delay_time});\n`;
    return code;
  };

  Blockly.Arduino.base_map = function () {
    const value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE);
    const value_dmax = Blockly.Arduino.valueToCode(this, 'DMAX', Blockly.Arduino.ORDER_ATOMIC);
    const code = `map(${value_num}, 0, 1024, 0, ${value_dmax})`;
    return [code, Blockly.Arduino.ORDER_NONE];
  };

  Blockly.Arduino.inout_buildin_led = function () {
    const dropdown_stat = this.getFieldValue('STAT');
    Blockly.Arduino.setups_.setup_output_13 = 'pinMode(13, OUTPUT);';
    const code = `digitalWrite(13, ${dropdown_stat});\n`;
    return code;
  };

  Blockly.Arduino.inout_digital_write = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    const dropdown_stat = this.getFieldValue('STAT');
    Blockly.Arduino.setups_[`setup_output_${dropdown_pin}`] = `pinMode(${dropdown_pin}, OUTPUT);`;
    const code = `digitalWrite(${dropdown_pin}, ${dropdown_stat});\n`;
    return code;
  };

  Blockly.Arduino.inout_digital_read = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    Blockly.Arduino.setups_[`setup_input_${dropdown_pin}`] = `pinMode(${dropdown_pin}, INPUT);`;
    const code = `digitalRead(${dropdown_pin})`;
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };

  Blockly.Arduino.inout_analog_write = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    // var dropdown_stat = this.getFieldValue('STAT');
    const value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC);
    // Blockly.Arduino.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
    const code = `analogWrite(${dropdown_pin}, ${value_num});\n`;
    return code;
  };

  Blockly.Arduino.inout_analog_read = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    // Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
    const code = `analogRead(${dropdown_pin})`;
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };

  Blockly.Arduino.inout_tone = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    const value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setups_[`setup_output${dropdown_pin}`] = `pinMode(${dropdown_pin}, OUTPUT);`;
    const code = `tone(${dropdown_pin}, ${value_num});\n`;
    return code;
  };

  Blockly.Arduino.inout_notone = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    Blockly.Arduino.setups_[`setup_output${dropdown_pin}`] = `pinMode(${dropdown_pin}, OUTPUT);`;
    const code = `noTone(${dropdown_pin});\n`;
    return code;
  };

  Blockly.Arduino.inout_highlow = function () {
    // Boolean values HIGH and LOW.
    const code = (this.getFieldValue('BOOL') == 'HIGH') ? 'HIGH' : 'LOW';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };

  Blockly.Arduino.servo_move = function () {
    const dropdown_pin = this.getFieldValue('PIN');
    const value_degree = Blockly.Arduino.valueToCode(this, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.definitions_.define_servo = '#include <Servo.h>\n';
    Blockly.Arduino.definitions_[`var_servo${dropdown_pin}`] = `Servo servo_${dropdown_pin};\n`;
    Blockly.Arduino.setups_[`setup_servo_${dropdown_pin}`] = `servo_${dropdown_pin}.attach(${dropdown_pin});\n`;

    const code = `servo_${dropdown_pin}.write(${value_degree});\n`;
    return code;
  };

  Blockly.Arduino.servo_read_degrees = function () {
    const dropdown_pin = this.getFieldValue('PIN');

    Blockly.Arduino.definitions_.define_servo = '#include <Servo.h>\n';
    Blockly.Arduino.definitions_[`var_servo${dropdown_pin}`] = `Servo servo_${dropdown_pin};\n`;
    Blockly.Arduino.setups_[`setup_servo_${dropdown_pin}`] = `servo_${dropdown_pin}.attach(${dropdown_pin});\n`;

    const code = `servo_${dropdown_pin}.read()`;
    return code;
  };

  Blockly.Arduino.serial_print = function () {
    const content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';
    // content = content.replace('(','').replace(')','');

    Blockly.Arduino.setups_[`setup_serial_${Blockly.Arduino.profile.default.serial}`] = `Serial.begin(${Blockly.Arduino.profile.default.serial});\n`;

    const code = `Serial.println(${content});\n`;
    return code;
  };
}

export default LoadBaseCodeGenerator;
