import { AlertColor } from "@mui/material";

export interface IToastProps {
  showToast: IToastType;
  handleClose: any;
}

export interface IToastType {
  open: boolean,
  type: AlertColor,
  message: string
}