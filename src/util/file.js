/*
 * @Author: YannYang
 * @Date: 2019-03-25 11:05:48
 * @Last Modified by: YannYang
 * @Last Modified time: 2019-03-25 11:05:48
 */
class File {
  /**
   * transform base64 string to blob
   * @param {Object}
   * @return {Blob}
   */
  base64ToBlob({ data, type = 'image/png' }) {
    const binary = atob(data.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  }

  /**
   * save file to local.
   * @param {Object} param
   */
  download({ content, fileName = 'project.json' }) {
    const urlObj = window.URL || window.webkitURL || window;
    const blob = new Blob([content]);
    const saveLink = document.createElement('a');
    saveLink.href = urlObj.createObjectURL(blob);
    saveLink.download = fileName;
    saveLink.click();
  }

}

export default new File();
