declare let Blockly: any;

declare module '*.xml' {
  const xml: string;
  export default xml;
}

declare module '*.ino' {
  const arduino: string;
  export default arduino;
}

declare module '*.txt' {
  const content: string;
  export default content;
}
