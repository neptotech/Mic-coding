import {MP_WAIT_01, MP_WAIT_02_04, MP_WAIT_03} from "../burnConstance";

let inRawRepl = false;

const waitUntilMessageEnd = (data: any) => {
    return new Promise(resolve => {
        const _strData = Buffer.from(data).toString().trim();
        // console.log("waitUntilMessageEnd inRawRepl", _strData, data);

        if (_strData.endsWith(MP_WAIT_01)) {
            inRawRepl = true;
            resolve(_strData)
        } else if (inRawRepl) {
            if (_strData.endsWith(MP_WAIT_02_04)) {
                inRawRepl = false
            }
            resolve(_strData)
        } else {
            if (_strData.endsWith(MP_WAIT_02_04) ||
                _strData.endsWith(MP_WAIT_03)) {
                resolve(_strData)
            }
        }
    })
};

export default (resolve: any) => async (data: Buffer) => {
    let ret = await waitUntilMessageEnd(data);
    if (ret) {
        resolve(ret);
    }
};
