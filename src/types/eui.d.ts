declare module '@tencent/eui' {
  const Select: any;
  const Button: any;
  const Icon: any;
  export {
    Select,
    Button,
    Icon,
  };
}

declare interface SelectOption {
  label: string,
  key: string,
  value: string
}

declare type SelectOptions = Array<SelectOption>;
