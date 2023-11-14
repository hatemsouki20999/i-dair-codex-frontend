import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setListGroupTrainingProgress } from "../../redux/reducers/trainModel.slice";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  cancelTrain,
  getGroupTrainingProgress,
} from "../../services/trainModel.services";
import trainModelStyles from "../../styles/trainModelStyles";
import variableReportStyles from "../../styles/variableReportStyles";
import BigLoader from "../Loader/bigLoader";
import { LinearProgressWithLabel } from "../trainModel/train/trainModel";

export default function GroupTrainingProgress() {
  const classes = variableReportStyles();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const trainClasses = trainModelStyles();
  const { listGroupTrainingProgress, connectedUserId } = useSelector(
    (state: RootState) => state.trainModel
  );
  const timerProgress = useRef<string | number | NodeJS.Timer | undefined>();
  useEffect(() => {
    timerProgress.current = setInterval(() => {
      dispatch(getGroupTrainingProgress());
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return () => {
      clearInterval(timerProgress.current);
      dispatch(setListGroupTrainingProgress(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = (sessionId: number) => {
    dispatch(cancelTrain({ sessionId }));
  };

  return (
    <Grid container>
      {listGroupTrainingProgress ? (
        listGroupTrainingProgress.length === 0 ? (
          <Box sx={{ margin: "auto" }}>
            <Alert severity="info">
              <AlertTitle>{t("NO_TRAINING_IN_PROGRESS")}</AlertTitle>
              {t("NO_TRAINING_IN_PROGRESS")}
            </Alert>
          </Box>
        ) : (
          listGroupTrainingProgress.map((groupTrainingProgress) => (
            <Card className={classes.featureEngineeringSummary}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  {`${groupTrainingProgress[0].email} ${t("RUNS")} ${
                    groupTrainingProgress[0].task
                  } ${t("FOR_THE_TARGET")}
                  ${groupTrainingProgress[0].target}`}
                </Typography>
                {groupTrainingProgress.map((model: any) => (
                  <Grid
                    container
                    sx={{
                      "& .css-eglki6-MuiLinearProgress-root": { height: "8px" },
                      marginBottom: "4vh",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <Box className={trainClasses.modelName}>
                      <Typography>{model.name}</Typography>
                    </Box>
                    <Box className={trainClasses.modelProgress}>
                      <LinearProgressWithLabel
                        value={
                          (model.train_progress * 100) / model.nbr_iteration
                        }
                      />
                    </Box>
                  </Grid>
                ))}
              </CardContent>
              {parseInt(groupTrainingProgress[0].user_id) ===
                connectedUserId && (
                <Grid container>
                  {" "}
                  <Grid
                    item
                    xs={11.8}
                    className={classes.cancelTrainButtonContainer}
                  >
                    <Button
                      onClick={() => {
                        handleCancel(groupTrainingProgress[0].session_id);
                      }}
                      variant="outlined"
                      className={classes.cancelTrainButton}
                    >
                      {t("CANCEL_TRAINING")}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Card>
          ))
        )
      ) : (
        <BigLoader />
      )}
    </Grid>
  );
}
