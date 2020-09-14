import EcConsole from '@tencent/ec-console';
import React, { Component } from 'react';
import deviceController from '../../controller/device_controller';
import AssetsLibrary from '../AssetsLibrary';
import { DeviceList } from '../../util/device';
import { EventBus } from '../../util/eventbus';
import {
  AgentEvent, IDEEvent,
} from '../../util/events';

interface SidebarProps {

}

interface SidebarState {
  deviceList: SelectOptions,
  selectedDevice?: string
}

class Sidebar extends Component<SidebarProps, SidebarState> {
  private refConsole: any = React.createRef();

  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      deviceList: [],
      selectedDevice: ''
    };
  }

  render() {
    return (
      <div className="layout-aside" style={{ width: '400px' }}>
        <div className="stage-view stage-view--assets">
          <div className="stage-view-hd">
            <h3 className="stage-view-title">设备</h3>
          </div>
          <div className="stage-view-bd">
            <AssetsLibrary options={this.state.deviceList} />
          </div>
        </div>

        <div className="stage-view stage-view--text">
          <div className="stage-view-hd">
            <h3 className="stage-view-title">
              <i className="icon icon-output-text" />
              文本输出区
            </h3>
            <h3 className="stage-view-tool">
              <a href="javascript:void(0)" className="debug-console-clear" onClick={() => { this.refConsole.current!.clear(); }}>
                <i className="icon icon-delete" />
              </a>
            </h3>
          </div>
          <div className="debug-console">
            <div className="debug-console-bd">
              <EcConsole
                isSpinnerVisible
                isSpinnerLoading={false}
                spinnerText=""
                onInput={this.onInput}
                ref={this.refConsole}
                isShowUserInput
              />
            </div>
          </div>
        </div>

      </div>
    );
  }

  componentDidMount() {
    EventBus.on(AgentEvent[AgentEvent.AGENT_FOUND], this.onAgentFound);
    EventBus.on(AgentEvent[AgentEvent.AGENT_ERROR], this.onAgentError);
    EventBus.on(AgentEvent[AgentEvent.DEVICELIST_CHANGED], this.onDeviceListChanged);
    EventBus.on(IDEEvent[IDEEvent.CONSOLE_LOG], this.consoleLog);
    EventBus.on(IDEEvent[IDEEvent.CONSOLE_ERROR], this.consoleError);
    EventBus.on(IDEEvent[IDEEvent.CONSOLE_CLEAR], this.consoleClear);
  }

  componentWillUnmount() {
    EventBus.off(AgentEvent[AgentEvent.AGENT_FOUND], this.onAgentFound);
    EventBus.off(AgentEvent[AgentEvent.AGENT_ERROR], this.onAgentError);
    EventBus.off(AgentEvent[AgentEvent.DEVICELIST_CHANGED], this.onDeviceListChanged);
    EventBus.off(IDEEvent[IDEEvent.CONSOLE_LOG], this.consoleLog);
    EventBus.off(IDEEvent[IDEEvent.CONSOLE_ERROR], this.consoleError);
    EventBus.off(IDEEvent[IDEEvent.CONSOLE_CLEAR], this.consoleClear);
  }

  onInput = () => {

  }

  onAgentFound = (status: boolean) => {
    if (status !== null) {
      this.consoleLog(status ? '已连接上扣叮设备助手!' : '正在连接扣叮设备助手...');
    }
  }

  onAgentError = (/* err: any */) => {
  }

  onDeviceListChanged = (serials: DeviceList) => {
    if (serials.length > 0) {
      const selectedDevice = serials[0].name;
      deviceController.setDevice(selectedDevice);
      this.setState({
        deviceList: serials.map((serial) => ({
          label: serial.name,
          key: serial.name,
          value: serial.name
        })),
        selectedDevice,
      });
    } else {
      this.setState({
        deviceList: [],
      });
    }
  }

  consoleLog = (msg: string) => {
    this.refConsole.current!.log(msg);
  }

  consoleError = (msg: string) => {
    this.refConsole.current!.error(msg);
  }

  consoleClear = (msg: string) => {
    this.refConsole.current!.clear(msg);
  }
}

export default Sidebar;
