import LoadArduinoBlocksColor from './blocks_colors';
import LoadBaseBlocks from './base';
import LoadIOBlocks from './io';
import LoadListsBlocks from './lists';
import LoadLogicBlocks from './logic';
import LoadLoopsBlocks from './loops';
import LoadMapBlocks from './map';
import LoadMathBlocks from './math';
import LoadProceduresBlocks from './procedures';
import LoadSerialBlocks from './serial';
import LoadTextBlocks from './text';
import LoadTimeBlocks from './time';
import LoadVariablesBlocks from './variables';
import LoadEventBlocks from './event';
import LoadMdControlBlocks from './mdcontrol';
import LoadMicLiteBlocks from './micLite';
import LoadMicShowBlocks from './micShow';
import FixProcedure from './fixProcedures';
import LoadActionBlocks from './action';
import LoadMicMathBlocks from './micMath';
import LoadMicArduinoBlocks from './micArduino';
import LoadMicSensorBlocks from './micSensor';

const LoadArduinoBlocks = () => {
  LoadArduinoBlocksColor();
  LoadBaseBlocks();
  LoadIOBlocks();
  LoadListsBlocks();
  LoadLogicBlocks();
  LoadLoopsBlocks();
  LoadMapBlocks();
  LoadMathBlocks();
  LoadProceduresBlocks();
  LoadSerialBlocks();
  LoadTextBlocks();
  LoadTimeBlocks();
  LoadVariablesBlocks();
  LoadEventBlocks();
  LoadMdControlBlocks();
  LoadMicShowBlocks();
  LoadMicLiteBlocks();
  FixProcedure();
  LoadActionBlocks();
  LoadMicMathBlocks();
  LoadMicArduinoBlocks();
  LoadMicSensorBlocks();
  
}

export default LoadArduinoBlocks;
