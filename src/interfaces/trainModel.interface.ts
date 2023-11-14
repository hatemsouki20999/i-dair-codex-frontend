export interface IButtonProps {
  onClick?: any;
  onClickBack?: any;
  disableNext?: boolean;
  disableBack?: boolean;
}

export interface IParamsGetModelList {
  idDataset: number;
  target?: string;
  trace_id: string;
  span_id: string;
}

export interface Trace {
  trace_id: string;
  span_id: string;
}

export interface TraceReset {
  modelId: number;
  trace_id: string;
  span_id: string;
}

export interface TraceAvailableModel {
  idDataset: number;
  target?: string;
  trace_id: string;
  span_id: string;
}
export interface ModelType {
  [key: string]: any;
}

export interface TrainModel {
  created_at: string;
  email: string;
  feature_engineering: {};
  id: number;
  id_dataset: number;
  id_model: number;
  importance_scores: {};
  is_best: number;
  metrics: any[];
  name: string;
  nbr_iteration: number;
  parameters: any[];
  plot: {};
  run_id: string;
  session_id: number;
  session_name: string;
  settings: any[];
  target: string;
  task: string;
  train_progress: number;
  train_status: string;
}

export interface modelSelection {
  advancedParams: boolean;
  available_feature_selection: boolean;
  checked: boolean;
  expanded: boolean;
  featureSelection: boolean;
  id: number;
  name: string;
  sklearnLink: string;
  type: string;
  hyperparameters: any;
}
