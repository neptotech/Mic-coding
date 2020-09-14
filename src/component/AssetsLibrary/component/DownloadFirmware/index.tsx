import React, { Component } from 'react';
import { Button } from '@tencent/eui';
import './index.less';
import agentController from '../../../../controller/agent_controller';
import deviceController from '../../../../controller/device_controller';

const prefixCls = 'download';

interface DownloadFirmwareProps {
  needUpdate: boolean,
  handleOk: () => void,
  handleCancel: () => void
}

class DownloadFirmware extends Component<DownloadFirmwareProps> {
  render() {
    const { needUpdate } = this.props;
    return (
      <div className={`${prefixCls}`}>
        { needUpdate ? <p className={`${prefixCls}-text`}>需要更新并启动硬件驱动才能连接硬件设备</p> : <p className={`${prefixCls}-text`}>需要安装并启动硬件驱动才能连接硬件设备</p> }
        <div className={`${prefixCls}-link`}>
          <i className="icon icon-back2top" />
          <a className={`${prefixCls}-link-text`} href={agentController.getAgentClientDownloadLink()}>下载驱动</a>
        </div>
        <div className={`${prefixCls}-ctrl`}>
          <Button className={`${prefixCls}-ctrl-btn`} type="default" size="medium" onClick={this.cancel} text="取消" />
          <Button className={`${prefixCls}-ctrl-btn`} size="medium" onClick={this.retry} text="重试" />
        </div>
      </div>
    );
  }

  cancel = () => {
    const { handleCancel } = this.props;
    if (handleCancel) {
      handleCancel();
    }
  }

  retry = () => {
    agentController.openAgent();

    setTimeout(() => {
      deviceController.findAgent();
    }, 3000);

    const { handleOk } = this.props;
    if (handleOk) {
      handleOk();
    }
  }
}

export default DownloadFirmware;
