export interface PropsModalI {
  handleClose: () => void;
  open: boolean;
  idDataset?: number;
}

export interface HyperParamsFieldsProps {
  models: any;
  fromTrain: boolean;
  setErrorInput: any;
  handleChangeHyperparameter: (
    event: any,
    idModel: number,
    paramName: string,
    type: string
  ) => void;
  handleChangeMixedHyperparameters: (
    event: any,
    idModel: number,
    paramName: string,
    type: string
  ) => void;
}

export interface SequenceParams {
  min: number | "";
  max: number | "";
  numberOfValues: number | "";
  paramName: string;
  maxError: boolean;
  numberOfValuesError: boolean;
}
export interface GroupManagementModalProps {
  handleClose: () => void;
  open: boolean;
}

export interface CreateGroupProps {
  display: boolean;
  handleClose: () => void;
}

export interface CreateMemberProps {
  display: boolean;
  handleClose: () => void;
}
