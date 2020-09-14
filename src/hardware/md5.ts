import * as crypto from "crypto";

export default (str: string, subNumber: number) => {
    if (!str) {
        return "";
    }
    const md5sum = crypto.createHash("md5");
    md5sum.update(str);
    let results = md5sum.digest("hex");
    if (subNumber) {
        results = results.substr(0, subNumber);
    }
    return results;
};
