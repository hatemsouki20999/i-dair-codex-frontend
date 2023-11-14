import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  Switch,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import ButtonStepper from "../buttonStepper/buttonStepper";
import {
  editHyperparameterError,
  setActiveStep,
  setIsBack,
  setListModelToTrain,
  setListTrainingProgressForConnectedUser,
} from "../../../redux/reducers/trainModel.slice";
import { useEffect, useState } from "react";
import StepperStyles from "../../../styles/StepperStyles";
import { getGroupTrainingProgress } from "../../../services/trainModel.services";
import { useTranslation } from "react-i18next";
import { setHyperParametersListForTrain } from "../../../redux/reducers/settings.slice";
import deepClone from "deep-clone";
import {
  capitalizeText,
  changeHyperparameterTraitement,
  changeMixedHyperparameters,
} from "../../../utils/functions";
import HyperparametersFields from "../../settings/hyperparametersFields";
import { modelSelection } from "../../../interfaces/trainModel.interface";

const ModelSelection = () => {
  const { t } = useTranslation();
  const classes = StepperStyles();
  const dispatch: AppDispatch = useDispatch();

  let { listGroupTrainingProgress } = useSelector(
    (state: RootState) => state.trainModel
  );
  let { hyperParametersListForTrain } = useSelector(
    (state: RootState) => state.settings
  );

  const [modelsChanged, setModelsChanged] = useState(false);
  const [isNext, setIsNext] = useState(false);

  const [requiredCheckedModel, setRequiredCheckedModel] = useState(false);

  useEffect(() => {
    dispatch(setListTrainingProgressForConnectedUser(null));
    const newArray = hyperParametersListForTrain.map((item: any) => ({
      ...item,
      checked: false,
    }));
    dispatch(setHyperParametersListForTrain(newArray));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isNext && validateChecked() && listGroupTrainingProgress.length < 5) {
      let listModel = hyperParametersListForTrain.filter(
        (model: any) => model.checked
      );
      dispatch(setListModelToTrain(listModel));
      dispatch(setActiveStep(2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelsChanged]);

  const handleChangeCheckbox = (event: any, model: any) => {
    let newListHyperparams: Array<any> = deepClone(hyperParametersListForTrain);
    const modelIndex: any = hyperParametersListForTrain.findIndex(
      (elem: any) => elem.id === model.id
    );

    if (modelIndex !== -1) {
      newListHyperparams[modelIndex].checked = event.target.checked
        ? event.target.checked
        : !newListHyperparams[modelIndex].checked;
      dispatch(setHyperParametersListForTrain(newListHyperparams));
    }

    if (event.target.checked) {
      setRequiredCheckedModel(false);
    } else {
      const updatedListHyperparams = [...newListHyperparams];
      const updatedItem = {
        ...updatedListHyperparams[modelIndex],
        advancedParams: false,
        featureSelection: false,
      };
      updatedListHyperparams[modelIndex] = updatedItem;
      dispatch(setHyperParametersListForTrain(updatedListHyperparams));
    }
  };

  const handleChangeFeatureSelection = (model: any) => {
    let newListHyperparams: Array<any> = deepClone(hyperParametersListForTrain);
    const modelIndex: any = hyperParametersListForTrain.findIndex(
      (elem: any) => elem.id === model.id
    );

    const updatedListHyperparams = [...newListHyperparams];
    const updatedItem = {
      ...updatedListHyperparams[modelIndex],
      featureSelection: !model.featureSelection,
    };
    updatedListHyperparams[modelIndex] = updatedItem;
    dispatch(setHyperParametersListForTrain(updatedListHyperparams));
  };

  const handleExpanded = (model: any) => {
    let newListHyperparams: Array<any> = deepClone(hyperParametersListForTrain);
    const modelIndex: any = hyperParametersListForTrain.findIndex(
      (elem: any) => elem.id === model.id
    );
    const updatedListHyperparams = [...newListHyperparams];
    const updatedItem = {
      ...updatedListHyperparams[modelIndex],
      expanded: !newListHyperparams[modelIndex].expanded,
      advancedParams: false,
    };
    updatedListHyperparams[modelIndex] = updatedItem;
    dispatch(setHyperParametersListForTrain(updatedListHyperparams));
  };

  const handleBack = () => {
    dispatch(setActiveStep(0));
    dispatch(setIsBack(true));
  };

  const validateChecked = () => {
    let checkedModel: any = hyperParametersListForTrain.filter(
      (elem: any) => elem.checked === true
    );
    if (!checkedModel || (checkedModel && checkedModel.length === 0)) {
      return false;
    } else {
      return true;
    }
  };

  const handleNext = async () => {
    dispatch(editHyperparameterError());
    if (!validateChecked()) {
      setRequiredCheckedModel(true);
    } else {
      await dispatch(getGroupTrainingProgress());
      setModelsChanged(!modelsChanged);
      setIsNext(true);
    }
  };

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
      hyperParametersListForTrain
    );

    dispatch(setHyperParametersListForTrain(newHyperParametersListByModel));
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
      hyperParametersListForTrain
    );

    dispatch(setHyperParametersListForTrain(newHyperParametersListByModel));
  };

  const displayDefaultParams = (e: any, model: any) => {
    let newListHyperparams: Array<any> = deepClone(hyperParametersListForTrain);
    const modelIndex: any = hyperParametersListForTrain.findIndex(
      (elem: any) => elem.id === model.id
    );

    if (modelIndex !== -1) {
      newListHyperparams[modelIndex].advancedParams =
        !newListHyperparams[modelIndex].advancedParams;
      dispatch(setHyperParametersListForTrain(newListHyperparams));
    }
  };

  return (
    <>
      <Grid container className={classes.modelSelectionContainer}>
        {hyperParametersListForTrain.length !== 0 &&
          hyperParametersListForTrain[0] && (
            <Grid container className={classes.typeModelContainer}>
              <Typography className={classes.typeModelText}>
                {t("LIST_OF")} {hyperParametersListForTrain[0]["type"]}{" "}
                {t("MODELS")}
              </Typography>
            </Grid>
          )}
        {hyperParametersListForTrain.map(
          (model: modelSelection, modelIndex: number) => {
            return (
              <Accordion
                className={classes.accordionContainer}
                key={modelIndex}
                expanded={model.expanded}
              >
                <AccordionSummary
                  onClick={() => {
                    handleExpanded(model);
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-label="Expand"
                  aria-controls="additional-actions1-content"
                  id="additional-actions1-header"
                >
                  {" "}
                  <Box className={classes.boxCursor}>
                    <FormControlLabel
                      aria-label="Acknowledge"
                      control={<Checkbox checked={model.checked} />}
                      label={
                        <InputLabel sx={{ fontWeight: 400, color: "black" }}>
                          {capitalizeText(model.name)}
                        </InputLabel>
                      }
                      onChange={(event: any) => {
                        handleChangeCheckbox(event, model);
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {model.hyperparameters &&
                  model.hyperparameters.length !== 0 ? (
                    <>
                      {!!model.available_feature_selection && (
                        <Grid container>
                          {" "}
                          <FormControlLabel
                            control={
                              <Switch
                                checked={model.featureSelection}
                                onChange={() =>
                                  handleChangeFeatureSelection(model)
                                }
                              />
                            }
                            label={t("WITH_FEATURE_SELECTION")}
                          />
                        </Grid>
                      )}

                      <Grid container>
                        <Grid item>
                          {" "}
                          <Typography
                            color="textSecondary"
                            className={classes.hyperparamsText}
                          >
                            {t("HYPER_PARAMETER")} &ensp;
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Link href={model.sklearnLink} target="_blank">
                            {" "}
                            {t("LINK_TO_SKLEARN")}{" "}
                          </Link>
                        </Grid>
                      </Grid>

                      <>
                        {model.advancedParams ? (
                          <>
                            <HyperparametersFields
                              models={model}
                              handleChangeHyperparameter={
                                handleChangeHyperparameter
                              }
                              handleChangeMixedHyperparameters={
                                handleChangeMixedHyperparameters
                              }
                              fromTrain={true}
                              setErrorInput={null}
                            />
                          </>
                        ) : (
                          <Grid
                            container
                            className={classes.paramButtonContainer}
                          >
                            <Button
                              variant="outlined"
                              onClick={(e) => displayDefaultParams(e, model)}
                            >
                              {t("ADVANCED_PARAMS")}
                            </Button>
                          </Grid>
                        )}
                      </>
                    </>
                  ) : (
                    <Typography color="textSecondary">
                      {t("NO_HYPERPARAMETERS")}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          }
        )}

        {requiredCheckedModel && (
          <Grid container className={classes.requiredModelContainer}>
            {" "}
            <Typography className={classes.requiredModelText}>
              {t("CHECK_AT_LEAST_ONE_MODEL")}
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid container className={classes.modelSelectionStepperContainer}>
        <ButtonStepper
          disableNext={false}
          onClickBack={handleBack}
          onClick={handleNext}
        />
      </Grid>
    </>
  );
};

export default ModelSelection;
