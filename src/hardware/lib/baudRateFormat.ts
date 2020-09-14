import {BAUD_RATE} from "../interface";

export default (baudRate: BAUD_RATE) => [(baudRate / 100) & 0xFF, (baudRate / 100) >> 8];
