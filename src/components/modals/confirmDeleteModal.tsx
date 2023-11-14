import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";
const ConfirmDeleteModal = (props: any) => {
  const { t } = useTranslation();
  let { open, handleClose, handleDelete, message, header } = props;
  const classes = descriptiveStatisticsStyles();
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"xs"}
    >
      <DialogTitle
        id="alert-dialog-title"
        className={classes.successModalTitle}
      >
        {header}
      </DialogTitle>
      <DialogContent>
        <Grid container className={classes.imageContainer}>
          {message}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("CANCEL")}</Button>
        <Button variant="contained" onClick={handleDelete}>
          {t("YES")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
