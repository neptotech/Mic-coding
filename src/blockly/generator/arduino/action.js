/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the event blocks.
 */
'use strict';

goog.provide('Blockly.Arduino.action');

goog.require('Blockly.Arduino');

const LoadActionCodeGenerator = () => {
   
    Blockly.Arduino['action_motorplus_speed'] = function(block) {

        const motorPin = block.getFieldValue('motorpin');
        const Speed = Blockly.Arduino.valueToCode(block, 'speed', Blockly.Arduino.ORDER_NONE)
        Blockly.Arduino.addInclude("<Microduino_MotorPlus.h", "#include <<Microduino_MotorPlus.h>\n");
        Blockly.Arduino.addSetup(`action_motorplus_speed${motorPin}`, `motor.begin();`);
        Blockly.Arduino.addVariable(`action_motorplus_speed0`, `MotorPlus motor(MOTOR_ADDR4);`);

        return `motor.setSpeed${motorPin}(${Speed});\n`
    }

    Blockly.Arduino['action_motorplus_brake'] = function(block) {
        const motorPin = block.getFieldValue('motorpin');
        Blockly.Arduino.addInclude("Microduino_MotorPlus.h", "#include <Microduino_MotorPlus.h>\n");
        Blockly.Arduino.addVariable(`action_motorplus_speed0`, `MotorPlus motor(MOTOR_ADDR4);`);
        Blockly.Arduino.addSetup('action_motorplus_speed0', `motor.begin();`)
        return `motor.setSpeed${motorPin}(BRAKE);\n`
    }

    Blockly.Arduino['action_servo'] = function(block) {

        const pin = Blockly.Arduino.valueToCode(block, 'port', Blockly.Arduino.ORDER_ATOMIC) || '2';
        const degree = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC) || '150';
        Blockly.Arduino.addInclude("Servo.h", "#include <Servo.h>\n");
        const servo = `servo_${pin}`;

        Blockly.Arduino.addVariable(`action_servo0`, `Servo ${servo};`);
        Blockly.Arduino.addSetup(`action_servo${pin}`, `${servo}.attach(${pin});`);
    
        return `${servo}.write(${degree});\n`;
    }

    Blockly.Arduino['action_servo_rotate'] = function(block) {
        const order = Blockly.Arduino.ORDER_NONE
        const pin = Blockly.Arduino.valueToCode(block, 'port', Blockly.Arduino.ORDER_ATOMIC) || '2';

        const degreebegin = Blockly.Arduino.valueToCode(block, 'angle_begin', order) || '30';
        const degreeend = Blockly.Arduino.valueToCode(block, 'angle_end', order) || '120';
        const duration = Blockly.Arduino.valueToCode(block, 'duration', order) || '0.5';
        
        Blockly.Arduino.addInclude("Servo.h", "#include <Servo.h>\n");
        const servo = `servo_${pin}`;
        Blockly.Arduino.addVariable(`action_servo0`, `Servo ${servo};`);
        Blockly.Arduino.addSetup(`action_servo_rotate${pin}`, `${servo}.attach(${pin});`);

        const servoVar = 'servo';
        const anglebegin = 'anglebegin';
        const angleend = 'angleend';
        const _duration = '_duration';
        const a = 'a';
        
        const func = `void servo_move(Servo &${servoVar}, uint8_t ${anglebegin}, uint8_t ${angleend}, int ${_duration}) {
    if (${angleend} > ${anglebegin}) {
        for (uint8_t ${a} = 0; ${a} < ${angleend} - ${anglebegin}; ${a}++) {
            ${servoVar}.write(${anglebegin} + ${a});
            delay(${_duration} / (${angleend} - ${anglebegin}));
        }
    } else if (${angleend} < ${anglebegin}) {
        for (uint8_t ${a} = 0; ${a} < ${anglebegin} - ${angleend}; ${a}++) {
            ${servoVar}.write(${anglebegin} - ${a});
            delay(${_duration} / (${anglebegin} - ${angleend}));
        }
    }
}`;

        Blockly.Arduino.addVariable('action_servo_rotate0', func);

        return  `servo_move(${servo}, ${degreebegin}, ${degreeend}, ${duration} * 1000);`
    }



    Blockly.Arduino['action_servo_drop_digital'] = function(block) {
        var code = block.getFieldValue('port');
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    }

}

export default LoadActionCodeGenerator;