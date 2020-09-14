import {STK_INSYNC, STK_OK} from "../burnConstance";

let stkInSync = false;
let results: any = [];

export default (resolve: any) => (data: Buffer) => {
    data.forEach((d) => {
        if (stkInSync) {
            if (d === STK_OK) {
                resolve(results);
                results = [];
                stkInSync = false;
            } else {
                results.push(d);
            }
        } else if (d === STK_INSYNC) {
            stkInSync = true;
            results = [];
        }
    });
};
