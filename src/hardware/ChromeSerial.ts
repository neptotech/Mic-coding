declare var chrome: any;

interface IDriverInfo {
    device: string;
    productName: string;
    manufacturerName: string;
    serialNumber: string;
    version: string;
    vendorId: string;
    productId: string;
}

export default class ChromeSerial {
    public static getDeviceList(): Promise<IDriverInfo[]> {
        return new Promise((resolve) => {
            chrome.usb.getDevices({}, (infoList: IDriverInfo[]) => {
                resolve(infoList);
            });
        });
    }
}
