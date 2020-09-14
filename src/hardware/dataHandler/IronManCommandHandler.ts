let start = false;
let results: any = [];

const START = 0xFA;
const END = 0xFD;

export default (resolve: any) => (data: Buffer) => {
    data.forEach((d) => {
        if (start) {
            results.push(d);
            if (d === END) {
                resolve(results);
                results = [];
                start = false;
            }
        } else if (d === START) {
            start = true;
            results = [d];
        }
    });
};
