declare var FLUTTER: boolean;
declare var FLUTTER_CLIENT: string;

export default typeof FLUTTER !== "undefined" && FLUTTER && FLUTTER_CLIENT === "ios" ;
