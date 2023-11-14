export interface IUploadComponent {
  name: string;
  changeHandler: any;
  closeFile: any;
  state: IFormInputs;
  fromPrediction?: boolean;
}
export interface IInputComponent {
  name: string;
  label: string;
  changeHandler: any;
  state: any;
  title: string;
}

export interface IFormInputs {
  value: any;
  errorMessage: string;
}
