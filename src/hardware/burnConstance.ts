export const CRC_EOP = 0x20; // 'SPACE'
export const STK_GET_SYNC = 0x30; // '0'
export const STK_READ_SIGN = 0x75; // 'u'
export const STK_OK = 0x10;
export const STK_INSYNC = 0x14; // ' '
export const STK_SET_DEVICE = 0x42; // 'B'
export const STK_ENTER_PROGMODE = 0x50; // 'P'
export const STK_LEAVE_PROGMODE = 0x51; // 'Q'
export const STK_LOAD_ADDRESS = 0x55; // 'U'
export const STK_PROG_PAGE = 0x64; // 'd'

export const RESET = 0xA5;

export const TYPE_CORE = "core";
export const TYPE_CORE_PLUS = "core+";
export const TYPE_CORE_PLUS_3V3 = "core+3v3";

export const BURN_DEVICE_TYPE_CORE = [0x1E, 0x95, 0x0F];
export const BURN_DEVICE_TYPE_CORE_PLUS = [0x1E, 0x96, 0x0A];

export const BURN_DEVICE_TYPE_CORE_PAGESIZE = 128;
export const BURN_DEVICE_TYPE_CORE_PLUS_PAGESIZE = 256;
export const TYPE_CORE_PLUS_3V3_PAGESIZE = BURN_DEVICE_TYPE_CORE_PLUS_PAGESIZE;

export const burnSetDevice = (pageSize: number) => [
    STK_SET_DEVICE,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    (pageSize >> 8) & 0xFF,
    pageSize & 0xFF,
    0,
    0,
    0,
    0,
    0,
    0,
    CRC_EOP,
];

export const MP_WAITING_INTERVAL = 100   //ms
export const MP_WAITING_SOFT_REBOOT = 4000  //ms

export const MP_RETURN = 0x0d; // '\r'
export const MP_LINE = 0x0a; // '\n'
export const MP_CTRL_A = 0x01;
export const MP_CTRL_B = 0x02;
export const MP_CTRL_C = 0x03;
export const MP_CTRL_D = 0x04;

export const MP_WAIT_01 = 'raw REPL; CTRL-B to exit\r\n>';
export const MP_WAIT_03 = '>>>';
export const MP_WAIT_02_04 = 'Type "help()" for more information.\r\n>>>';
export const MP_WAIT_OK = 'OK\r\n>';

export const MAIN_PY = 'main.py';

export const CMD_PUT_SEQUCNES = (fileName: string) => {
    return [
        `data = [\n`,
        // Add code data in bin array. related implement in "putFile" function in Esp32Driver
        `]\n`,
        `code = bytearray(data)\n`,
        `f = open('${fileName}', 'wb')\n`,
        `f.write(code)\n`,
        'f.close()\n'
    ]
};
