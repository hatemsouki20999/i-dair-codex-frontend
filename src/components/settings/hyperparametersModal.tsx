import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AlertColor,
  Button,
  Grid,
  Link,
  Modal,
  Typography,
} from "@mui/material";
import { PropsModalI } from "../../interfaces/settings.interface";
import settingsStyles from "../../styles/settingsStyles";
import { useEffect, useState } from "react";
import {
  getHyperparameters,
  getModelsParams,
  resetSettings,
  saveHyperparameters,
  validateHyperparameter,
} from "../../services/settings.services";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setHyperParametersListByModel,
  setShowToast,
} from "../../redux/reducers/settings.slice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Toast from "../toast/toast";
import {
  capitalizeText,
  changeHyperparameterTraitement,
  changeMixedHyperparameters,
  convertHyperParameterToSubmitFormat,
  formatHyperParameters,
} from "../../utils/functions";
import HyperparametersFields from "./hyperparametersFields";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import { traceSpan } from "../../tracing";
import { Trace, TraceReset } from "../../interfaces/trainModel.interface";

const HyperparametersModal = (props: PropsModalI) => {
  let classes = settingsStyles();
  let { handleClose, open } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  let dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();

  let { hyperParametersListByModel, showToast } = useSelector(
    (state: RootState) => state.settings
  );

  useEffect(() => {
    traceSpan(
      "Trace of get hyperParameters",
      async (trace_id: string, span_id: string) => {
        const trace: Trace = {
          trace_id: trace_id,
          span_id: span_id,
        };
        await dispatch(getHyperparameters(trace)).then(
          async (hyperParametersList: any) => {
            await dispatch(getModelsParams(trace)).then((data: any) => {
              let hyperparamsFormatted: any = formatHyperParameters(
                hyperParametersList,
                data
              );
              dispatch(setHyperParametersListByModel(hyperparamsFormatted));
            });
          }
        );
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeHyperparameter = (
    event: any,
    idModel: number,
    paramName: string,
    type: string
  ) => {
    let newHyperParametersListByModel: any = changeHyperparameterTraitement(
      event,
      idModel,
      paramName,
      type,
      hyperParametersListByModel
    );
    dispatch(setHyperParametersListByModel(newHyperParametersListByModel));
  };

  const handleChangeMixedHyperparameters = (
    event: any,
    idModel: number,
    paramName: string,
    type: string
  ) => {
    let newHyperParametersListByModel: Array<any> = changeMixedHyperparameters(
      event,
      idModel,
      paramName,
      type,
      hyperParametersListByModel
    );
    dispatch(setHyperParametersListByModel(newHyperParametersListByModel));
  };

  const handleSubmit = (model: any) => {
    let params = Object.keys(model.hyperparameters).reduce(
      (result: any, param) => {
        result[param] = convertHyperParameterToSubmitFormat(
          model.hyperparameters[param]
        );
        return result;
      },
      {}
    );
    const paramsObject = JSON.stringify(params);
    const encodedString = encodeURIComponent(paramsObject);
    const body = {
      model_id: model.id,
      task: model.type,
      hyperparameters: encodedString,
    };
    setIsLoading(true);
    dispatch(validateHyperparameter(body)).then((res: any) => {
      if (res.payload.success) {
        dispatch(saveHyperparameters({ model_id: model.id, params }));
      }
      setIsLoading(false);
    });
  };
  const handleReset = async (model: any) => {
    await traceSpan(
      "Trace of reset hyperParameters ",
      async (trace_id: string, span_id: string) => {
        const traceReset: TraceReset = {
          modelId: model.id,
          trace_id: trace_id,
          span_id: span_id,
        };
        const resetData = await dispatch(resetSettings(traceReset));
        if (resetData?.payload?.success) {
          const trace: Trace = {
            trace_id: trace_id,
            span_id: span_id,
          };
          await dispatch(getHyperparameters(trace)).then(
            async (hyperParametersList: any) => {
              await dispatch(getModelsParams(trace)).then((data: any) => {
                let hyperparamsFormatted: any = formatHyperParameters(
                  hyperParametersList,
                  data
                );
                dispatch(setHyperParametersListByModel(hyperparamsFormatted));
                dispatch(
                  setShowToast({
                    open: true,
                    type: "success",
                    message: t("HYPERPARAMETERS_RESET"),
                  })
                );
              });
            }
          );
        }
      }
    );
  };

  const handleCloseToast = (
    type: AlertColor,
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      setShowToast({
        open: false,
        type,
        message: "",
      })
    );
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={classes.modalContainer}
    >
      <Grid className={classes.modalPaper}>
        <Grid container className={classes.modalTitleContainer}>
          {" "}
          <Typography className={classes.modalTitle} sx={{ fontSize: "2vh" }}>
            {t("CHANGE_HYPERPARAMETER_TITLE")}
          </Typography>
        </Grid>
        <Grid container>
          {hyperParametersListByModel?.map((models: any, index: number) => {
            return (
              <Grid container sx={{ marginBottom: "1.5vh" }} key={index}>
                {" "}
                <Accordion className={classes.accordionContainer}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
                  >
                    <Typography sx={{ fontSize: "1.5vh", fontWeight: "600" }}>
                      {capitalizeText(models.name)} &ensp; (
                      {capitalizeText(models.type)})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid
                      container
                      className={classes.hyperparametersContainer}
                    >
                      <Link href={models.sklearnLink} target="_blank">
                        {" "}
                        {t("LINK_TO_SKLEARN")}{" "}
                      </Link>
                      <HyperparametersFields
                        models={models}
                        handleChangeHyperparameter={handleChangeHyperparameter}
                        handleChangeMixedHyperparameters={
                          handleChangeMixedHyperparameters
                        }
                        fromTrain={false}
                        setErrorInput={setErrorInput}
                      />
                    </Grid>
                    <Grid container className={classes.submitContainer}>
                      <Grid xs={2}>
                        <Button
                          variant="outlined"
                          className={classes.buttons}
                          onClick={() => {
                            handleReset(models);
                          }}
                        >
                          {t("RESET")}
                        </Button>
                      </Grid>
                      <Grid xs={2}>
                        <Button
                          variant="contained"
                          className={classes.buttons}
                          onClick={() => {
                            handleSubmit(models);
                          }}
                          disabled={errorInput}
                        >
                          {isLoading ? (
                            <CircularProgress
                              size={24}
                              thickness={4}
                              color="inherit"
                            />
                          ) : (
                            t("SUBMIT")
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
        </Grid>
        <Toast handleClose={handleCloseToast} showToast={showToast} />
      </Grid>
    </Modal>
  );
};
export default HyperparametersModal;
