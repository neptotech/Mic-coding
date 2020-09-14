
// 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
// !注意 消息前缀应使用字符串类型
const prefix = 'EASY_CODE';
const supportPostMessage = 'postMessage' in window;

// Target 类, 消息对象
export class IFrameTarget {
  constructor(target, name, prefix) {
    let errMsg = '';
    if (arguments.length < 2) {
      errMsg = 'target error - target and name are both required';
    } else if (typeof target !== 'object') {
      errMsg = 'target error - target itself must be window object';
    } else if (typeof name !== 'string') {
      errMsg = 'target error - target name must be string type';
    }
    if (errMsg) {
      throw new Error(errMsg);
    }
    this.target = target;
    this.name = name;
    this.prefix = prefix;
  }

  // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
  send(msg) {
    if (supportPostMessage) {
      // IE8+ 以及现代浏览器支持
      this.target.postMessage(`${this.prefix}|${this.name}__Messenger__${msg}`, '*');
    } else {
      // 兼容IE 6/7
      const targetFunc = window.navigator[this.prefix + this.name];
      if (typeof targetFunc === 'function') {
        targetFunc(this.prefix + msg, window);
      } else {
        throw new Error('target callback function is not defined');
      }
    }
  }
}

// 信使类
export class IFrameMessenger {
  // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
  // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
  constructor(messengerName, projectName) {
    this.targets = {};
    this.name = messengerName;
    this.listenFunc = [];
    this.prefix = projectName || prefix;
    this.initListen();
    this.rspCallback = {};
  }

  // 添加一个消息对象
  addTarget(target, name) {
    const targetObj = new IFrameTarget(target, name, this.prefix);
    this.targets[name] = targetObj;
  }

  // 初始化消息监听
  initListen() {
    if (supportPostMessage) {
      if ('addEventListener' in document) {
        window.addEventListener('message', this.generalCallback.bind(this), false);
      } else if ('attachEvent' in document) {
        window.attachEvent('onmessage', this.generalCallback.bind(this));
      }
    } else {
      // 兼容IE 6/7
      window.navigator[this.prefix + this.name] = this.generalCallback.bind(this);
    }
  }

  // 监听消息
  listen(callback) {
    let i = 0;
    const len = this.listenFunc.length;
    let cbIsExist = false;
    for (; i < len; i++) {
      if (this.listenFunc[i] == callback) {
        cbIsExist = true;
        break;
      }
    }
    if (!cbIsExist) {
      this.listenFunc.push(callback);
    }
  }

  // 注销监听
  clear() {
    this.listenFunc = [];
    this.targets = {};
    this.rspCallback = {};
  }

  // 是否有监听对象
  hasTarget() {
    if (Object.keys(this.targets).length === 0) {
      return false;
    }
    return true;
  }

  // 广播消息
  sendMessage(cmd, data, backString = null, rspCallback = null) {
    const msg = {
      cmd,
      data,
    };
    if (backString) {
      msg.backString = backString;
      if (rspCallback) {
        this.rspCallback[backString] = rspCallback;
      }
    }
    this.send(JSON.stringify(msg));
  }

  /**
     * private
     */
  send(msg) {
    const targets = this.targets;
    let target;
    for (target in targets) {
      if (targets.hasOwnProperty(target)) {
        targets[target].send(msg);
      }
    }
  }

  generalCallback(msg) {
    if ((typeof msg) === 'object') {
      msg = msg.data || '';
      if ((typeof msg) === 'object') {
        return;
      }
    }

    const msgPairs = msg.split('__Messenger__');
    const msgData = msgPairs[1];
    const pairs = msgPairs[0].split('|');
    const prefix = pairs[0];
    const name = pairs[1];

    if (!msgData) {
      console.error("['IFrameMessenger][generalCallback] msgData is null");
      return;
    }

    const receiveData = JSON.parse(msgData);
    if (!receiveData.cmd) {
      console.error("['IFrameMessenger][generalCallback] receiveData.cmd is null");
      return;
    }

    if (this.callRsp(receiveData)) {
      return;
    }

    this.callListenFunc(prefix, name, receiveData);
  }

  callRsp(receiveData) {
    if (!receiveData.backString) {
      return false;
    }

    if (!this.rspCallback[receiveData.backString]) {
      return false;
    }

    const rspCallback = this.rspCallback[receiveData.backString];
    rspCallback(receiveData);
    delete this.rspCallback[receiveData.backString];
    return true;
  }

  callListenFunc(prefix, name, receiveData) {
    for (let i = 0; i < this.listenFunc.length; i++) {
      if (prefix + name === this.prefix + this.name) {
        this.listenFunc[i](receiveData);
      }
    }
  }
}
