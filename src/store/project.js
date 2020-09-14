/*
 * @Author: YannYang
 * @Date: 2019-03-25 11:06:30
 * @Last Modified by: YannYang
 * @Last Modified time: 2019-03-25 11:06:30
 */
import { observable, action } from 'mobx';

class Store {
  /**
   * current open project id
   */
  @observable projectId = -1;

  /**
   *  project version id
   */
  @observable versionId = -1;

  /**
   * project name
   */
  @observable projectName = '';

  /**
   * project is saved or not
   */
  @observable isSaved = true;

  /**
   * set project id
   * @param {Number} name project id
   */
  @action
  setProjectId(id) {
    this.projectId = id;
  }

  /**
   * set project version id
   * @param {Number} name project version id
   */
  @action
  setProjectVersionId(id) {
    this.versionId = id;
  }

  /**
   * set isSaved value
   * @param {Boolean} bool isSaved value
   */
  @action
  setIsSaved(bool) {
    this.isSaved = bool;
  }

  /**
   * set project name
   * @param {String} name project name
   */
  @action
  setProjectName(name) {
    this.projectName = name;
  }
}

export default new Store();
