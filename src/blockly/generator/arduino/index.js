import LoadBaseCodeGenerator from './base';
import LoadControlCodeGenerator from './control';
import LoadIOCodeGenerator from './io';
import LoadListsCodeGenerator from './lists';
import LoadLogicCodeGenerator from './logic';
import LoadLoopsCodeGenerator from './loops';
import LoadMapCodeGenerator from './map';
import LoadMathCodeGenerator from './math';
import LoadProceduresCodeGenerator from './procedures';
import LoadSerialCodeGenerator from './serial';
import LoadTextCodeGenerator from './text';
import LoadTimeCodeGenerator from './time';
import LoadVariablesCodeGenerator from './variables';
import LoadEventCodeGenerator from './event';
import LoadMDControlCodeGenerator from './mdcontrol';
import LoadMicLiteCodeGenerator from './micLite';
import LoadMicShowCodeGenerator from './micShow';
import LoadActionCodeGenerator from './action';
import LoadMicMathCodeGenerator from './micMath';
import LoadMicArduinoCodeGenerator from './micArduino';
import LoadMicSensorCodeGenerator from './micSensor';

const LoadArduinoCodeGenerator = () => {
  LoadBaseCodeGenerator();
  LoadControlCodeGenerator();
  LoadIOCodeGenerator();
  LoadListsCodeGenerator();
  LoadLogicCodeGenerator();
  LoadLoopsCodeGenerator();
  LoadMapCodeGenerator();
  LoadMathCodeGenerator();
  LoadProceduresCodeGenerator();
  LoadSerialCodeGenerator();
  LoadTextCodeGenerator();
  LoadTimeCodeGenerator();
  LoadVariablesCodeGenerator();
  LoadEventCodeGenerator();
  LoadMDControlCodeGenerator();
  LoadMicLiteCodeGenerator();
  LoadMicShowCodeGenerator();
  LoadActionCodeGenerator();
  LoadMicMathCodeGenerator();
  LoadMicArduinoCodeGenerator();
  LoadMicSensorCodeGenerator();
}

export default LoadArduinoCodeGenerator;
