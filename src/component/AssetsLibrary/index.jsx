import React, { Component } from 'react';
import { Dialog } from '@tencent/eui/';
import { observer, inject } from 'mobx-react';
import ArduinoPanel from './component/ArduinoPanel';
import './index.less';
import { EventBus } from '../../util/eventbus';
import { AgentEvent } from '../../util/events';
import deviceController from '../../controller/device_controller';
import DownloadFirmware from './component/DownloadFirmware';

const prefixCls = 'assetslib';

@inject('EditorStore')
@observer
class AssetsLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleFirmware: false,
    };

    this.agentNeedUpdate = false;
  }

  componentWillMount() {
    EventBus.on(AgentEvent[AgentEvent.AGENT_FOUND], this.onAgentFound);
    EventBus.on(AgentEvent[AgentEvent.AGETN_VERSION_UNSUPPORT], this.onAgentUnsupport);
    EventBus.on(AgentEvent[AgentEvent.AGENT_VERSION_SUPPORT], this.onAgentSupport);
  }

  componentWillUnmount() {
    EventBus.off(AgentEvent[AgentEvent.AGENT_FOUND], this.onAgentFound);
    EventBus.off(AgentEvent[AgentEvent.AGETN_VERSION_UNSUPPORT], this.onAgentUnsupport);
    EventBus.off(AgentEvent[AgentEvent.AGENT_VERSION_SUPPORT], this.onAgentSupport);
  }

  onAgentFound = (status) => {
    if (status !== null && status !== undefined) {
      if (status) {
        if (!this.agentNeedUpdate) {
          this.hideDialogFirmware();
        }
      } else {
        this.showDialogFirmware();
      }
    }
  }

  onAgentUnsupport = () => {
    this.agentNeedUpdate = true;
    this.showDialogFirmware();
  }

  onAgentSupport = () => {
    this.agentNeedUpdate = false;
    this.hideDialogFirmware();
  }

  showDialogFirmware = () => {
    this.setState({
      visibleFirmware: true,
    });
  }

  hideDialogFirmware = () => {
    this.setState({
      visibleFirmware: false,
    });
  }

  handleOkFirmware = () => {
    this.hideDialogFirmware();
  }

  handleCloseFirmware = () => {
    this.hideDialogFirmware();
  }

  handleCancelFirmware = () => {
    this.hideDialogFirmware();
  }

  componentDidMount = () => {
    setTimeout(() => {
      deviceController.findAgent();
    }, 3000);
  }

  render = () => {
    const { options } = this.props;
    const { visibleFirmware } = this.state;
    const devicesPanel = this.renderDevicePanel(options);
    return (
      <div className={`${prefixCls}`}>
        <div className={`${prefixCls}-main`}>
          {devicesPanel}
        </div>
        <Dialog
          visible={visibleFirmware}
          handleCancel={this.handleCancelFirmware}
          handleOk={this.handleOkFirmware}
          handleClose={this.handleCloseFirmware}
          title="硬件驱动"
          cancelText=""
          confirmText=""
          renderInline
          className="dialog-assetslib firmware"
        >
          <DownloadFirmware
            needUpdate={this.agentNeedUpdate}
            handleCancel={this.handleCancelFirmware}
            handleOk={this.handleOkFirmware}
            handleClose={this.handleCloseFirmware}
          />
        </Dialog>
      </div>
    );
  }

  renderDevicePanel = (options) => {
    return <ArduinoPanel connectDevices={options} />;
  }
}

export default AssetsLibrary;
