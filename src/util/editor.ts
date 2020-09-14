enum EditorMode {
  BLOCK,
  CODE,
  UNKNOW
}

const getEditorModeString = (editorMode: EditorMode):string => {
  switch (editorMode) {
    case EditorMode.BLOCK:
      return 'block';
    case EditorMode.CODE:
      return 'code';
    default:
      console.error('error editorMode');
      return '';
  }
};

const getEditorMode = (editorMode: string):EditorMode => {
  if (editorMode === 'block') {
    return EditorMode.BLOCK;
  } if (editorMode === 'code') {
    return EditorMode.CODE;
  }
  return EditorMode.UNKNOW;
};

export {
  EditorMode,
  getEditorModeString,
  getEditorMode,
};
