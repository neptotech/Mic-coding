import LoadBaseCodeGenerator from './base';
import LoadControlCodeGenerator from './control';
import LoadMathCodeGenerator from './math';

const LoadMicropythonCodeGenerator = () => {
  LoadBaseCodeGenerator();
  LoadControlCodeGenerator();
  LoadMathCodeGenerator();
}

export default LoadMicropythonCodeGenerator;
