import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Compeleted from "../../media/images/completed.png";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";

const SuccessModal = (props: any) => {
  const { t } = useTranslation();
  let { open, handleClose } = props;
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
        {t("SUCCESS_GENERATE_DESCRIPTIVE_STATISTIC")}
      </DialogTitle>
      <DialogContent>
        <Grid container className={classes.imageContainer}>
          {" "}
          <img src={Compeleted} alt="" className={classes.successImage} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("OK")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
