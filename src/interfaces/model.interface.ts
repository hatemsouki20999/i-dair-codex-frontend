export interface NewModel {
  id: number;
  id_dataset: number;
  id_model: number;
  name: string;
  run_id: string;
  train_progress: number;
  train_status: string;
  task: string;
  target: string;
  is_best: number;
  email: string;
  session_id: number;
  sessionName: string;
  created_at: string;
  [key: string]: any;
}
