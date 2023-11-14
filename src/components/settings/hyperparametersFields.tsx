import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { TagsInput } from "react-tag-input-component";
import {
  HyperParamsFieldsProps,
  SequenceParams,
} from "../../interfaces/settings.interface";
import {
  areAllArraysEmpty,
  capitalizeText,
  changeListHyperParamWithSequenceValues,
  changeListHyperParamWithSequenceValuesForMixedArray,
  generateNonRepeatingRandomIntegers,
  generateNonRepeatingRandomMixed,
  getSpecificArrayFromMixedArray,
} from "../../utils/functions";
import settingsStyles from "../../styles/settingsStyles";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useState } from "react";
import deepClone from "deep-clone";
import {
  setHyperParametersListByModel,
  setHyperParametersListForTrain,
} from "../../redux/reducers/settings.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useTranslation } from "react-i18next";
import ErrorIcon from "@mui/icons-material/Error";

const HyperparametersFields = (props: HyperParamsFieldsProps) => {
  let classes = settingsStyles();
  const { t } = useTranslation();

  let {
    models,
    fromTrain,
    handleChangeHyperparameter,
    handleChangeMixedHyperparameters,
    setErrorInput,
  } = props;
  const dispatch = useDispatch();
  let [listSequenceHyperPramas, setListSequenceHyperPramas] = useState<
    Array<SequenceParams>
  >([]);

  let [foldType, setFoldType] = useState("number");
  let [foldNumber, setFoldNumber] = useState("");

  let { hyperParametersListByModel, hyperParametersListForTrain } = useSelector(
    (state: RootState) => state.settings
  );
  const [hyperparameterErrors, setHyperparameterErrors] = useState<
    Record<string, number[]>
  >({});

  useEffect(() => {
    let foldDefaultValue =
      models?.hyperparameters["folds_number"]["defaultValue"];
    if (foldDefaultValue) {
      if (foldDefaultValue === "none") {
        setFoldType("none");
      } else if (!isNaN(parseInt(foldDefaultValue))) {
        setFoldType("number");
        setFoldNumber(foldDefaultValue);
      }
    }
  }, [models]);

  const handleCheckSequenceHyperParams = (
    event: React.ChangeEvent<HTMLInputElement>,
    param: string,
    arrayType: string
  ) => {
    let sequenceParamIndex = listSequenceHyperPramas.findIndex(
      (elem: any) => elem.paramName === param
    );
    let newListSequenceHyperPramas = deepClone(listSequenceHyperPramas);

    if (sequenceParamIndex === -1 && event.target.checked) {
      newListSequenceHyperPramas.push({
        min: "",
        max: "",
        numberOfValues: "",
        paramName: param,
        maxError: false,
        numberOfValuesError: false,
      });
    } else {
      newListSequenceHyperPramas.splice(sequenceParamIndex, 1);

      let newListHyperParams: Array<any> = [];
      if (arrayType !== "mixed array") {
        newListHyperParams = changeListHyperParamWithSequenceValues(
          fromTrain ? hyperParametersListForTrain : hyperParametersListByModel,
          null,
          models,
          param
        );
      } else {
        newListHyperParams =
          changeListHyperParamWithSequenceValuesForMixedArray(
            fromTrain
              ? hyperParametersListForTrain
              : hyperParametersListByModel,
            null,
            models,
            param
          );
      }
      if (!fromTrain) {
        dispatch(setHyperParametersListByModel(newListHyperParams));
      } else {
        dispatch(setHyperParametersListForTrain(newListHyperParams));
      }
    }

    setListSequenceHyperPramas(newListSequenceHyperPramas);
  };

  const showGenerateValues = (param: string) => {
    let sequenceParamIndex = listSequenceHyperPramas.findIndex(
      (elem: any) => elem.paramName === param
    );
    if (sequenceParamIndex !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const getSequenceParam = (param: string) => {
    return listSequenceHyperPramas.find(
      (elem: any) => elem.paramName === param
    );
  };
  const validateFloat = (value: any) => {
    // Check if the value is a valid float number
    return /^\d*\.?\d*$/.test(value);
  };
  const handleChangeSequenceHyperParams = (
    event: any,
    param: string,
    key: "max" | "min" | "numberOfValues",
    arrayType: string
  ) => {
    let value = event.target.value;
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    let newListSequenceHyperPramas = deepClone(listSequenceHyperPramas);
    let sequenceParamIndex = listSequenceHyperPramas?.findIndex(
      (elem: any) => elem.paramName === param
    );
    if (
      sequenceParamIndex !== -1 &&
      (!isNaN(parseFloat(event.target.value)) || !event.target.value)
    ) {
      newListSequenceHyperPramas[sequenceParamIndex][key] = sanitizedValue;
      setListSequenceHyperPramas(newListSequenceHyperPramas);

      let minValue = listSequenceHyperPramas[sequenceParamIndex]?.min || 0;
      let maxValue = listSequenceHyperPramas[sequenceParamIndex]?.max || 0;
      let numberOfValues =
        listSequenceHyperPramas[sequenceParamIndex]?.numberOfValues || 0;

      if (key === "min") {
        if (parseFloat(value) >= maxValue && maxValue !== 0) {
          newListSequenceHyperPramas[sequenceParamIndex].maxError = true;
        } else {
          newListSequenceHyperPramas[sequenceParamIndex].maxError = false;
        }

        if (
          maxValue - parseFloat(value) + 1 < numberOfValues &&
          numberOfValues !== 0 &&
          arrayType === "ints array"
        ) {
          newListSequenceHyperPramas[sequenceParamIndex].numberOfValuesError =
            true;
        } else {
          newListSequenceHyperPramas[sequenceParamIndex].numberOfValuesError =
            false;
        }
      }

      if (key === "max") {
        if (minValue >= parseFloat(value) && parseFloat(value) !== 0) {
          newListSequenceHyperPramas[sequenceParamIndex].maxError = true;
        } else {
          newListSequenceHyperPramas[sequenceParamIndex].maxError = false;
        }

        if (
          parseFloat(value) - minValue + 1 < numberOfValues &&
          numberOfValues !== 0 &&
          arrayType === "ints array"
        ) {
          newListSequenceHyperPramas[sequenceParamIndex].numberOfValuesError =
            true;
        } else {
          newListSequenceHyperPramas[sequenceParamIndex].numberOfValuesError =
            false;
        }
      }

      if (key === "numberOfValues") {
        if (
          maxValue - minValue + 1 < parseInt(value) &&
          maxValue !== 0 &&
          minValue !== 0 &&
          parseInt(value) !== 0 &&
          arrayType === "ints array"
        ) {
          newListSequenceHyperPramas[sequenceParamIndex].numberOfValuesError =
            true;
        } else {
          newListSequenceHyperPramas[sequenceParamIndex].numberOfValuesError =
            false;
        }
      }

      setListSequenceHyperPramas(newListSequenceHyperPramas);
    }
  };

  const generateValues = (param: string, arrayType: string) => {
    let listOfValues: Array<any> = [];
    let newListSequenceHyperPramas = deepClone(listSequenceHyperPramas);
    let sequenceParamIndex: number = newListSequenceHyperPramas.findIndex(
      (elem: any) => elem.paramName === param
    );
    if (sequenceParamIndex !== -1) {
      let minValue = newListSequenceHyperPramas[sequenceParamIndex]?.min || 0;
      let maxValue = newListSequenceHyperPramas[sequenceParamIndex]?.max || 0;
      let numberOfValues =
        newListSequenceHyperPramas[sequenceParamIndex]?.numberOfValues || 0;

      if (minValue >= maxValue && arrayType === "ints array") {
        newListSequenceHyperPramas[sequenceParamIndex].maxError = true;
        setListSequenceHyperPramas(newListSequenceHyperPramas);
      } else {
        newListSequenceHyperPramas[sequenceParamIndex].maxError = false;
        newListSequenceHyperPramas[sequenceParamIndex].numberOfValuesError =
          false;

        setListSequenceHyperPramas(newListSequenceHyperPramas);
        if (!newListSequenceHyperPramas[sequenceParamIndex]?.maxError) {
          if (arrayType === "floats array" || arrayType === "mixed array") {
            listOfValues = generateNonRepeatingRandomMixed(
              (!minValue ? 0 : minValue).toString(),
              (!maxValue ? 0 : maxValue).toString(),
              !numberOfValues ? 0 : numberOfValues
            );
          } else if (arrayType === "ints array") {
            listOfValues = generateNonRepeatingRandomIntegers(
              (!minValue ? 0 : minValue).toString(),
              (!maxValue ? 0 : maxValue).toString(),
              !numberOfValues ? 0 : numberOfValues
            );
          }
          let sortedValues = listOfValues?.sort((a, b) => a - b);
          sortedValues.forEach((elem) => elem.toString());
        }
      }
    }

    let newListHyperParams: Array<any> = [];
    if (arrayType !== "mixed array") {
      newListHyperParams = changeListHyperParamWithSequenceValues(
        fromTrain ? hyperParametersListForTrain : hyperParametersListByModel,
        listOfValues,
        models,
        param
      );
    } else {
      newListHyperParams = changeListHyperParamWithSequenceValuesForMixedArray(
        fromTrain ? hyperParametersListForTrain : hyperParametersListByModel,
        listOfValues,
        models,
        param
      );
    }
    if (!fromTrain) {
      dispatch(setHyperParametersListByModel(newListHyperParams));
    } else {
      dispatch(setHyperParametersListForTrain(newListHyperParams));
    }
  };

  const disableGenerateValue = (param: string) => {
    let sequenceParam: SequenceParams | undefined =
      listSequenceHyperPramas.find((elem: any) => elem.paramName === param);
    if (
      sequenceParam?.maxError ||
      sequenceParam?.numberOfValuesError ||
      (!sequenceParam?.numberOfValues && sequenceParam?.numberOfValues !== 0) ||
      !sequenceParam?.max ||
      !sequenceParam?.min
    ) {
      return true;
    } else {
      return false;
    }
  };

  const displayGenerateValues = (param: any, arrayType: string) => {
    return (
      <Grid item xs={12} className={classes.generateNumbersContainer}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(event) => {
                handleCheckSequenceHyperParams(event, param, arrayType);
              }}
            />
          }
          label={t("GENERATE_SEQUENCE_NUMBER")}
        />
        {showGenerateValues(param) && (
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                size="small"
                value={getSequenceParam(param)?.min}
                label={t("MIN")}
                onChange={(event: any) => {
                  handleChangeSequenceHyperParams(
                    event,
                    param,
                    "min",
                    arrayType
                  );
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  step: "any",
                }}
                error={!validateFloat(getSequenceParam(param)?.min)}
              />
            </Grid>
            <Grid item xs={3} className={classes.errorContainer}>
              <TextField
                size="small"
                value={getSequenceParam(param)?.max}
                label={t("MAX")}
                onChange={(event: any) => {
                  handleChangeSequenceHyperParams(
                    event,
                    param,
                    "max",
                    arrayType
                  );
                }}
                error={
                  getSequenceParam(param)?.maxError ||
                  !validateFloat(getSequenceParam(param)?.max)
                }
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  step: "any",
                }}
              />
              {getSequenceParam(param)?.maxError && (
                <Tooltip
                  title={t("MAX_GREATER_THEN_MIN")}
                  placement="right-start"
                >
                  <ErrorIcon sx={{ color: "red", width: "2vh" }} />
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={3} className={classes.errorContainer}>
              <TextField
                size="small"
                value={getSequenceParam(param)?.numberOfValues}
                label={t("LENGTH")}
                onChange={(event: any) => {
                  handleChangeSequenceHyperParams(
                    event,
                    param,
                    "numberOfValues",
                    arrayType
                  );
                }}
                error={getSequenceParam(param)?.numberOfValuesError}
              />
              {getSequenceParam(param)?.numberOfValuesError && (
                <Tooltip
                  title={t("NUMBER_OF_VALUES_ERROR")}
                  placement="right-start"
                >
                  <ErrorIcon sx={{ color: "red", width: "2vh" }} />
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={2.5}>
              {" "}
              <Button
                variant="outlined"
                onClick={() => {
                  generateValues(param, arrayType);
                }}
                disabled={disableGenerateValue(param)}
              >
                {t("GENERATE")}
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  };

  const handleChangeFoldType = (
    event: any,
    idModel: number,
    paramName: string,
    type: string
  ) => {
    setFoldType((event.target as HTMLInputElement).value);
    if (event.target.value === "number") {
      handleChangeHyperparameter("", idModel, paramName, type);
    } else {
      handleChangeHyperparameter("none", idModel, paramName, type);
      setFoldNumber("");
    }
  };

  const handleChangeFoldHyperparameter = (
    event: any,
    idModel: number,
    paramName: string,
    type: string
  ) => {
    setFoldNumber(event.target.value);
    handleChangeHyperparameter(event.target.value, idModel, paramName, type);
  };

  return (
    <>
      {Object.keys(models?.hyperparameters)?.map(
        (param: string, paramIndex: number) => {
          return (
            <Grid
              item
              xs={12}
              spacing={2}
              className={classes.paramContainer}
              key={paramIndex}
            >
              <Grid container>
                <Grid item xs={4} sm={3}>
                  <Grid container className={classes.titleContainer}>
                    <Grid item xs={8}>
                      <Typography className={classes.paramTitle}>
                        {capitalizeText(param)} <br /> (
                        {models?.hyperparameters[param].type})
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Tooltip
                        title={models?.hyperparameters[param].description}
                        placement="right-start"
                        className={classes.infoIcon}
                      >
                        <InfoIcon />
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={8} sm={9}>
                  {["ints array", "floats array"].includes(
                    models?.hyperparameters[param].type
                  ) ? (
                    <Grid container>
                      <>
                        {displayGenerateValues(
                          param,
                          models?.hyperparameters[param].type
                        )}
                      </>
                      <Grid item xs={12}>
                        {" "}
                        <TagsInput
                          value={models?.hyperparameters[param]["defaultValue"]}
                          onChange={(event: any) => {
                            const newErrors: any = { ...hyperparameterErrors };
                            const invalidNumberList = event.filter(
                              (number: any) => number < 0
                            );
                            newErrors[param] = invalidNumberList;
                            setHyperparameterErrors(newErrors);
                            handleChangeHyperparameter(
                              event,
                              models.id,
                              param,
                              models?.hyperparameters[param].type
                            );
                            setErrorInput(
                              newErrors && !areAllArraysEmpty(newErrors)
                            );
                          }}
                          name={param}
                          placeHolder={t("ENTER_VALUE").toString()}
                        />
                        {hyperparameterErrors[param] &&
                          hyperparameterErrors[param].length > 0 && (
                            <Grid
                              container
                              className={classes.invalidEmailContainer}
                            >
                              {hyperparameterErrors[param].map(
                                (number: any, errorIndex: any) => (
                                  <Typography key={errorIndex}>
                                    {number}&ensp;
                                  </Typography>
                                )
                              )}
                              <Typography>
                                {t("ENTER_POSITIVE_NUMBER")}
                              </Typography>
                            </Grid>
                          )}
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      {["int", "string"].includes(
                        models?.hyperparameters[param].type
                      ) ? (
                        <TextField
                          value={models?.hyperparameters[param]["defaultValue"]}
                          type={
                            models?.hyperparameters[param].type === "string"
                              ? "text"
                              : "number"
                          }
                          inputProps={{ min: 1, max: 10000 }}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            if (
                              models?.hyperparameters[param].type === "string"
                            ) {
                              handleChangeHyperparameter(
                                inputValue,
                                models.id,
                                param,
                                models?.hyperparameters[param].type
                              );
                            } else {
                              if (/^\d*\.?\d*$/.test(inputValue)) {
                                const parsedValue = parseFloat(inputValue);

                                if (
                                  !isNaN(parsedValue) &&
                                  parsedValue >= 1 &&
                                  parsedValue <= 10000
                                ) {
                                  // Check if it's a valid number within the desired range
                                  handleChangeHyperparameter(
                                    inputValue,
                                    models.id,
                                    param,
                                    models?.hyperparameters[param].type
                                  );
                                }
                              }
                            }
                          }}
                        />
                      ) : (
                        <>
                          {models?.hyperparameters[param].type ===
                          "strings array" ? (
                            <Select
                              multiple
                              value={
                                models?.hyperparameters[param].defaultValue
                              }
                              onChange={(event) => {
                                handleChangeHyperparameter(
                                  event.target.value,
                                  models.id,
                                  param,
                                  models?.hyperparameters[param].type
                                );
                              }}
                              sx={{ width: "90%" }}
                            >
                              {models?.hyperparameters[param]?.values.map(
                                (value: string, valueIndex: number) => {
                                  return (
                                    <MenuItem value={value} key={valueIndex}>
                                      {value}
                                    </MenuItem>
                                  );
                                }
                              )}
                            </Select>
                          ) : (
                            <>
                              {models?.hyperparameters[param].type ===
                              "mixed array" ? (
                                <Grid container>
                                  <>
                                    {models?.hyperparameters[
                                      param
                                    ].possible_values?.includes("string") && (
                                      <Grid item xs={6}>
                                        <Select
                                          multiple
                                          value={getSpecificArrayFromMixedArray(
                                            models?.hyperparameters[param][
                                              "defaultValue"
                                            ],
                                            "string"
                                          )}
                                          onChange={(event: any) => {
                                            handleChangeMixedHyperparameters(
                                              event.target.value,
                                              models.id,
                                              param,
                                              "string"
                                            );
                                          }}
                                          sx={{ width: "90%" }}
                                        >
                                          {models?.hyperparameters[
                                            param
                                          ]?.strings_values.map(
                                            (
                                              value: string,
                                              stringValueIndex: number
                                            ) => {
                                              return (
                                                <MenuItem
                                                  value={value}
                                                  key={stringValueIndex}
                                                >
                                                  {value}
                                                </MenuItem>
                                              );
                                            }
                                          )}
                                        </Select>
                                      </Grid>
                                    )}
                                  </>
                                  <>
                                    {models?.hyperparameters[
                                      param
                                    ].possible_values?.includes(
                                      "int",
                                      "float"
                                    ) && (
                                      <Grid item xs={12}>
                                        <Grid container>
                                          {displayGenerateValues(
                                            param,
                                            models?.hyperparameters[param].type
                                          )}
                                        </Grid>
                                        <TagsInput
                                          value={getSpecificArrayFromMixedArray(
                                            models?.hyperparameters[param][
                                              "defaultValue"
                                            ],
                                            "number"
                                          )}
                                          onChange={(event: any) => {
                                            const newErrors: any = {
                                              ...hyperparameterErrors,
                                            };
                                            const invalidNumberList =
                                              event.filter(
                                                (number: any) => number < 0
                                              );
                                            newErrors[param] =
                                              invalidNumberList;
                                            setHyperparameterErrors(newErrors);
                                            handleChangeMixedHyperparameters(
                                              event,
                                              models.id,
                                              param,
                                              "number"
                                            );
                                            setErrorInput(
                                              newErrors &&
                                                !areAllArraysEmpty(newErrors)
                                            );
                                          }}
                                          name={param}
                                          placeHolder={t(
                                            "ENTER_VALUE"
                                          ).toString()}
                                        />
                                        {hyperparameterErrors[param] &&
                                          hyperparameterErrors[param].length >
                                            0 && (
                                            <Grid
                                              container
                                              className={
                                                classes.invalidEmailContainer
                                              }
                                            >
                                              {hyperparameterErrors[param].map(
                                                (
                                                  number: any,
                                                  errorIndex: any
                                                ) => (
                                                  <Typography key={errorIndex}>
                                                    {number}&ensp;
                                                  </Typography>
                                                )
                                              )}
                                              <Typography>
                                                {t("ENTER_POSITIVE_NUMBER")}
                                              </Typography>
                                            </Grid>
                                          )}
                                      </Grid>
                                    )}
                                  </>

                                  <Grid />
                                </Grid>
                              ) : (
                                <>
                                  {models?.hyperparameters[param].type ===
                                  "booleans array" ? (
                                    <Select
                                      multiple
                                      value={
                                        models?.hyperparameters[param]
                                          .defaultValue
                                      }
                                      onChange={(event) => {
                                        handleChangeHyperparameter(
                                          event.target.value,
                                          models.id,
                                          param,
                                          models?.hyperparameters[param].type
                                        );
                                      }}
                                      sx={{ width: "90%" }}
                                    >
                                      {models?.hyperparameters[
                                        param
                                      ]?.values.map(
                                        (value: string, valueIndex: number) => {
                                          return (
                                            <MenuItem
                                              value={value}
                                              key={valueIndex}
                                            >
                                              {value.toString()}
                                            </MenuItem>
                                          );
                                        }
                                      )}
                                    </Select>
                                  ) : (
                                    <>
                                      {models?.hyperparameters[param].type ===
                                        "int/none" && (
                                        <Grid container>
                                          <Grid container>
                                            {" "}
                                            <FormControl>
                                              <RadioGroup
                                                sx={{ display: "block" }}
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={foldType}
                                                onChange={(event) => {
                                                  handleChangeFoldType(
                                                    event,
                                                    models.id,
                                                    param,
                                                    models?.hyperparameters[
                                                      param
                                                    ].type
                                                  );
                                                }}
                                              >
                                                <FormControlLabel
                                                  value="number"
                                                  control={<Radio />}
                                                  label={"number"}
                                                />
                                                <FormControlLabel
                                                  value="none"
                                                  control={<Radio />}
                                                  label={"none"}
                                                />
                                              </RadioGroup>
                                            </FormControl>
                                          </Grid>
                                          <Grid container>
                                            {foldType === "number" && (
                                              <TextField
                                                type="number"
                                                inputProps={{
                                                  min: 1,
                                                  max: 10000,
                                                }}
                                                defaultValue={foldNumber}
                                                value={foldNumber}
                                                onChange={(event) => {
                                                  const inputValue =
                                                    event.target.value;
                                                  if (
                                                    /^\d*\.?\d*$/.test(
                                                      inputValue
                                                    )
                                                  ) {
                                                    const parsedValue =
                                                      parseFloat(inputValue);

                                                    if (
                                                      !isNaN(parsedValue) &&
                                                      parsedValue >= 1 &&
                                                      parsedValue <= 10000
                                                    ) {
                                                      // Check if it's a valid number within the desired range
                                                      handleChangeFoldHyperparameter(
                                                        event,
                                                        models.id,
                                                        param,
                                                        models?.hyperparameters[
                                                          param
                                                        ].type
                                                      );
                                                    }
                                                  }
                                                }}
                                              />
                                            )}
                                          </Grid>
                                        </Grid>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          );
        }
      )}
    </>
  );
};

export default HyperparametersFields;
