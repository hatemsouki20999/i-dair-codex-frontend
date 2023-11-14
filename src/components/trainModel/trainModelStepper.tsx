import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { steps } from "../../utils/data";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import SetData from "./setData/setData";
import ModelSelection from "./modelSelection/modelSelection";
import TrainModel from "./train/trainModel";
import TrainResult from "./trainResult/TrainResult";
import { useEffect } from "react";
import { getGroupTrainingProgress } from "../../services/trainModel.services";
import {
  setActiveStep,
  setListGroupTrainingProgress,
  setSessionName,
} from "../../redux/reducers/trainModel.slice";
import BigLoader from "../Loader/bigLoader";
import { useTranslation } from "react-i18next";

const TrainModelStepper = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { activeStep, listGroupTrainingProgress } = useSelector(
    (state: RootState) => state.trainModel
  );
  useEffect(() => {
    dispatch(getGroupTrainingProgress());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  useEffect(() => {
    return () => {
      dispatch(setListGroupTrainingProgress(null));
      dispatch(setSessionName(undefined));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToCancelTrain = () => {
    dispatch(setActiveStep(2));
  };
  return (
    <Grid container>
      {listGroupTrainingProgress ? (
        listGroupTrainingProgress.length < 5 || activeStep === 2 ? (
          <>
            <Box sx={{ width: "100%", marginTop: "3vh" }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label: string) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box sx={{ width: "100%", marginTop: "3vh" }}>
              {(() => {
                switch (activeStep) {
                  case 0:
                    return <SetData />;
                  case 1:
                    return <ModelSelection />;
                  case 2:
                    return <TrainModel />;
                  case 3:
                    return <TrainResult />;
                  default:
                    return null;
                }
              })()}
            </Box>
          </>
        ) : (
          <Box sx={{ margin: "auto" }}>
            <Alert severity="warning">
              <AlertTitle>{t("MAXIMUM_TRAINING_REACHED")}</AlertTitle>
              <Grid sx={{ display: "flex" }}>
                <strong>{t("ONLY_N_ALLOWED")}</strong>,{" "}
                <Typography>{t("WAIT")}</Typography> &ensp;
                <Typography
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={goToCancelTrain}
                >
                  {" "}
                  {t("ABORT")}
                </Typography>
              </Grid>
            </Alert>
          </Box>
        )
      ) : (
        <BigLoader />
      )}
    </Grid>
  );
};
export default TrainModelStepper;
