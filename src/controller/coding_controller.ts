import { IFrameMessenger } from '../util/IFrameMessenger';
import {IFrameProtocolHardware, IFrameProtocolIde, IFrameRsp} from '../config/IFrameProtocol';
import { EventBus } from '../util/eventbus';
import { IDEEvent } from '../util/events';
import store from '../store';
import { BlocklyToArduino } from '../blockly/codeGenerator';
import { ArduinoToolBox } from '../blockly/toolboxGenerator';
import BlockDefineArduino from '../../dist/blockly_arduino.txt';
import {SUPPORT_KITS} from "../util/constance";

declare type iframeMessage = {
  backString: string,
  cmd: string,
  data: string
};

const preLogName = '[Arduino IDE][IFrameController]';

class CodingController {
  public iframeMessenger : IFrameMessenger;

  private static instance: CodingController;

  private inited : boolean = false;

  private constructor() {
    this.iframeMessenger = new IFrameMessenger('ide', 'hardware');
  }

  public init() {
    this.iframeMessenger.listen(this.handleReceiveFromLab.bind(this));
    this.iframeMessenger.addTarget(parent, 'hardware-lab');
    this.inited = true;
  }

  public isInited() {
    return this.inited;
  }

  private async handleReceiveFromLab(receiveData: iframeMessage) {
    console.log(`${preLogName}[handleReceiveFromLab] receiveData:${receiveData}`);
    switch (receiveData.cmd) {
      case IFrameProtocolIde.IDE_IMPORT:
        this.onImportIdeData(receiveData.data);
        break;
      case IFrameProtocolIde.IDE_EXPORT:
        this.onExportIdeData();
        break;
      case IFrameProtocolIde.IDE_NEW:
        this.onNewProject();
        break;
      case IFrameProtocolIde.IDE_EXPORT_COVER:
        this.exportProductionCover();
        break;
      case IFrameProtocolIde.IDE_LOGIN_CHANGED:
        this.onLoginChanged();
        break;
      case IFrameProtocolIde.IDE_SET_TOOLBOX:
        this.taskSetToolBox(receiveData.data);
        break;
      case IFrameProtocolIde.IDE_GET_CODE:
        this.onGetCode();
        break;
      case IFrameProtocolIde.IDE_GET_TOOLBOX:
        this.onGetToolBox();
        break;
      case IFrameProtocolIde.IDE_WORKSPACE_TO_CODE:
        this.onWorkSpaceToCode(receiveData.data);
        break;
      case IFrameProtocolIde.IDE_BLOCKS_DEFINE:
        this.onGetBlocksDefine();
        break;
      case IFrameProtocolIde.IDE_CHANGE_KIT:
        this.onChangeKit(receiveData.data);
        break;
      case IFrameProtocolIde.IDE_UPLOAD_BUTTON_VISIBLE:
        this.onUploadButtonVisible(receiveData.data);
        break;
      case IFrameProtocolHardware.IDE_PAID_HARDWARE_RSP:
        this.onGetPaidHardware(receiveData.data);
        break;

      default:
        break;
    }
  }

  public static getInstance(): CodingController {
    if (!CodingController.instance) {
      CodingController.instance = new CodingController();
    }
    return CodingController.instance;
  }

  private onExportIdeData() {
    console.log(`${preLogName}[onExportIdeData]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_EXPORT, store.EditorStore.blocklyWorkspace, IFrameRsp.RSP_IDE_EXPORT);
  }

  private onImportIdeData(data: any) {
    console.log(`${preLogName}[onImportIdeData]`);
    EventBus.emit(IDEEvent[IDEEvent.IMPORT_PROJECT], data);
  }

  private async exportProductionCover() {
    console.log(`${preLogName}[exportProductionCover]`);
    const imageBase64 = 'data:image/png;base64,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';
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_EXPORT_COVER, imageBase64, IFrameRsp.RSP_IDE_EXPORT_COVER);
  }

  private onLoginChanged() {
    console.log(`${preLogName}[onLoginChanged]`);
  }

  private onNewProject() {
    console.log(`${preLogName}[onNewProject]`);
    EventBus.emit(IDEEvent[IDEEvent.NEW_PROJECT]);
  }

  private taskSetToolBox(toolbox: string) {
    console.log(`${preLogName}[taskSetToolBox]`);
    EventBus.emit(IDEEvent[IDEEvent.SET_TOOLBOX], toolbox);
  }

  private async taskGetCode() {
    console.log(`${preLogName}[taskGetCode]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_GET_CODE, store.EditorStore.blocklyWorkspace, IFrameRsp.RSP_IDE_EXPORT);
  }

  private ideContentChanged() {
    console.log(`${preLogName}[ideContentChanged]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_CONTENT_CHANGED, '');
  }

  private ideRun() {
    console.log(`${preLogName}[ideRun]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_RUN_CODE, '');
  }

  private ideStageFullScreen() {
    console.log(`${preLogName}[ideStageFullScreen]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_STAGE_FULLSCREEN, '');
  }

  private ideModeChanged() {
    console.log(`${preLogName}[ideModeChanged]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_MODE_CHANGED, '');
  }

  private idePropertyChanged() {
    console.log(`${preLogName}[idePropertyChanged]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_PROPERTY_CHANGED, '');
  }

  private ideRequireLogin() {
    console.log(`${preLogName}[ideRequireLogin]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_REQUIRE_LOGIN, '');
  }

  private onGetCode() {
    console.log(`${preLogName}[onGetCode]`);
    const code = store.EditorStore.code;
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_GET_TOOLBOX, code, IFrameRsp.RSP_IDE_GET_CODE);
  }

  private onGetToolBox() {
    console.log(`${preLogName}[onGetToolBox]`, 'onGetToolBox');
    const toolbox = ArduinoToolBox;
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_GET_TOOLBOX, toolbox, IFrameRsp.RSP_IDE_GET_TOOLBOX);
  }

  private onWorkSpaceToCode(workSpace: string) {
    console.log(`${preLogName}[onGetWorkSpaceCode]`);
    const code = BlocklyToArduino(workSpace);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_WORKSPACE_TO_CODE, code, IFrameRsp.RSP_IDE_WORKSPACE_TO_CODE);
  }

  private onGetBlocksDefine() {
    console.log(`${preLogName}[onGetBlocksDefine]`);
    const blocksDefine = BlockDefineArduino;
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_BLOCKS_DEFINE, blocksDefine, IFrameRsp.RSP_IDE_BLOCKS_DEFINE);
  }

  private onChangeKit(kit: string) {
    console.log(`${preLogName}[onChangeKit]`);
    // @ts-ignore
    EventBus.emit(IDEEvent[IDEEvent.CHANGE_KIT], SUPPORT_KITS[kit]);
  }

  private onUploadButtonVisible(visibleStr: string) {
    EventBus.emit(IDEEvent[IDEEvent.VISIBLE_UPLOAD], visibleStr === 'false' ? false : true);
  }

  private onGetPaidHardware(result: string) {
    const info = JSON.parse(result);
    if (info.hardware === store.EditorStore.subType) {
      EventBus.emit(IDEEvent[IDEEvent.PAID_USER], info.paid);
    } else {
      console.error(`${preLogName}[onGetPaidHardware] not find mine hardware, result:${result}`);
    }
  }

  public getPaidHardware() {
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolHardware.IDE_PAID_HARDWARE, store.EditorStore.subType);
  }

  public notifyHostRunCode() {
    console.log('${preLogName}[notifyHostRunCode]');
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_RUN_CODE, '');
  }

  public notifyHostBlockChanged(workSpace: string) {
    console.log(`${preLogName}[notifyHostBlockChanged]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_BLOCK_CHANGED, workSpace);
  }

  public notifyHostCodeChanged(code: string) {
    console.log(`${preLogName}[notifyHostCodeChanged]`);
    CodingController.getInstance().iframeMessenger.sendMessage(IFrameProtocolIde.IDE_CODE_CHANGED, code);
  }
}

const codingController: CodingController = CodingController.getInstance();
export default codingController;
