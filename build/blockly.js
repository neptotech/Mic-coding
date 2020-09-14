const fs = require('fs');
const path = require('path');

// const { COPYFILE_FICLONE_FORCE } = fs.constants;


// 将 blockly 相关代码转为字符串，以es6模块导出
/* const blocklyFilePath = './dist/blockly.js';
const fileCode = fs.readFileSync(blocklyFilePath, 'utf8');
const code = `const code = \`${fileCode}\`;
export default code`;
fs.writeFileSync(blocklyFilePath, code); */

// 将 toolbox 相关代码转为字符串，以es6模块导出
/* const toolboxFilePath = './dist/toolbox.js';
const toolbox = fs.readFileSync(toolboxFilePath, 'utf8');
const toolboxCode = `const code = \`${toolbox}\`;
export default code`;
fs.writeFileSync(toolboxFilePath, toolboxCode); */


// 复制 dist/blockly.js 文件为 dist/blockly.txt，方便后续通过 raw-loader 处理
fs.copyFile(path.resolve('./dist/blockly_arduino.js'), path.resolve('./dist/blockly_arduino.txt'), (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log('复制成功');
  }
});

