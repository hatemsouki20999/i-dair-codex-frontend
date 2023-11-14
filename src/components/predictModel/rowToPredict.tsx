import Typography from "@mui/material/Typography";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getListOfColumns,
  getTemplateExample,
  predictingModel,
} from "../../services/predictModel.services";
import { reset, setPredictResult } from "../../redux/reducers/prediction.slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";
import PredictionResultTable from "./predictionResultTable";
import UploadComponent from "../uploadDataset/uploadComponent";
import FilePredictionResult from "./filePredictionResult";
import base64 from "base64-js";
import { useTranslation } from "react-i18next";
import { traceSpan } from "../../tracing";

export default function RowToPredict() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [rowData, setRowData] = useState<any>();
  const [errorSelectedModels, setErrorSelectedModels] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const classes = descriptiveStatisticsStyles();
  const [selectedModels, setSelectedModels] = useState<Array<any>>([]);
  const [selectedDataFormat, setSelectedDataFormat] = useState("form");
  const [predictionDataset, setPredictionDataset] = useState({
    value: "",
    errorMessage: "",
  });
  const [predictionFile, setPredictionFile] = useState("");

  const {
    columnList,
    predictResult,
    filtredModels,
    selectedTargetForPrediction,
    selectedDatasetToPredict,
  } = useSelector((state: RootState) => state.prediction);

  const scrollToElement = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  const isAllSelected =
    filtredModels.length > 0 && selectedModels.length === filtredModels.length;

  const handleChangeRowData = (event: any) => {
    let newRowData: any = { ...rowData };
    newRowData[event.target.name] = event.target.value;
    setRowData(newRowData);
  };
  const handleSubmitRowData = async () => {
    if (selectedModels.length !== 0) {
      let cleanData = { ...rowData };
      Object.keys(columnList).forEach((key: any, index) => {
        if (key !== selectedTargetForPrediction) {
          if (columnList[key].type === "Numeric") {
            cleanData[key] = [parseFloat(cleanData[key])];
          } else {
            cleanData[key] = [cleanData[key]];
          }
        }
      });
      await traceSpan(
        "Trace of predicting model",
        async (trace_id: string, span_id: string) => {
          await dispatch(
            predictingModel({
              idModels: selectedModels.map((elem: any) => elem.id),
              data: cleanData,
              isFile: false,
              trace_id: trace_id,
              span_id: span_id,
            })
          );
        }
      );

      setErrorSelectedModels(false);
    } else {
      setErrorSelectedModels(true);
    }
  };

  const goBack = () => {
    dispatch(reset());
  };

  useEffect(() => {
    if (selectedDatasetToPredict.id !== 0) {
      traceSpan(
        "Trace of get list of columns",
        async (trace_id: string, span_id: string) => {
          await dispatch(
            getListOfColumns({
              idDataset: selectedDatasetToPredict.id,
              trace_id: trace_id,
              span_id: span_id,
            })
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeSelectedModels = (event: any) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedModels(
        selectedModels.length === filtredModels.length ? [] : filtredModels
      );
      setErrorSelectedModels(false);
      return;
    }
    setSelectedModels(value);
    if (value.length !== 0) {
      setErrorSelectedModels(false);
    } else {
      setErrorSelectedModels(true);
    }
  };

  const handleFormErrors = (errors: any) => {
    if (selectedModels.length === 0) {
      setErrorSelectedModels(true);
    } else {
      setErrorSelectedModels(false);
    }
  };

  useEffect(() => {
    if (predictResult) {
      scrollToElement();
    }
  }, [predictResult]);

  const getValidatorValue = (element: any) => {
    return rowData ? rowData[element] : "";
  };

  const handleChangeDataFormat = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedDataFormat((event.target as HTMLInputElement).value);
    //reset data when changing data format
    setPredictionDataset({
      value: "",
      errorMessage: "",
    });
    setPredictionFile("");
    setRowData({});
    setErrorSelectedModels(false);
    dispatch(setPredictResult(null));
  };

  const deleteDataset = () => {
    setPredictionFile("");
    setPredictionDataset({
      value: "",
      errorMessage: "",
    });
  };

  const changePredictionDataset = (event: any) => {
    setPredictionFile(event.target.files[0]);
    if (event.target.files[0]?.name?.length === 0) {
      setPredictionDataset({
        value: "",
        errorMessage: t("ERROR_UPLOAD_REQUIRED"),
      });
    } else {
      setPredictionDataset({
        errorMessage: "",
        value: event.target.files[0].name,
      });
    }
  };

  const submitWithFile = async () => {
    if (selectedModels.length !== 0) {
      if (predictionFile) {
        await traceSpan(
          "Trace of predicting model",
          async (trace_id: string, span_id: string) => {
            await dispatch(
              predictingModel({
                idModels: selectedModels.map((elem: any) => elem.id),
                data: predictionFile,
                isFile: true,
                trace_id: trace_id,
                span_id: span_id,
              })
            );
          }
        );
      } else {
        setPredictionDataset({
          value: "",
          errorMessage: t("ERROR_REQUIRED"),
        });
      }

      setErrorSelectedModels(false);
    } else {
      setErrorSelectedModels(true);
    }
  };

  const downloadTemplate = async () => {
    await traceSpan(
      "Trace of get template example",
      async (trace_id: string, span_id: string) => {
        await dispatch(
          getTemplateExample({
            idDataset: selectedDatasetToPredict.id,
            target: selectedTargetForPrediction,
            trace_id: trace_id,
            span_id: span_id,
          })
        )
          .then((data: any) => {
            if (data?.payload?.file_contents) {
              let fileName = "prediction_template.csv";
              const encodedData = data.payload.file_contents[fileName];
              const decodedData = new TextDecoder("utf-8").decode(
                base64.toByteArray(encodedData)
              );
              const byteArray = new Uint8Array(decodedData.length);

              for (let i = 0; i < decodedData.length; i++) {
                byteArray[i] = decodedData.charCodeAt(i);
              }

              const blob = new Blob([byteArray]);
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              URL.revokeObjectURL(url);
              document.body.removeChild(link);
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    );
  };

  return (
    <>
      <Grid container className={classes.handleBackContainer} onClick={goBack}>
        <ArrowBackIcon color="primary" />{" "}
        <Typography className={classes.goBackTitle}>{t("GO_BACK")}</Typography>
      </Grid>
      <Grid container className={classes.selectModelContainer}>
        <InputLabel id="mutiple-select-label">{t("MODELS")}</InputLabel>
        <Select
          labelId="mutiple-select-label"
          multiple
          value={selectedModels}
          onChange={handleChangeSelectedModels}
          renderValue={(selected) =>
            selected.map((elem: any) => elem.name).join(",")
          }
          className={classes.selectModel}
          error={errorSelectedModels}
        >
          <MenuItem value="all">
            <ListItemIcon>
              <Checkbox
                checked={isAllSelected}
                indeterminate={
                  selectedModels.length > 0 &&
                  selectedModels.length < filtredModels.length
                }
              />
            </ListItemIcon>
            <ListItemText primary={t("SELECT_ALL")} />
          </MenuItem>
          {filtredModels.map((model: any) => {
            return (
              <MenuItem key={model.id} value={model}>
                {" "}
                <ListItemIcon>
                  <Checkbox checked={selectedModels.indexOf(model) > -1} />
                </ListItemIcon>
                <ListItemText
                  primary={`${model.name} (${model.sessionName}, ${model.email})`}
                />
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      <FormControl className={classes.predictionFileContainer}>
        <FormLabel
          id="demo-radio-buttons-group-label"
          className={classes.predictionDataText}
        >
          {t("PREDICTION_DATA")}
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={selectedDataFormat}
          onChange={handleChangeDataFormat}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value="form"
            control={<Radio />}
            label={t("WEB_FORM")}
          />
          <FormControlLabel
            value="file"
            control={<Radio />}
            label={t("FILE_UPLOAD")}
          />
        </RadioGroup>
      </FormControl>
      {selectedDataFormat === "form" ? (
        <>
          <ValidatorForm
            container
            spacing={3}
            onSubmit={handleSubmitRowData}
            onError={(errors) => handleFormErrors(errors)}
          >
            <Grid container spacing={3}>
              {Object.keys(columnList).map(
                (element: any, index) =>
                  selectedTargetForPrediction !== element &&
                  (columnList[element].type === "Numeric" ? (
                    <Grid key={index} item xs={12} sm={4}>
                      <TextValidator
                        xs={12}
                        sm={6}
                        label={element}
                        onChange={handleChangeRowData}
                        name={element}
                        value={getValidatorValue(element)}
                        validators={["required", "isFloat"]}
                        errorMessages={[t("ERROR_REQUIRED"), t("ERROR_NUMBER")]}
                        variant="standard"
                      />
                    </Grid>
                  ) : (
                    <Grid key={index} item xs={12} sm={4}>
                      <SelectValidator
                        sx={{ m: 1, minWidth: 207, margin: 0 }}
                        label={element}
                        onChange={handleChangeRowData}
                        name={element}
                        value={getValidatorValue(element)}
                        validators={["required"]}
                        errorMessages={[t("ERROR_REQUIRED")]}
                        variant="standard"
                      >
                        {columnList[element].values.map(
                          (option: any, columnIndex: number) => (
                            <MenuItem key={columnIndex} value={option}>
                              {option}
                            </MenuItem>
                          )
                        )}
                      </SelectValidator>
                    </Grid>
                  ))
              )}

              <Grid
                item
                xs={12}
                sm={12}
                sx={{ textAlign: "end", marginRight: "18%" }}
              >
                <br />
                <Button variant="contained" type="submit">
                  {t("SUBMIT")}
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </>
      ) : (
        <>
          <Grid container>
            <Grid
              container
              sx={{
                marginTop: "2vh",
              }}
            >
              <Button variant="outlined" onClick={downloadTemplate}>
                {" "}
                {t("DOWNlOAD_TEMPLATE")}
              </Button>
            </Grid>

            <Grid item xs={4.5}>
              <UploadComponent
                name={t("PREDICTION_DATASET")}
                changeHandler={changePredictionDataset}
                closeFile={deleteDataset}
                state={predictionDataset}
                fromPrediction={true}
              />
            </Grid>

            <Grid container>
              <Grid
                item
                xs={8}
                sm={5}
                sx={{
                  marginBottom: "2vh",
                  marginTop: "2vh",
                }}
              >
                <br />
                <Button variant="contained" onClick={submitWithFile}>
                  {t("SUBMIT")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      <Grid
        container
        className={classes.predictionResultContainer}
        sx={{
          "& .css-1pxa9xg-MuiAlert-message": { width: "100%" },
          overflow: "auto",
          height: "auto",
        }}
        ref={scrollRef}
      >
        {predictResult &&
          (predictResult?.success ? (
            <>
              <Alert severity="success" className={classes.alertContainer}>
                <AlertTitle>{t("PREDICTION_RESULT")}</AlertTitle>
              </Alert>
              {selectedDataFormat === "form" ? (
                <PredictionResultTable predictResult={predictResult} />
              ) : (
                <FilePredictionResult />
              )}

              <br />
            </>
          ) : (
            <>
              <Alert severity="error" className={classes.alertContainer}>
                <AlertTitle>{t("PREDICTION_RESULT")}</AlertTitle>
                {predictResult.message}
              </Alert>
              <br />
            </>
          ))}
      </Grid>{" "}
    </>
  );
}
