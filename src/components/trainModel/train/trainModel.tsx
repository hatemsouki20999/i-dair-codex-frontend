import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import ButtonStepper from "../buttonStepper/buttonStepper";
import StepperStyles from "../../../styles/StepperStyles";
import {
  setActiveStep,
  setListModelToTrain,
  resetTrainProgress,
  setTrainCanceled,
  resetTrainSlice,
  setBackFromTrainResult,
} from "../../../redux/reducers/trainModel.slice";
import trainModelStyles from "../../../styles/trainModelStyles";
import {
  cancelTrain,
  cancelCreatePost,
  trainModel,
  getTrainingInProgressByUser,
} from "../../../services/trainModel.services";
import BigLoader from "../../Loader/bigLoader";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  capitalizeText,
  convertHyperParameterToSubmitFormat,
} from "../../../utils/functions";
import { setHyperParametersListForTrain } from "../../../redux/reducers/settings.slice";
import { setColumnList } from "../../../redux/reducers/prediction.slice";
import { traceSpan } from "../../../tracing";

export const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

const TrainModel = () => {
  const { t } = useTranslation();
  const classes = StepperStyles();
  const trainClasses = trainModelStyles();
  let { hyperParametersListForTrain } = useSelector(
    (state: RootState) => state.settings
  );
  const dispatch: AppDispatch = useDispatch();
  const {
    selectedDataset,
    listModelToTrain,
    selectedTarget,
    trainFinished,
    connectedUserId,
    listTrainingProgressForConnectedUser,
    backFromTrainResult,
    sessionName,
  } = useSelector((state: RootState) => state.trainModel);

  const { selectedSplitPercent, shuffle } = useSelector(
    (state: RootState) => state.dataPartition
  );
  const timer = useRef<string | number | NodeJS.Timer | undefined>();

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    timer.current = setInterval(() => {
      dispatch(getTrainingInProgressByUser());
    }, 2000);

    let newModelList = listModelToTrain.map((model: any) => {
      return { ...model, progress: 0, status: "", sessionId: 0 };
    });
    dispatch(setListModelToTrain(newModelList));
    let models: Array<any> = [];
    listModelToTrain.forEach((elem: any) => {
      let currentModel: any = hyperParametersListForTrain.find(
        (modrl: any) => modrl.id === elem.id
      );
      let isDefault = !currentModel?.advancedParams;
      let params = !isDefault
        ? Object.keys(currentModel?.hyperparameters).reduce(
            (result: any, param) => {
              result[param] = convertHyperParameterToSubmitFormat(
                currentModel?.hyperparameters[param]
              );
              return result;
            },
            {}
          )
        : undefined;

      let model: any = {
        id_model: elem.id,
        default: isDefault,
        params,
        featureSelection: elem.featureSelection,
      };
      models.push(model);
      return true;
    });

    if (selectedDataset !== 0 && models.length !== 0 && !backFromTrainResult) {
      traceSpan(
        "Trace of train model",
        async (trace_id: string, span_id: string) => {
          const trainData = {
            idDataset: selectedDataset,
            train_percentage: selectedSplitPercent.training,
            test_percentage: selectedSplitPercent.validation,
            seed: selectedSplitPercent.seed,
            shuffle: shuffle === "1" ? true : false,
            task:
              listModelToTrain.length !== 0 ? listModelToTrain[0]["type"] : "",
            target: selectedTarget,
            models: models,
            sessionName,
            trace_id: trace_id,
            span_id: span_id,
          };
          await dispatch(trainModel(trainData));
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    dispatch(setActiveStep(1));
    dispatch(resetTrainProgress());
    dispatch(setBackFromTrainResult(false));
  };

  const handleNext = () => {
    dispatch(setActiveStep(3));
    dispatch(resetTrainProgress());
    dispatch(setBackFromTrainResult(false));
  };

  const disableButton = () => {
    //the next button will be disabled if we don't have any completed session
    let completedSession = listTrainingProgressForConnectedUser
      ? listTrainingProgressForConnectedUser.filter((session: Array<any>) => {
          return session.some(
            (obj: any) =>
              obj.train_status === "completed" &&
              obj.sessionStatus !== "pending"
          );
        })
      : [];

    if (completedSession.length >= 1) {
      return false;
    } else {
      return true;
    }
  };

  const handleCancel = (sessionId: number) => {
    cancelCreatePost();
    dispatch(cancelTrain({ sessionId: sessionId })).then(() => {
      dispatch(setTrainCanceled(true));
    });
  };

  const launchNewTrain = () => {
    dispatch(resetTrainSlice());
    dispatch(setActiveStep(0));
    dispatch(setBackFromTrainResult(false));
    dispatch(setHyperParametersListForTrain([]));
    dispatch(setColumnList([]));
  };

  const checkTrainSessionIsCompleted = (session: any) => {
    let numberOfCompletedTrain = session.filter(
      (elem: any) => elem.train_status === "completed"
    );
    return numberOfCompletedTrain.length === session.length;
  };

  const getNumberOfPendingTrain = () => {
    let numberOfPendingTrain = 0;
    listTrainingProgressForConnectedUser?.map((session: any) => {
      let pendingTrain = session.filter(
        (elem: any) => elem.sessionStatus === "pending"
      );
      if (pendingTrain.length >= 1) {
        numberOfPendingTrain++;
      }
      return true;
    });
    return numberOfPendingTrain;
  };

  const getTrainingSessionStatus = (status: string) => {
    if (status === "pending") {
      return t("TRAINING_IN_PROGRESS") + " ...";
    } else if (status === "completed") {
      return t("TRAINING_COMPLETED");
    } else if (status === "canceled") {
      return t("TRAINING_CANCELED");
    } else {
      return t("TRAINING_REJECTED");
    }
  };

  const getSklearnLink = (idModel: number) => {
    let trainedModel: any = hyperParametersListForTrain.find(
      (model: any) => model.id === idModel
    );
    if (trainedModel) {
      return trainedModel.sklearnLink;
    } else {
      return "";
    }
  };
  return (
    <Grid container>
      <Grid container>
        {listTrainingProgressForConnectedUser ? (
          <>
            <Grid container>
              {listTrainingProgressForConnectedUser.map(
                (trainProgress: any, index: number) => (
                  <Grid
                    container
                    className={trainClasses.sessionContainer}
                    key={index}
                  >
                    <Card
                      className={
                        index === 0
                          ? clsx(
                              trainClasses.sessionCard,
                              trainClasses.currentSession
                            )
                          : trainClasses.sessionCard
                      }
                    >
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="h2"
                          sx={{ textAlign: "center", marginBottom: "1.5vh" }}
                        >
                          {getTrainingSessionStatus(
                            trainProgress[0].sessionStatus
                          )}
                          {getTrainingSessionStatus(
                            trainProgress[0].sessionStatus
                          ) === t("TRAINING_REJECTED") &&
                            trainProgress[0].errorCause &&
                            trainProgress[0].errorCause.split("-")[1] ===
                              "Possible issue with Hyperparameter combination or search." && (
                              <>
                                <Typography>{` ${t("REASON")} : ${
                                  trainProgress[0].errorCause.split("-")[1]
                                }`}</Typography>
                                <Link
                                  href={getSklearnLink(
                                    parseInt(
                                      trainProgress[0].errorCause.split("-")[0]
                                    )
                                      ? parseInt(
                                          trainProgress[0].errorCause.split(
                                            "-"
                                          )[0]
                                        )
                                      : trainProgress[0].id_model
                                  )}
                                  target="_blank"
                                  sx={{ fontSize: "15px" }}
                                >
                                  {t("SEE_SKLEARN_DOCUMENTATION")}
                                </Link>
                              </>
                            )}
                        </Typography>
                        {trainProgress.map((model: any, indexTrain: number) => (
                          <Grid
                            container
                            key={indexTrain}
                            sx={{
                              "& .css-eglki6-MuiLinearProgress-root": {
                                height: "8px",
                              },
                              marginBottom: "4vh",
                              justifyContent: "center",
                            }}
                          >
                            {" "}
                            <Box className={trainClasses.modelName}>
                              <Typography>
                                {capitalizeText(model.name)}
                              </Typography>
                            </Box>
                            <Box className={trainClasses.modelProgress}>
                              <LinearProgressWithLabel
                                value={
                                  (model.train_progress * 100) /
                                  model.nbr_iteration
                                }
                              />
                            </Box>
                          </Grid>
                        ))}
                      </CardContent>
                      {parseInt(trainProgress[0].user_id) === connectedUserId &&
                        !checkTrainSessionIsCompleted(trainProgress) &&
                        trainProgress[0].sessionStatus === "pending" && (
                          <Grid container>
                            {" "}
                            <Grid
                              item
                              xs={11.8}
                              className={
                                trainClasses.cancelTrainButtonContainer
                              }
                            >
                              <Button
                                onClick={() => {
                                  handleCancel(trainProgress[0].session_id);
                                }}
                                variant="outlined"
                                className={trainClasses.cancelTrainButton}
                              >
                                {t("CANCEL_TRAINING")}
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                    </Card>{" "}
                  </Grid>
                )
              )}
            </Grid>

            <Grid container className={trainClasses.launchTrainContainer}>
              <Button
                onClick={() => {
                  launchNewTrain();
                }}
                variant="outlined"
                className={trainClasses.textTransformer}
                disabled={getNumberOfPendingTrain() >= 5}
              >
                {t("LAUNCH_NEW_TRAIN")}
              </Button>
            </Grid>
          </>
        ) : (
          <BigLoader />
        )}
      </Grid>

      <Grid container className={classes.trainModelStepperContainer}>
        <ButtonStepper
          disableNext={disableButton()}
          disableBack={!trainFinished}
          onClickBack={handleBack}
          onClick={handleNext}
        />
      </Grid>
    </Grid>
  );
};

export default TrainModel;
