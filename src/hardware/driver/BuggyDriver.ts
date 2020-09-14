import {MCookieBleDriver, MCookieDriver} from "./MCookieDriver";
import {Driver} from "../interface";

export class BuggyDriver extends MCookieDriver implements Driver {

}

export class BuggyBleDriver extends MCookieBleDriver implements Driver {

}
