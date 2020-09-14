import LoadStaticTyping from './static_typing';
import LoadType from './type';
import LoadTypes from './types';
import LoadArduinoDefine from './arduinoDefine';
import LoadMicropythonDefine from './micropythonDefine';
import LoadCommon from './common';
import LoadArduinoMsg from '../msg/arduino';
import LoadArduinoCodeGenerator from '../generator/arduino';
import LoadMicropythonCodeGenerator from '../generator/microPython';

const LoadGeneralDefine = () => {
  LoadStaticTyping();
  LoadType();
  LoadTypes();
  LoadArduinoDefine();
  LoadMicropythonDefine();
  LoadCommon();
  LoadArduinoMsg();
  LoadArduinoCodeGenerator();
  LoadMicropythonCodeGenerator();

  Blockly.Procedures.disposeCallers = function(name, workspace) {
    const callers = Blockly.Procedures.getCallers(name, workspace);
    for(let caller in callers) {
      callers[caller].dispose();
    }
  }

}

export default LoadGeneralDefine;
