import LoadArduinoMsgCommon from '../common/en';
import LoadArduinoMsgHans from './js/zh-hans';

const LoadArduinoMsg = () => {
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = '定义函数';
  Blockly.Msg.PROCEDURES_DEFNORETURN_DO = '';
  Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS = '';
  Blockly.Msg.PROCEDURES_BEFORE_PARAMS = '';

  LoadArduinoMsgCommon();
  LoadArduinoMsgHans();
}

export default LoadArduinoMsg;
