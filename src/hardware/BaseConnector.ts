import {EventEmitter} from "events";

export default class BaseConnector extends EventEmitter {
    public connectionInfo: any;

    constructor(info: any) {
        super();
        this.connectionInfo = info;
    }
}
