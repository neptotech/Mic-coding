import {Sensor} from "../interface";
import {IronMan} from "../driver/IronManDriver";

export default class UnknownMatrixSensor implements Sensor {
    private readonly driver: IronMan;
    private readonly index: number;

    public static isMe(num: number) {
        return true;
    }

    constructor(driver: IronMan, index: number) {
        this.driver = driver;
        this.index = index;
    }

    public write(data: number[]) {
        return this.driver.write([this.index, ...data]);
    }

    public read() {
        return this.driver.read([this.index]);
    }
}
