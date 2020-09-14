/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Based on work of Fred Lin (gasolin@gmail.com) for Blocklyduino.
 *
 * @fileoverview Helper functions for generating Arduino language (C++).
 */
'use strict';

goog.provide('Blockly.Arduino');

goog.require('Blockly.Generator');
goog.require('Blockly.StaticTyping');

const LoadArduinoDefine = () => {
    /**
     * Arduino code generator.
     * @type {!Blockly.Generator}
     */
    Blockly.Arduino = new Blockly.Generator('Arduino');
    Blockly.Arduino.StaticTyping = new Blockly.StaticTyping();

    /**
     * List of illegal variable names.
     * This is not intended to be a security feature.  Blockly is 100% client-side,
     * so bypassing this list is trivial.  This is intended to prevent users from
     * accidentally clobbering a built-in object or function.
     * Arduino specific keywords defined in: http://arduino.cc/en/Reference/HomePage
     * @private
     */
    Blockly.Arduino.addReservedWords(
        'Blockly,' + // In case JS is evaled in the current window.
        'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
        'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
        'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
        'float,double,string,String,array,static,volatile,const,sizeof,pinMode,' +
        'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
        'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
        'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
        'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
        'detachInterrupt,interrupts,noInterrupts');

    /** Order of operation ENUMs. */
    Blockly.Arduino.ORDER_ATOMIC = 0; // 0 "" ...
    Blockly.Arduino.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
    Blockly.Arduino.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
    Blockly.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
    Blockly.Arduino.ORDER_ADDITIVE = 4; // + -
    Blockly.Arduino.ORDER_SHIFT = 5; // << >>
    Blockly.Arduino.ORDER_RELATIONAL = 6; // >= > <= <
    Blockly.Arduino.ORDER_EQUALITY = 7; // == != === !==
    Blockly.Arduino.ORDER_BITWISE_AND = 8; // &
    Blockly.Arduino.ORDER_BITWISE_XOR = 9; // ^
    Blockly.Arduino.ORDER_BITWISE_OR = 10; // |
    Blockly.Arduino.ORDER_LOGICAL_AND = 11; // &&
    Blockly.Arduino.ORDER_LOGICAL_OR = 12; // ||
    Blockly.Arduino.ORDER_CONDITIONAL = 13; // expr ? expr : expr
    Blockly.Arduino.ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
    Blockly.Arduino.ORDER_NONE = 99; // (...)

    /**
     * A list of types tasks that the pins can be assigned. Used to track usage and
     * warn if the same pin has been assigned to more than one task.
     */
    Blockly.Arduino.PinTypes = {
        INPUT: 'INPUT',
        OUTPUT: 'OUTPUT',
        PWM: 'PWM',
        SERVO: 'SERVO',
        STEPPER: 'STEPPER',
        SERIAL: 'SERIAL',
        I2C: 'I2C/TWI',
        SPI: 'SPI',
        // extra setup
        FASTLED: 'FASTLED',
        DHT: 'DHT'
    };

    /*
     * Arduino Board profiles
     *
     */
    Blockly.Arduino.profile = {
        arduino: {
            description: 'Arduino standard-compatible board',
            digital: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13'], ['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3'], ['A4', 'A4'], ['A5', 'A5']],
            dropdownDigital: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13'], ['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3'], ['A4', 'A4'], ['A5', 'A5']],
            analog: [['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3'], ['A4', 'A4'], ['A5', 'A5']],
            dropdownAnalog: [['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3'], ['A4', 'A4'], ['A5', 'A5']],
            interrupt: [["3", "3"], ["2", "2"], ["0", "0"], ["1", "1"], ["7", "7"]],
            serial: 9600
        },
        arduino_leonardo: {
            description: "Arduino Leonardo",
            cpu: "atmega32u4",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11", "13"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A6", "A7", "A8", "A9", "A10", "A11"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(D4)", "4"], ["A7(D6)", "6"], ["A8(D8)", "8"], ["A9(D9)", "9"], ["A10(D10)", "10"], ["A11(D12)", "12"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["2", "3"],
            SPI: ["connect"],
            interrupt: ["3", "2", "0", "1", "7"],
            picture: "media/boards/arduino_leonardo.jpg",
            miniPicture: "media/boards/arduino_leonardo_mini.jpg",
            miniPicture_hor: "media/boards/arduino_leonardo_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:leonardo",
            help_link: "https://www.arduino.cc/en/Main/Arduino_BoardLeonardo"
        },
        arduino_mega: {
            description: "Arduino Mega 2560 / ADK",
            cpu: "atmega2560",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"],
            dropdownDigital: "attention",
            PWM: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "44", "45", "46"],
            dropdownPWM: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["44", "44"], ["45", "45"], ["46", "46"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"], ["A8", "A8"], ["A9", "A9"], ["A10", "A10"], ["A11", "A11"], ["A12", "A12"], ["A13", "A13"], ["A14", "A14"], ["A15", "A15"]],
            /*irqonchange : [["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["50", "50"], ["51", "51"], ["52", "52"], ["53", "53"], ["A8", "62"], ["A9", "63"], ["A10", "64"], ["A11", "65"], ["A12", "66"], ["A13", "67"], ["A14", "68"], ["A15", "69"]],*/
            I2C: ["20", "21"],
            SPI: [["50 (SS)", "50"], ["51 (MOSI)", "51"], ["52 (MISO)", "52"], ["53 (SCK)", "53"]],
            interrupt: ["2", "3", "21", "20", "19", "18"],
            picture: "media/boards/arduino_mega.jpg",
            miniPicture: "media/boards/arduino_mega_mini.jpg",
            miniPicture_hor: "media/boards/arduino_mega_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"], ["19 (Rx1) ; 18 (Tx1)", "19"], ["17 (Rx2) ; 16 (Tx2)", "17"], ["15 (Rx3) ; 14 (Tx3)", "15"]],
            upload_arg: "arduino:avr:mega:cpu=atmega2560",
            help_link: "https://store.arduino.cc/mega-2560-r3"
        },
        arduino_micro: {
            description: "Arduino Micro",
            cpu: "atmega32u4",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11", "13"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A6", "A7", "A8", "A9", "A10", "A11"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(D4)", "4"], ["A7(D6)", "6"], ["A8(D8)", "8"], ["A9(D9)", "9"], ["A10(D10)", "10"], ["A11(D12)", "12"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["2", "3"],
            SPI: ["connect"],
            interrupt: [["0(Rx)", "0"], ["1(Tx)", "1"], ["2", "2"], ["3", "3"], ["7", "7"]],
            picture: "media/boards/arduino_micro.jpg",
            miniPicture: "media/boards/arduino_micro_mini.jpg",
            miniPicture_hor: "media/boards/arduino_micro_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:micro",
            help_link: "https://store.arduino.cc/arduino-micro"
        },
        arduino_mini: {
            description: "Arduino Mini ATmega328",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: [["2", "2"], ["3", "3"]],
            picture: "media/boards/arduino_mini.jpg",
            miniPicture: "media/boards/arduino_mini_mini.jpg",
            miniPicture_hor: "media/boards/arduino_mini_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:mini",
            help_link: "https://store.arduino.cc/arduino-mini-05"
        },
        arduino_nano: {
            description: "Arduino Nano ATmega328",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/arduino_nano.jpg",
            miniPicture: "media/boards/arduino_nano_mini.jpg",
            miniPicture_hor: "media/boards/arduino_nano_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardNano"
        },
        arduino_pro8: {
            description: "Arduino Pro Mini 3.3V ATmega328",
            cpu: "atmega328p",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: [["2", "2"], ["3", "3"]],
            picture: "media/boards/arduino_pro.jpg",
            miniPicture: "media/boards/arduino_pro_mini.jpg",
            miniPicture_hor: "media/boards/arduino_pro_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:pro:cpu=8MHzatmega328",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardProMini"
        },
        arduino_pro16: {
            description: "Arduino Pro Mini 5V ATmega328",
            cpu: "atmega328p",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: [["2", "2"], ["3", "3"]],
            picture: "media/boards/arduino_pro.jpg",
            miniPicture: "media/boards/arduino_pro_mini.jpg",
            miniPicture_hor: "media/boards/arduino_pro_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:pro:cpu=16MHzatmega328",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardProMini"
        },
        arduino_uno: {
            description: "Arduino Uno",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/arduino_uno.jpg",
            miniPicture: "media/boards/arduino_uno_mini.jpg",
            miniPicture_hor: "media/boards/arduino_uno_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardUno"
        },
        arduino_yun: {
            description: "Arduino Yùn",
            cpu: "atmega32u4",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11", "13"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A6", "A7", "A8", "A9", "A10", "A11"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(D4)", "4"], ["A7(D6)", "6"], ["A8(D8)", "8"], ["A9(D9)", "9"], ["A10(D10)", "10"], ["A11(D12)", "12"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: ["connect"],
            interrupt: ["3", "2", "0", "1", "7"],
            picture: "media/boards/arduino_yun.jpg",
            miniPicture: "media/boards/arduino_yun_mini.jpg",
            miniPicture_hor: "media/boards/arduino_yun_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:yun",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardYun"
        },
        lilypad: {
            description: "LilyPad Arduino ATmega328P",
            cpu: "atmega328p",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/lilypad.jpg",
            miniPicture: "media/boards/lilypad_mini.jpg",
            miniPicture_hor: "media/boards/lilypad_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:lilypad",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardLilyPad/"
        },
        dagu_rs027: {
            description: "Dagu RS027",
            cpu: "atmega8",
            speed: "19200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["9", "10", "11"],
            dropdownPWM: [["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: [["2", "2"], ["3", "3"]],
            picture: "media/boards/dagu_rs027.jpg",
            miniPicture: "media/boards/dagu_rs027_mini.jpg",
            miniPicture_hor: "media/boards/dagu_rs027_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:pro:cpu=8MHzatmega168",
            help_link: "https://www.gotronic.fr/art-carte-de-controle-rs027-18765.htm"
        },
        dagu_rs040: {
            description: "Dagu RS040",
            cpu: "atmega328p",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: [["2", "2"], ["3", "3"]],
            picture: "media/boards/dagu_rs040.jpg",
            miniPicture: "media/boards/dagu_rs040_mini.jpg",
            miniPicture_hor: "media/boards/dagu_rs040_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328",
            help_link: "https://www.gotronic.fr/art-carte-mini-driver-mkii-24795.htm"
        },
        makeblock_mcore: {
            description: "Makeblock mCore for mBot",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["9", "10", "11", "12"],
            dropdownDigital: [["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"]],
            PWM: ["9", "10", "11"],
            dropdownPWM: [["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/makeblock_mcore.jpg",
            miniPicture: "media/boards/makeblock_mcore_mini.jpg",
            miniPicture_hor: "media/boards/makeblock_mcore_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.makeblock.com/project/mcore"
        },
        makeblock_megaPi: {
            description: "Makeblock MegaPi",
            cpu: "atmega2560",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"],
            dropdownDigital: "attention",
            PWM: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "44", "45", "46"],
            dropdownPWM: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["44", "44"], ["45", "45"], ["46", "46"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"], ["A8", "A8"], ["A9", "A9"], ["A10", "A10"], ["A11", "A11"], ["A12", "A12"], ["A13", "A13"], ["A14", "A14"], ["A15", "A15"]],
            /*irqonchange : [["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["50", "50"], ["51", "51"], ["52", "52"], ["53", "53"], ["A8", "62"], ["A9", "63"], ["A10", "64"], ["A11", "65"], ["A12", "66"], ["A13", "67"], ["A14", "68"], ["A15", "69"]],*/
            I2C: ["20", "21"],
            SPI: [["50 (SS)", "50"], ["51 (MOSI)", "51"], ["52 (MISO)", "52"], ["53 (SCK)", "53"]],
            interrupt: ["2", "3", "21", "20", "19", "18"],
            picture: "media/boards/makeblock_megaPi.jpg",
            miniPicture: "media/boards/makeblock_megaPi_mini.jpg",
            miniPicture_hor: "media/boards/makeblock_megaPi_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"], ["19 (Rx1) ; 18 (Tx1)", "19"], ["17 (Rx2) ; 16 (Tx2)", "17"], ["15 (Rx3) ; 14 (Tx3)", "15"]],
            upload_arg: "arduino:avr:mega:cpu=atmega2560",
            help_link: "https://www.makeblock.com/project/megapi"
        },
        makeblock_orion: {
            description: "Makeblock Me Orion",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "10", "11"],
            dropdownPWM: [["3", "3"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/makeblock_orion.jpg",
            miniPicture: "media/boards/makeblock_orion_mini.jpg",
            miniPicture_hor: "media/boards/makeblock_orion_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.makeblock.com/project/makeblock-orion"
        },
        dfrobot_romeo: {
            description: "RoMeo v2",
            cpu: "atmega32u4",
            speed: "57600",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11", "13"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A6", "A7", "A8", "A9", "A10", "A11"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(D4)", "4"], ["A7(D6)", "6"], ["A8(D8)", "8"], ["A9(D9)", "9"], ["A10(D10)", "10"], ["A11(D12)", "12"]],
            I2C: ["connect"],
            SPI: [["16 (MOSI)", "16"], ["14 (MISO)", "14"], ["15 (SCK)", "15"]],
            interrupt: ["3", "2", "0", "1", "7"],
            picture: "media/boards/dfrobot_romeo.jpg",
            miniPicture: "media/boards/dfrobot_romeo_mini.jpg",
            miniPicture_hor: "media/boards/dfrobot_romeo_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:leonardo",
            help_link: "https://www.dfrobot.com/product-844.html"
        },
        dfrobot_romeo_ble: {
            description: "RoMeo BLE",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11", "13"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/dfrobot_romeo_ble.jpg",
            miniPicture: "media/boards/dfrobot_romeo_ble_mini.jpg",
            miniPicture_hor: "media/boards/dfrobot_romeo_ble_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.dfrobot.com/product-1176.html"
        },
        esp8266: {
            description: "ESP8266",
            cpu: "esp8266",
            speed: "921600",
            digital: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownDigital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            PWM: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownPWM: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            analog: ["A0"],
            dropdownAnalog: [["A0", "A0"]],
            I2C: ["21", "22"],
            SPI: [["13 (MOSI)", "13"], ["12 (MISO)", "12"], ["14 (SCK)", "14"]],
            interrupt: ["2", "3"],
            picture: "media/boards/esp8266.jpg",
            miniPicture: "media/boards/esp8266_mini.jpg",
            miniPicture_hor: "media/boards/esp8266_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["Rx0 ; Tx0", "3 ; 1"], ["Rx1 ; Tx1", "28 ; 29"], ["Rx2 ; Tx2", "16 ; 17"]],
            upload_arg: "esp8266:esp8266",
            help_link: "https://fr.wikipedia.org/wiki/ESP8266"
        },
        esp32: {
            description: "ESP32",
            cpu: "esp32",
            speed: "921600",
            digital: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownDigital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            PWM: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownPWM: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            analog: ["36", "39", "32", "33", "34", "35"],
            dropdownAnalog: [["A0", "36"], ["A1", "39"], ["A2", "32"], ["A3", "33"], ["A4", "34"], ["A5", "35"]],
            I2C: ["21", "22"],
            SPI: [["15 (HSPI CS0)", "15"], ["13 (HSPI MOSI)", "13"], ["12 (HSPI MISO)", "12"], ["14 (HSPI CLK)", "14"], ["5 (VSPI CS0)", "5"], ["23 (VSPI MOSI)", "23"], ["19 (VSPI MISO)", "19"], ["18 (VSPI CLK)", "18"]],
            interrupt: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            picture: "media/boards/esp32.jpg",
            miniPicture: "media/boards/esp32_mini.jpg",
            miniPicture_hor: "media/boards/esp32_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["Rx0 ; Tx0", "3 ; 1"], ["Rx1 ; Tx1", "28 ; 29"], ["Rx2 ; Tx2", "16 ; 17"]],
            upload_arg: "esp32:esp32:esp32",
            help_link: "https://en.wikipedia.org/wiki/ESP32"
        },
        peguino_uno_nano: {
            description: "Peguino Uno Nano",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/peguino_uno_nano.jpg",
            miniPicture: "media/boards/peguino_uno_nano_mini.jpg",
            miniPicture_hor: "media/boards/peguino_uno_nano_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://www.peguino.com/chat/thread-40.html"
        },
        peguino_uno_esp32: {
            description: "Peguino Uno ESP32",
            cpu: "esp32",
            speed: "921600",
            digital: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownDigital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            PWM: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownPWM: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            analog: ["36", "39", "32", "33", "34", "35"],
            dropdownAnalog: [["A0", "36"], ["A1", "39"], ["A2", "32"], ["A3", "33"], ["A4", "34"], ["A5", "35"]],
            I2C: ["21", "22"],
            SPI: [["15 (HSPI CS0)", "15"], ["13 (HSPI MOSI)", "13"], ["12 (HSPI MISO)", "12"], ["14 (HSPI CLK)", "14"], ["5 (VSPI CS0)", "5"], ["23 (VSPI MOSI)", "23"], ["19 (VSPI MISO)", "19"], ["18 (VSPI CLK)", "18"]],
            interrupt: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            picture: "media/boards/peguino_uno_esp32.jpg",
            miniPicture: "media/boards/peguino_uno_esp32_mini.jpg",
            miniPicture_hor: "media/boards/peguino_uno_esp32_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["Rx0 ; Tx0", "3 ; 1"], ["Rx1 ; Tx1", "28 ; 29"], ["Rx2 ; Tx2", "16 ; 17"]],
            upload_arg: "esp32:esp32:esp32",
            help_link: "https://www.peguino.com/chat/thread-39.html"
        },
        kit_microbit: {
            description: "Micro:bit",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/kit_microbit.jpg",
            miniPicture: "media/boards/kit_microbit_mini.jpg",
            miniPicture_hor: "media/boards/kit_microbit_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://microbit.org/fr/guide/features/"
        },
        kit_microfeux: {
            description: "Micro-feux Jeulin",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/kit_microfeux.jpg",
            miniPicture: "media/boards/kit_microfeux_mini.jpg",
            miniPicture_hor: "media/boards/kit_microfeux_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.qwant.com/?q=microfeux%20jeulin&t=all"
        },
        //20191010
        kit_microsaurus: {
            description: "MicroSaurus",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/kit_microsaurus.jpg",
            miniPicture: "media/boards/kit_microsaurus_mini.jpg",
            miniPicture_hor: "media/boards/kit_microsaurus_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["Rx ; Tx", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: " https://meuse.co.jp/eshop/cog/cog_tutorial_index/"
        },
        kit_micromachine: {
            description: "MicroMachine",
            cpu: "esp32",
            speed: "115200",
            digital: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownDigital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            PWM: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownPWM: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            analog: ["36", "39", "32", "33", "34", "35"],
            dropdownAnalog: [["A0", "36"], ["A1", "39"], ["A2", "32"], ["A3", "33"], ["A4", "34"], ["A5", "35"]],
            I2C: ["21", "22"],
            SPI: [["15 (HSPI CS0)", "15"], ["13 (HSPI MOSI)", "13"], ["12 (HSPI MISO)", "12"], ["14 (HSPI CLK)", "14"], ["5 (VSPI CS0)", "5"], ["23 (VSPI MOSI)", "23"], ["19 (VSPI MISO)", "19"], ["18 (VSPI CLK)", "18"]],
            interrupt: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            picture: "media/boards/kit_micromachine.jpg",
            miniPicture: "media/boards/kit_micromachine_mini.jpg",
            miniPicture_hor: "media/boards/kit_micromachine_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["Rx0 ; Tx0", "3 ; 1"], ["Rx1 ; Tx1", "28 ; 29"], ["Rx2 ; Tx2", "16 ; 17"]],
            upload_arg: "esp32:esp32:esp32",
            help_link: "https://meuse.co.jp/eshop/cog/cog_tutorial_index/"
        },
        //20191010,
        kit_otto_diy: {
            description: "Otto DIY",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/kit_otto_diy.jpg",
            miniPicture: "media/boards/kit_otto_diy_mini.jpg",
            miniPicture_hor: "media/boards/kit_otto_diy_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://wikifactory.com/+OttoDIY/otto-diy/file/Instruction%20manual/OttoDIY_Manual_V9.pdf"
        },
        kit_peguino_bot1: {
            description: "Peguino Bot 1",
            cpu: "esp32",
            speed: "921600",
            digital: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownDigital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            PWM: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            dropdownPWM: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"], ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]],
            analog: ["36", "39", "32", "33", "34", "35"],
            dropdownAnalog: [["A0", "36"], ["A1", "39"], ["A2", "32"], ["A3", "33"], ["A4", "34"], ["A5", "35"]],
            I2C: ["21", "22"],
            SPI: [["15 (HSPI CS0)", "15"], ["13 (HSPI MOSI)", "13"], ["12 (HSPI MISO)", "12"], ["14 (HSPI CLK)", "14"], ["5 (VSPI CS0)", "5"], ["23 (VSPI MOSI)", "23"], ["19 (VSPI MISO)", "19"], ["18 (VSPI CLK)", "18"]],
            interrupt: ["1", "2", "3", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
            picture: "media/boards/kit_peguino_bot1.jpg",
            miniPicture: "media/boards/kit_peguino_bot1_mini.jpg",
            miniPicture_hor: "media/boards/kit_peguino_bot1_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["Rx0 ; Tx0", "3 ; 1"], ["Rx1 ; Tx1", "28 ; 29"], ["Rx2 ; Tx2", "16 ; 17"]],
            upload_arg: "esp32:esp32:esp32",
            help_link: "https://www.peguino.com/chat/thread-65.html"
        },
        kit_petitbot: {
            description: "Petit Bot",
            cpu: "",
            speed: "",
            digital: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
            dropdownDigital: [["D0", "D0"], ["D1", "D1"], ["D2", "D2"], ["D3", "D3"], ["D4", "D4"], ["D5", "D5"], ["D6", "D6"], ["D7", "D7"], ["D8", "D8"]],
            PWM: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
            dropdownPWM: [["D0", "D0"], ["D1", "D1"], ["D2", "D2"], ["D3", "D3"], ["D4", "D4"], ["D5", "D5"], ["D6", "D6"], ["D7", "D7"], ["D8", "D8"]],
            analog: ["A0"],
            dropdownAnalog: [["A0", "A0"]],
            I2C: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
            SPI: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
            interrupt: ["D2", "D3"],
            picture: "media/boards/kit_petitbot.jpg",
            miniPicture: "media/boards/kit_petitbot_mini.jpg",
            miniPicture_hor: "media/boards/kit_petitbot_mini_hor.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["Rx ; Tx", "0"]],
            upload_arg: "B:\LiberkeyLivet\MyApps\arduino\portable\packages\esp8266\tools\esptool\0.4.8/esptool.exe -vv -cd nodemcu -cb 921600 -cp COM3 -ca 0x00000 -cf B:\LiberkeyLivet\MyApps\arduino\build/petitbot_v3.ino.bin ",
            help_link: "https://github.com/julienrat/petitbot/blob/master/manuel_tech_petitbot.pdf"
        },
        kit_robobox_1_1: {
            description: "mini-alarme v1",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box1.1.jpg",
            miniPicture: "media/boards/robobox_box1.1.jpg",
            miniPicture_hor: "media/boards/robobox_box1.1.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardUno"
        },
        kit_robobox_2_1: {
            description: "bras articulé v1",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box2.1.jpg",
            miniPicture: "media/boards/robobox_box2.1.jpg",
            miniPicture_hor: "media/boards/robobox_box2.1.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardUno"
        },
        kit_robobox_3_1: {
            description: "robot chien v1",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box3.1.jpg",
            miniPicture: "media/boards/robobox_box3.1.jpg",
            miniPicture_hor: "media/boards/robobox_box3.1.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardUno"
        },
        kit_robobox_4_1: {
            description: "robot voiture v1",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box4.1.jpg",
            miniPicture: "media/boards/robobox_box4.1.jpg",
            miniPicture_hor: "media/boards/robobox_box4.1.jpg",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:uno",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardUno"
        },
        kit_robobox_1_2: {
            description: "mini alarme v2",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box1.2.png",
            miniPicture: "media/boards/robobox_box1.2.png",
            miniPicture_hor: "media/boards/robobox_box1.2.png",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardNano"
        },
        kit_robobox_2_2: {
            description: "bras articulé v2",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box2.2.png",
            miniPicture: "media/boards/robobox_box2.2.png",
            miniPicture_hor: "media/boards/robobox_box2.2.png",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardNano"
        },
        kit_robobox_3_2: {
            description: "Arduino Nano ATmega328",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box3.2.png",
            miniPicture: "media/boards/robobox_box3.2.png",
            miniPicture_hor: "media/boards/robobox_box3.2.png",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardNano"
        },
        kit_robobox_4_2: {
            description: "Arduino Nano ATmega328",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box4.2.png",
            miniPicture: "media/boards/robobox_box4.2.png",
            miniPicture_hor: "media/boards/robobox_box4.2.png",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardNano"
        },
        kit_robobox_5_2: {
            description: "Arduino Nano ATmega328",
            cpu: "atmega328p",
            speed: "115200",
            digital: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
            dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
            PWM: ["3", "5", "6", "9", "10", "11"],
            dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
            analog: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
            dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
            /*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
            I2C: ["A4", "A5"],
            SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
            interrupt: ["2", "3"],
            picture: "media/boards/robobox_box5.2.png",
            miniPicture: "media/boards/robobox_box5.2.png",
            miniPicture_hor: "media/boards/robobox_box5.2.png",
            serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
            ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
            ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
            ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
            ['115200', '115200']],
            serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
            upload_arg: "arduino:avr:nano:cpu=atmega328old",
            help_link: "https://www.arduino.cc/en/Main/ArduinoBoardNano"
        }
    };
    // set default profile to arduino standard-compatible board
    Blockly.Arduino.profile.default = Blockly.Arduino.profile.arduino;

    /**
     * Arduino generator short name for
     * Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_
     * @type {!string}
     */
    Blockly.Arduino.DEF_FUNC_NAME = Blockly.Arduino.FUNCTION_NAME_PLACEHOLDER_;

    /**
     * Initialises the database of global definitions, the setup function, function
     * names, and variable names.
     * @param {Blockly.Workspace} workspace Workspace to generate code from.
     */
    Blockly.Arduino.init = function (workspace) {
        // Create a dictionary of definitions to be printed at the top of the sketch
        Blockly.Arduino.includes_ = Object.create(null);
        // Create a dictionary of global definitions to be printed after variables
        Blockly.Arduino.definitions_ = Object.create(null);
        // Create a dictionary of variables
        Blockly.Arduino.variables_ = Object.create(null);
        // Create a dictionary of functions from the code generator
        Blockly.Arduino.codeFunctions_ = Object.create(null);
        // Create a dictionary of functions created by the user
        Blockly.Arduino.userFunctions_ = Object.create(null);
        // Create a dictionary mapping desired function names in definitions_
        // to actual function names (to avoid collisions with user functions)
        Blockly.Arduino.functionNames_ = Object.create(null);
        // Create a dictionary of setups to be printed in the setup() function
        Blockly.Arduino.setups_ = Object.create(null);
        // Create a dictionary of pins to check if their use conflicts
        Blockly.Arduino.pins_ = Object.create(null);

        if (!Blockly.Arduino.variableDB_) {
            Blockly.Arduino.variableDB_ =
                new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
        } else {
            Blockly.Arduino.variableDB_.reset();
        }

        Blockly.Arduino.variableDB_.setVariableMap(workspace.getVariableMap());

        // // Iterate through to capture all blocks types and set the function arguments
        var varsWithTypes = Blockly.Arduino.StaticTyping.collectVarsWithTypes(workspace);
        Blockly.Arduino.StaticTyping.setProcedureArgs(workspace, varsWithTypes);

        // Set variable declarations with their Arduino type in the defines dictionary
        for (var varName in varsWithTypes) {
            if (Blockly.Arduino.getArduinoType_(varsWithTypes[varName]) != "array" &&
                Blockly.Arduino.getArduinoType_(varsWithTypes[varName]) != "undefined") {
                console.log(varName, 'varNamevarName');
                Blockly.Arduino.addVariable(varName,
                    Blockly.Arduino.getArduinoType_(varsWithTypes[varName]) + ' ' +
                    Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ';');
            }
        }
    };

    /**
     * Prepare all generated code to be placed in the sketch specific locations.
     * @param {string} code Generated main program (loop function) code.
     * @return {string} Completed sketch code.
     */
    Blockly.Arduino.finish = function (code) {
        // Convert the includes, definitions, and functions dictionaries into lists
        var includes = [],
            definitions = [],
            variables = [],
            functions = [];
        for (var name in Blockly.Arduino.includes_) {
            includes.push(Blockly.Arduino.includes_[name]);
        }
        if (includes.length) {
            includes.push('\n');
        }
        for (var name in Blockly.Arduino.variables_) {
            variables.push(Blockly.Arduino.variables_[name]);
        }
        if (variables.length) {
            variables.push('\n');
        }
        for (var name in Blockly.Arduino.definitions_) {
            definitions.push(Blockly.Arduino.definitions_[name]);
        }
        if (definitions.length) {
            definitions.push('\n');
        }
        for (var name in Blockly.Arduino.codeFunctions_) {
            functions.push(Blockly.Arduino.codeFunctions_[name]);
        }
        for (var name in Blockly.Arduino.userFunctions_) {
            functions.push(Blockly.Arduino.userFunctions_[name]);
        }
        if (functions.length) {
            functions.push('\n');
        }

        // userSetupCode added at the end of the setup function without leading spaces
        var setups = [''],
            userSetupCode = '';
        if (Blockly.Arduino.setups_['userSetupCode'] !== undefined) {
            userSetupCode = '\n' + Blockly.Arduino.setups_['userSetupCode'];
            delete Blockly.Arduino.setups_['userSetupCode'];
        }
        for (var name in Blockly.Arduino.setups_) {
            setups.push(Blockly.Arduino.setups_[name]);
        }
        if (userSetupCode) {
            setups.push(userSetupCode);
        }

        // Clean up temporary data
        delete Blockly.Arduino.includes_;
        delete Blockly.Arduino.definitions_;
        delete Blockly.Arduino.codeFunctions_;
        delete Blockly.Arduino.userFunctions_;
        delete Blockly.Arduino.functionNames_;
        delete Blockly.Arduino.setups_;
        delete Blockly.Arduino.pins_;
        Blockly.Arduino.variableDB_.reset();

        // var allDefs = includes.join('\n') + variables.join('\n') +
        //     definitions.join('\n') + functions.join('\n\n');
        // var setup = 'void setup() {' + setups.join('\n  ') + '\n}\n\n';
        // var loop = 'void loop() {\n  ' + code.replace(/\n/g, '\n  ') + '\n}';
        // return allDefs + setup + loop;
        var allDefs = includes.join('\n') + variables.join('\n') +
            definitions.join('\n');
        var setup = 'void setup() {' + setups.join('\n  ') + '\n}\n\n';
        var loop = 'void loop() {\n  ' + code.replace(/\n/g, '\n  ') + '\n}\n\n';
        return allDefs + setup + loop + functions.join('\n');
    };

    /**
     * Adds a string of "include" code to be added to the sketch.
     * Once a include is added it will not get overwritten with new code.
     * @param {!string} includeTag Identifier for this include code.
     * @param {!string} code Code to be included at the very top of the sketch.
     */
    Blockly.Arduino.addInclude = function (includeTag, code) {
        if (Blockly.Arduino.includes_[includeTag] === undefined) {
            Blockly.Arduino.includes_[includeTag] = code;
        }
    };

    /**
     * Adds a string of code to be declared globally to the sketch.
     * Once it is added it will not get overwritten with new code.
     * @param {!string} declarationTag Identifier for this declaration code.
     * @param {!string} code Code to be added below the includes.
     */
    Blockly.Arduino.addDeclaration = function (declarationTag, code) {
        if (Blockly.Arduino.definitions_[declarationTag] === undefined) {
            Blockly.Arduino.definitions_[declarationTag] = code;
        }
    };

    /**
     * Adds a string of code to declare a variable globally to the sketch.
     * Only if overwrite option is set to true it will overwrite whatever
     * value the identifier held before.
     * @param {!string} varName The name of the variable to declare.
     * @param {!string} code Code to be added for the declaration.
     * @param {boolean=} overwrite Flag to ignore previously set value.
     * @return {!boolean} Indicates if the declaration overwrote a previous one.
     */
    Blockly.Arduino.addVariable = function (varName, code, overwrite) {
        var overwritten = false;
        if (overwrite || (Blockly.Arduino.variables_[varName] === undefined)) {
            Blockly.Arduino.variables_[varName] = code;
            overwritten = true;
        }
        return overwritten;
    };

    /**
     * Adds a string of code into the Arduino setup() function. It takes an
     * identifier to not repeat the same kind of initialisation code from several
     * blocks. If overwrite option is set to true it will overwrite whatever
     * value the identifier held before.
     * @param {!string} setupTag Identifier for the type of set up code.
     * @param {!string} code Code to be included in the setup() function.
     * @param {boolean=} overwrite Flag to ignore previously set value.
     * @return {!boolean} Indicates if the new setup code overwrote a previous one.
     */
    Blockly.Arduino.addSetup = function (setupTag, code, overwrite) {
        var overwritten = false;
        if (overwrite || (Blockly.Arduino.setups_[setupTag] === undefined)) {
            Blockly.Arduino.setups_[setupTag] = code;
            overwritten = true;
        }
        return overwritten;
    };

    /**
     * Adds a string of code as a function. It takes an identifier (meant to be the
     * function name) to only keep a single copy even if multiple blocks might
     * request this function to be created.
     * A function (and its code) will only be added on first request.
     * @param {!string} preferedName Identifier for the function.
     * @param {!string} code Code to be included in the setup() function.
     * @return {!string} A unique function name based on input name.
     */
    Blockly.Arduino.addFunction = function (preferedName, code) {
        if (Blockly.Arduino.codeFunctions_[preferedName] === undefined) {
            var uniqueName = Blockly.Arduino.variableDB_.getDistinctName(
                preferedName, Blockly.Generator.NAME_TYPE);
            Blockly.Arduino.codeFunctions_[preferedName] =
                code.replace(Blockly.Arduino.DEF_FUNC_NAME, uniqueName);
            Blockly.Arduino.functionNames_[preferedName] = uniqueName;
        }
        return Blockly.Arduino.functionNames_[preferedName];
    };

    /**
     * Description.
     * @param {!Blockly.Block} block Description.
     * @param {!string} pin Description.
     * @param {!string} pinType Description.
     * @param {!string} warningTag Description.
     */
    Blockly.Arduino.reservePin = function (block, pin, pinType, warningTag) {
        if (Blockly.Arduino.pins_[pin] !== undefined) {
            if (Blockly.Arduino.pins_[pin] != pinType) {
                block.setWarningText(Blockly.Msg.ARD_PIN_WARN1.replace('%1', pin)
                    .replace('%2', warningTag).replace('%3', pinType)
                    .replace('%4', Blockly.Arduino.pins_[pin]), warningTag);
            } else {
                block.setWarningText(null, warningTag);
            }
        } else {
            Blockly.Arduino.pins_[pin] = pinType;
            block.setWarningText(null, warningTag);
        }
    };

    /**
     * Naked values are top-level blocks with outputs that aren't plugged into
     * anything. A trailing semicolon is needed to make this legal.
     * @param {string} line Line of generated code.
     * @return {string} Legal line of code.
     */
    Blockly.Arduino.scrubNakedValue = function (line) {
        return line + ';\n';
    };

    /**
     * Encode a string as a properly escaped Arduino string, complete with quotes.
     * @param {string} string Text to encode.
     * @return {string} Arduino string.
     * @private
     */
    Blockly.Arduino.quote_ = function (string) {
        // TODO: This is a quick hack.  Replace with goog.string.quote
        string = string.replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\\n')
            .replace(/\$/g, '\\$')
            .replace(/'/g, '\\\'');
        return '\"' + string + '\"';
    };

    /**
     * Common tasks for generating Arduino from blocks.
     * Handles comments for the specified block and any connected value blocks.
     * Calls any statements following this block.
     * @param {!Blockly.Block} block The current block.
     * @param {string} code The Arduino code created for this block.
     * @return {string} Arduino code with comments and subsequent blocks added.
     * @this {Blockly.CodeGenerator}
     * @private
     */
    Blockly.Arduino.scrub_ = function (block, code) {
        if (code === null) { return ''; } // Block has handled code generation itself

        var commentCode = '';
        // Only collect comments for blocks that aren't inline
        if (!block.outputConnection || !block.outputConnection.targetConnection) {
            // Collect comment for this block.
            var comment = block.getCommentText();
            if (comment) {
                commentCode += this.prefixLines(comment, '// ') + '\n';
            }
            // Collect comments for all value arguments
            // Don't collect comments for nested statements
            for (var x = 0; x < block.inputList.length; x++) {
                if (block.inputList[x].type == Blockly.INPUT_VALUE) {
                    var childBlock = block.inputList[x].connection.targetBlock();
                    if (childBlock) {
                        var comment = this.allNestedComments(childBlock);
                        if (comment) {
                            commentCode += this.prefixLines(comment, '// ');
                        }
                    }
                }
            }
        }
        var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        var nextCode = this.blockToCode(nextBlock);
        return commentCode + code + nextCode;
    };

    /**
     * Generates Arduino Types from a Blockly Type.
     * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
     * @return {string} Arduino type for the respective Blockly input type, in a
     *     string format.
     * @private
     */
    Blockly.Arduino.getArduinoType_ = function (typeBlockly) {
        switch (typeBlockly.typeId) {
            case Blockly.Types.VOID.typeId:
                return 'void';
            case Blockly.Types.SHORT_NUMBER.typeId:
                return 'short';
            case Blockly.Types.NUMBER.typeId:
                return 'int';
            case Blockly.Types.LARGE_NUMBER.typeId:
                return 'long';
            case Blockly.Types.DECIMAL.typeId:
                return 'float';
            case Blockly.Types.TEXT.typeId:
                return 'String';
            case Blockly.Types.CHARACTER.typeId:
                return 'char';
            case Blockly.Types.BOOLEAN.typeId:
                return 'bool';
            case Blockly.Types.NULL.typeId:
                return 'void';
            case Blockly.Types.UNDEF.typeId:
                return 'undefined';
            case Blockly.Types.CHILD_BLOCK_MISSING.typeId:
                // If no block connected default to int, change for easier debugging
                //return 'ChildBlockMissing';
                return 'int';
            case Blockly.Types.ARRAY.typeId:
                return 'array';
            default:
                return 'Invalid Blockly Type';
        }
    };

    /** Used for not-yet-implemented block code generators */
    Blockly.Arduino.noGeneratorCodeInline = function () {
        return ['', Blockly.Arduino.ORDER_ATOMIC];
    };

    /** Used for not-yet-implemented block code generators */
    Blockly.Arduino.noGeneratorCodeLine = function () { return ''; };
}

export default LoadArduinoDefine;
