import { Button, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import uploadStyles from "../../styles/uploadStyles";
import { IUploadComponent } from "../../interfaces/upload.interface";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";

export default function UploadComponent({
  name,
  changeHandler,
  closeFile,
  state,
  fromPrediction,
}: IUploadComponent) {
  const classes = uploadStyles();
  const { t } = useTranslation();

  const getTextColor = (errorLength: number) => {
    if (errorLength !== 0) {
      return "error";
    } else {
      return "primary";
    }
  };
  return (
    <Grid container className={classes.content}>
      <Grid item xs={4}>
        <Typography className={classes.label}>{name} </Typography>
        {!fromPrediction && (
          <Typography className={classes.acceptedFilesText}>
            ({t("ACCPETED_FILES")})
          </Typography>
        )}
      </Grid>
      <Grid item xs={8}>
        {!state.value ? (
          <>
            <Button
              color={getTextColor(state.errorMessage.length)}
              variant="outlined"
              component="label"
              onChange={changeHandler}
            >
              {t("BUTTON_UPLOAD")}
              <input
                type="file"
                hidden
                accept=".csv,.xlsx,.dta,.rda,.sas7bdat,.sav"
              />
            </Button>
            <Typography
              className={classes.error}
              color={getTextColor(state.errorMessage.length)}
            >
              {state.errorMessage}
            </Typography>{" "}
          </>
        ) : (
          <Grid container className={classes.contentFileUploded}>
            <Grid item xs={11}>
              <Typography
                variant="button"
                className={classes.fileName}
                data-testid="filename"
              >
                {state.value}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={closeFile}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
