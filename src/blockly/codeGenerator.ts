const BlocklyToArduino = (workspace: any): string => Blockly.Arduino.workspaceToCode(workspace);
const BlocklyToMicroPython = (workspace: any): string => Blockly.MicroPython.workspaceToCode(workspace);

export {
  BlocklyToArduino,
  BlocklyToMicroPython
};
