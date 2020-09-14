export interface Device {
  name: string;
  deviceId: string;
  manufacturer: string;
  serialNumber: string;
  pnpId: string;
  systemLocation: string;
  vendorId: number;
  productId: number;
}

export type DeviceList = Array<Device>;
