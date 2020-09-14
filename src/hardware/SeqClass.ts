interface ISeqData {
    resolve: any;
    reject: any;
    exec: () => Promise<any>;
}

export default class SeqClass {
    private lock: boolean = false;
    private seq: ISeqData[] = [];

    public seqDo<T>(exec: () => Promise<T>) {
        return new Promise<T>(async (resolve, reject) => {
            this.seq.push({
                resolve,
                reject,
                exec,
            });
            if (this.lock) {
                return;
            }
            this.lock = true;
            while (true) {
                const item = this.seq.shift();
                if (!item) {
                    break;
                }
                try {
                    const results = await item.exec();
                    item.resolve(results);
                } catch (e) {
                    item.reject(e);
                }
            }
            this.lock = false;
        });
    }
}
