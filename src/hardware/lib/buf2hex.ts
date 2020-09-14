// @ts-ignore
export default (buffer: ArrayBuffer): number[] => Array.prototype.map.call(new Uint8Array(buffer), (x: number) => x);
