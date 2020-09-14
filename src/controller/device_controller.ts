import { EventBus } from '../util/eventbus';
import { AgentEvent, IDEEvent } from '../util/events';
import { SerialPort } from "@microduino/iron-man-connect/lib";
import { UnConnectedSerialportDriver } from "@microduino/iron-man-connect/lib/driver/UnConnectedDriver";
import { HANDLE_BURNING } from "../util/constance";

class DeviceController {
  private static instance: DeviceController;

  private defaultBaudRate = 57600;

  private agent: any;

  private device: string = '';

  private kit: string = 'fingerBit'; // 'fingerEsp32';

  private hardWareList: UnConnectedSerialportDriver[] | undefined;

  private connectedHardware: any;

  private deviceInterval : any;

  // eslint-disable-next-line no-empty-function
  private constructor() {
  }

  public static getInstance(): DeviceController {
    if (!DeviceController.instance) {
      DeviceController.instance = new DeviceController();
    }
    return DeviceController.instance;
  }

  public findAgent = () => {
    this.checkReady();
  }

  private checkReady = () => {
    EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG],'正在搜索扣叮设备助手...');
    const isReady = SerialPort.isReady();
    EventBus.emit(AgentEvent[AgentEvent.AGENT_FOUND], isReady);
    if (isReady) {
      this.startSerialPortScan();
    }
  }

  public setDevice = (device: string) => {
    this.close();
    this.device = device;
  }

  public setKit = (kit: string) => {
    this.close();
    this.kit = kit;
  }

  public connectHardware = async () => {
    if (this.hardWareList) {
      try {
        EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], `正在连接，请稍候...`);
        const instance = this.hardWareList.find((device) => device.name === this.device);
        // @ts-ignore
        this.connectedHardware = await instance.openWithKit(this.kit, this.defaultBaudRate);
        this.connectedHardware.once('close', this.close);
        if (this.deviceInterval) {
          clearInterval(this.deviceInterval);
        }
        EventBus.emit(AgentEvent[AgentEvent.DEVICE_CONNECTED], true);
        EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], `${this.device} 连接成功！`);
      } catch (error) {
        EventBus.emit(AgentEvent[AgentEvent.DEVICE_CONNECTED], false);
        EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], `${this.device} 连接失败！\n请确认设备电源已打开, 并重试.`);
        console.error(error)
      }
    }
  }

  public uploadCode = () => {
    EventBus.emit(IDEEvent[IDEEvent.UPLOAD_CODE]);
  }

  public handleBurning = async (code: any) => {
    if (this.connectedHardware) {
      try {
        EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], '正在编译，请稍候...');
        const handler = HANDLE_BURNING[this.kit];
        await handler(this.connectedHardware, code, this.setProgress);
      } catch (error) {
        let message = '';
        switch (error.message) {
          case 'send timeout':
          case 'time out':
            message = '连接超时，请重试';
            break;
          case 'burn error':
            message = '烧录失败，请重试';
            break;
          case 'not support device':
            message = '对不起，不支持此类设备';
            break;
        }
        if (error.stderr) {
            message = '编译失败！';
        }
        EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], message);
      }
    } else {
      EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], '没有检测到设备，请先确保设备已连接，再进行上传程序操作~');
    }
  }

  private close = async () => {
    if (this.connectedHardware) {
      this.connectedHardware.close();
      EventBus.emit(AgentEvent[AgentEvent.DEVICE_CONNECTED], false);
      EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], `${this.device} 连接已断开！`);
      this.startSerialPortScan();
    }
  }

  private setProgress = (progress: number) => {
    let message = '';
    if (progress === 0) {
      message = '开始上传...'
    } else if (progress === 100) {
      message = '烧录成功！'
    } else {
      message = `正在烧录...${progress}%`;
    }
    EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], message);
  }

  public startSerialPortScan = async () => {
    this.deviceInterval = setInterval( async () => {
      const list = await SerialPort.list();
      if (!this.hardWareList || list.length != this.hardWareList.length) {
        this.hardWareList = list;
        EventBus.emit(AgentEvent[AgentEvent.DEVICELIST_CHANGED], this.hardWareList);
        EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], `已搜索到设备数量: ${this.hardWareList.length} !`);
      }
    }, 1000);
  }

}

const deviceController: DeviceController = DeviceController.getInstance();
export default deviceController;
