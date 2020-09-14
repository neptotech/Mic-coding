const leonardoIcon = require('../assets/images/leonardo.jpg');
const unoIcon = require('../assets/images/uno.jpg');

const ProjectMode = {
  LEONARDO: 'leonardo',
  UNO: 'uno',
};

const ProjectModeDataMap = {};

// leonardo
ProjectModeDataMap[ProjectMode.LEONARDO] = {
  type: ProjectMode.LEONARDO,
  name: 'leonardo',
  icon: leonardoIcon,
  fqbn: 'arduino:avr:leonardo',
  developer: 'leonardo',
};

// uno
ProjectModeDataMap[ProjectMode.UNO] = {
  type: ProjectMode.UNO,
  name: 'uno',
  icon: unoIcon,
  fqbn: 'arduino:avr:uno',
  developer: 'uno',
};

export {
  ProjectMode, ProjectModeDataMap,
};
