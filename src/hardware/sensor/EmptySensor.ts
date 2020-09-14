import {Sensor} from "../interface";
import {IronMan} from "../driver/IronManDriver";

const ME = 0x7F + 0x7F;

export default class EmptySensor implements Sensor {
    public static isMe(num: number) {
        return num === ME;
    }

    constructor(driver: IronMan, index: number) {

    }
}
