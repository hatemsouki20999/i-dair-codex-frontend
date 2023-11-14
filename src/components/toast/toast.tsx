import { Alert, Snackbar } from "@mui/material";
import { IToastProps } from "../../interfaces/toast.interface";

export default function Toast({ showToast, handleClose }: IToastProps) {
  return (
    <Snackbar
      open={showToast.open}
      autoHideDuration={60000}
      onClose={() => handleClose(showToast.type)}
    >
      <Alert
        onClose={() => handleClose(showToast.type)}
        severity={showToast.type}
        sx={{ width: "100%" }}
      >
        {showToast.message}
      </Alert>
    </Snackbar>
  );
}
