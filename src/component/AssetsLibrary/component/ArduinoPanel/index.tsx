import React, { Component } from 'react';
import { Button, Select } from '@tencent/eui';
import deviceController from '../../../../controller/device_controller';
import { EventBus } from '../../../../util/eventbus';
import {AgentEvent, IDEEvent} from '../../../../util/events';
import './index.less';
import codingController from "../../../../controller/coding_controller";

const prefixCls = 'connection';

interface ArduinoPanelProps {
  connectDevices: any[],
}

interface ArduinoPanelState {
  uploadVisible: boolean,
  uploadEnable: boolean,
  agentFined: boolean,
  connected: boolean,
  closed: boolean,
  selectedDevice?: string
}

class ArduinoPanel extends Component<ArduinoPanelProps, ArduinoPanelState> {

    private uploadRequest = false;

    constructor(props: ArduinoPanelProps) {
    super(props);
    this.state = {
      uploadVisible: true,
      uploadEnable: true,
      agentFined: false,
      connected: false,
      closed: false
    };
  }

  componentDidMount() {
    EventBus.on(AgentEvent[AgentEvent.AGENT_FOUND], this.findAgent);
    EventBus.on(AgentEvent[AgentEvent.DEVICE_CONNECTED], this.onDeviceConnected);
    EventBus.on(IDEEvent[IDEEvent.VISIBLE_UPLOAD], this.onVisibleUpload);
    EventBus.on(IDEEvent[IDEEvent.PAID_USER], this.onConfirmPaidUser);
  }

  componentWillUnmount() {
    EventBus.off(AgentEvent[AgentEvent.AGENT_FOUND], this.findAgent);
    EventBus.off(AgentEvent[AgentEvent.DEVICE_CONNECTED], this.onDeviceConnected);
    EventBus.off(IDEEvent[IDEEvent.VISIBLE_UPLOAD], this.onVisibleUpload);
    EventBus.off(IDEEvent[IDEEvent.PAID_USER], this.onConfirmPaidUser);
  }

  render() {
    const { connectDevices } = this.props;
    const devices = connectDevices.map((device) => device.value);
    return (
      <div className={`${prefixCls}`}>
        {devices.length > 0
          ? (
            <div className={`${prefixCls}-item connectioned`}>
              <i className="icon icon-link" />
              <div className={`${prefixCls}-item-port`}>
                <span className={`${prefixCls}-item-port-label`}>设备名称:</span>
                <Select className={`${prefixCls}-item-port-select`}
                        value={this.state.selectedDevice ? this.state.selectedDevice : devices[0]} options={devices}
                        onChange={this.onSelectedDeviceChanged} />
              </div>
              {!this.state.connected ? <Button className={`${prefixCls}-item-btn`} size="small"
                                              onClick={this.onConnectClicked}
                                              text="连接设备" /> : null}
              {this.state.connected && this.state.uploadVisible ? <Button className={`${prefixCls}-item-btn`}
                                                  disabled = {!this.state.uploadEnable} size="small"
                                                  onClick={this.onUploadClicked} text="上传到设备" /> : null}
            </div>
          )
          : (
            <div className={`${prefixCls}-item unconnection`}>
              <i className="icon icon-unlink" />
              <p className={`${prefixCls}-item-tips`}>请连接设备</p>
              {this.state.agentFined ? null : <Button className={`${prefixCls}-item-btn`} size="small" onClick={this.connectDevice} text="连接硬件设备助手" />}
            </div>
          )}

      </div>
    );
  }

  findAgent = (status: boolean) => {
    this.setState({
      agentFined: status,
    });
  }

  onDeviceConnected = (status: boolean) => {
    this.setState({
      connected: status
    });
  }

  connectDevice = async () => {
    deviceController.findAgent();
    /*if (this.state.agentFined) {
      await deviceController.startSerialPortScan();
    } else {
      deviceController.findAgent();
    }*/
  }

  onSelectedDeviceChanged = (device: any) => {
    if (device) {
      this.setState({
        selectedDevice: device.value,
      }, () => {
        deviceController.setDevice(device.value);
      });
    }
  }

  onConnectClicked = async () => {
    // connect
    await deviceController.connectHardware();
  }

  onEnableUpload = (enable: boolean) => {
    this.setState({uploadEnable: enable});
  }

  onVisibleUpload = (visible: boolean) => {
    this.setState({uploadVisible: visible});
  }

  onUploadClicked = () => {
    if (this.state.uploadEnable) {
      codingController.getPaidHardware();
      this.onEnableUpload(false);
      this.uploadRequest = true;
      setTimeout(() => {
        this.onEnableUpload(true);
      }, 10000);
    }
  }

  onConfirmPaidUser = async (paid: boolean) => {
      if (this.uploadRequest && paid) {
        // compile and upload
        await deviceController.uploadCode();
        this.uploadRequest = false;
      }
    }

}

export default ArduinoPanel;
