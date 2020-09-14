import LoadArduinoBlocks from '../block/arduino/index';
import LoadMicropythonBlocks from '../block/microPython/index';
import LoadGeneralDefine from '../block/index';
import LoadArduinoMsg from '../msg/arduino';
import LoadArduinoCodeGenerator from '../generator/arduino';
import LoadMicropythonCodeGenerator from '../generator/microPython';

(()=>{
  LoadArduinoMsg();
  LoadGeneralDefine();
  LoadArduinoBlocks();
  LoadMicropythonBlocks();
  LoadArduinoCodeGenerator();
  LoadMicropythonCodeGenerator();
})();
