/*
 * @Author: YannYang
 * @Date: 2019-03-25 11:06:23
 * @Last Modified by: YannYang
 * @Last Modified time: 2019-03-25 11:06:23
 */

import { observable, action } from 'mobx';
import { EditorMode } from '../util/editor';

class Store {
  @observable editorMode = EditorMode.BLOCK;

  // 硬件子类型
  @observable subType = 'arduino';

  @observable blocklyWorkspace = '';

  @observable code = '';

  @action
  setEditorMode(mode) {
    this.editorMode = mode;
  }

  @action
  setType(type) {
    this.subType = type;
  }

  @action
  setBlocklyWorkspace(workspace) {
    this.blocklyWorkspace = workspace;
  }

  @action
  setCode(code) {
    this.code = code;
  }
}

export default new Store();
