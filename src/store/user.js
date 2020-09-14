/*
 * @Author: YannYang
 * @Date: 2019-03-25 11:06:38
 * @Last Modified by: YannYang
 * @Last Modified time: 2019-03-25 11:06:38
 */
import { observable, action } from 'mobx';

class Store {
  /**
   * user is login or not
   */
  @observable isLogin = false;

  /**
   * user information
   */
  @observable userInfo = {};

  /**
   * set isLogin value
   * @param {Boolean} bool isLogin value
   */
  @action
  setIsLogin(bool) {
    this.isLogin = bool;
  }

  /**
   * set user information
   * @param {Object} userInfo user information
   */
  @action
  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }
}

export default new Store();
