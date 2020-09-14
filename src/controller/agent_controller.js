import ProtocolCheck from '../util/agent/protocolcheck';
import { EventBus } from '../util/eventbus';
import { AgentEvent } from '../util/events';

class AgentController {
  constructor() {
    this.init();
  }

  init = () => {
    this.currentAgentVersion = '0.0.0';
    this.minAgentVersion = '0.0.8';
    this.agentClientDownloadLink = this.getAgentClientDownloadLink();
    this.agentNewVersion = this.getAgentNewVersion();
    this.mPythonAgent = null;
    this.agentProtocolCheck = new ProtocolCheck('codingagent');
    this.initAgentConfig();
  }

  setCurrentAgentVersion = (version) => {
    this.currentAgentVersion = version;
    return this.checkCurrentVersionSupport();
  }

  checkCurrentVersionSupport = () => {
    if (this.compareVersion(this.agentNewVersion, this.currentAgentVersion)
    || this.compareVersion(this.minAgentVersion, this.currentAgentVersion)) {
      EventBus.emit(AgentEvent[AgentEvent.AGETN_VERSION_UNSUPPORT]);
      return false;
    }
    EventBus.emit(AgentEvent[AgentEvent.AGETN_VERSION_SUPPORT]);
    return true;
  }

  initAgentConfig = () => {
    if (/http(s)?:\/\/coding.qq.com/.test(window.location.href)) {
      this.loadScript('https://coding.qq.com/common/config/hardware_config.js', this.configLoadCallback);
    } else {
      this.loadScript('https://coding.qq.com/common/config/hardware_config_test.js', this.configLoadCallback);
    }
  }

  loadScript = (url, callback) => {
    const script = document.createElement('script');
    if (script.readyState) { // IE
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { // 其他浏览器
      script.onload = function () {
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  configLoadCallback = () => {
    if (!window.hardwareConfig) {
      return;
    }
    this.agentNewVersion = this.getAgentNewVersion();
  }

  compareVersion = (vresion1, version2) => {
    const v1 = vresion1.split('.');
    const v2 = version2.split('.');
    if (Number.parseInt(v1[0], 10) > Number.parseInt(v2[0], 10)) {
      return true;
    }
    if (Number.parseInt(v1[1], 10) > Number.parseInt(v2[1], 10)) {
      return true;
    }
    if (Number.parseInt(v1[2], 10) > Number.parseInt(v2[2], 10)) {
      return true;
    }
    return false;
  }

  downloadAgent = () => {
    const downloadLink = document.createElement('a');
    downloadLink.style.display = 'none';
    downloadLink.href = this.getAgentClientDownloadLink();
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  updateAgent = (click = false) => {
    if (this.compareVersion(this.agentNewVersion, this.currentAgentVersion)) {
      this.downloadAgent();
      return true;
    }
    if (click) {
      // eslint-disable-next-line no-alert
      alert('agent 已经是最新版本！');
    } else {
      console.log('agent 已经是最新版本！');
    }
    return false;
  }

  getAgentClientDownloadLink = () => {
    let agentClientDownloadLink = '';
    /*if (navigator.appVersion.indexOf('Mac') === -1) {
      agentClientDownloadLink = (window.hardwareConfig && window.hardwareConfig.mpythonAgentDownloadLink)
        ? window.hardwareConfig.mpythonAgentDownloadLink
        : `http://dldir3.qq.com/minigamefile/hardware/CodingAgentInstaller_${this.agentNewVersion}.exe`;
    } else {
      agentClientDownloadLink = (window.hardwareConfig && window.hardwareConfig.mpythonAgentMacDownloadLink)
        ? window.hardwareConfig.mpythonAgentMacDownloadLink
        : `http://dldir3.qq.com/minigamefile/hardware/CodingAgent_${this.agentNewVersion}.pkg`;
    }*/
    if (navigator.appVersion.indexOf('Mac') === -1) {
      agentClientDownloadLink = 'https://dldir3.qq.com/minigamefile/hardware/esp/20200323_MicroduinoAgent_mConnector_setup.exe';
    } else {
      agentClientDownloadLink = 'https://dldir3.qq.com/minigamefile/hardware/esp/20200323_MicroduinoAgent_mConnector_setup.pkg';
    }
    return agentClientDownloadLink;
  }

  getAgentNewVersion = () => ((window.hardwareConfig && window.hardwareConfig.mpythonAgentVersion)
    ? window.hardwareConfig.mpythonAgentVersion
    : this.currentAgentVersion)

  openAgent = () => {
    this.agentProtocolCheck.openUri((result) => {
      console.log(`openAgent result ${result}`);
      EventBus.emit(AgentEvent[AgentEvent.AGENT_START]);
    });
  };

}

const agentController = new AgentController();
export default agentController;
