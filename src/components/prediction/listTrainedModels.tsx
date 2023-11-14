import {
  AlertColor,
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import trainedModelsStyle from "../../styles/trainedModelsStyle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { getTrainedModelsByDataset } from "../../services/trainModel.services";
import {
  setListTrainedModelModelsWithMetrics,
  setSelectedDatasetForListModels,
  setShowToast,
  setShowVariableImportance,
} from "../../redux/reducers/trainModel.slice";
import { getListDataset } from "../../services/uploadFile.services";
import {
  setDisplayPrediction,
  setFiltredModels,
  setSelectedDatasetToPredict,
  setSelectedTargetForPrediction,
  setSelectedSessionForPrediction,
} from "../../redux/reducers/prediction.slice";
import moment from "moment";
import VariableImportanceReport from "../variableImportanceReport/variableImportanceReport";
import Plot from "../descriptiveStatistics/variablePlot";
import deepClone from "deep-clone";
import { getListOfColumns } from "../../services/predictModel.services";
import { groupByTask } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import BigLoader from "../Loader/bigLoader";
import { plotCompare } from "../../services/plotCompare";
import { NewModel } from "../../interfaces/model.interface";
import { TrainModel } from "../../interfaces/trainModel.interface";
import TableTrainedModels from "../sortTable/tableTrainedModels";
import { traceSpan } from "../../tracing";
import { rocCurve } from "../../services/rocCurve";

const ListTrainedModels = () => {
  const { t } = useTranslation();
  const classes = trainedModelsStyle();
  const dispatch: AppDispatch = useDispatch();

  const [requiredDataset, setRequiredDataset] = useState(false);
  const [selectedModel, setSelectedModel] = useState(0);
  const [plotDataRegression, setPlotDataRegression] = useState<any>([]);
  const [plotDataClassification, setPlotDataClassification] = useState<any>([]);
  const [plotDataRocCurve, setPlotDataRocCurve] = useState<any>([]);
  const [plotDataInfo, setPlotDataInfo] = useState<string>("");
  let {
    listTrainedModel,
    selectedDatasetForListModels,
    showVariableImportance,
    loaderTrainedModels,
    listTrainedModelsWithMetrics,
    loaderPlot,
    showToast,
    loaderRocCurve,
  } = useSelector((state: RootState) => state.trainModel);

  const { listDataSet } = useSelector(
    (state: RootState) => state.uploadDataset
  );
  const [fileContentRegression, setFileContentRegression] =
    useState<string>("");
  const [fileContentClassification, setFileContentClassification] =
    useState<string>("");
  const {
    selectedDatasetToPredict,
    selectedTargetForPrediction,
    selectedSessionForPrediction,
  } = useSelector((state: RootState) => state.prediction);

  useEffect(() => {
    traceSpan(
      "Trace of get list dataset",
      async (trace_id: string, span_id: string) => {
        await dispatch(
          getListDataset({ trace_id: trace_id, span_id: span_id })
        );
      }
    );

    if (selectedDatasetToPredict.id) {
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

  useEffect(() => {
    if (selectedDatasetForListModels !== 0) {
      traceSpan(
        "Trace of get trained models by dataset",
        async (trace_id: string, span_id: string) => {
          await dispatch(
            getTrainedModelsByDataset({
              idDataset: selectedDatasetForListModels,
              trace_id: trace_id,
              span_id: span_id,
            })
          ).then((data: any) => {
            let newListTrainedModels: any = [];
            if (selectedTargetForPrediction) {
              newListTrainedModels = deepClone(
                data.payload.data.trained_models
              ).filter(
                (elem: any) => elem.target === selectedTargetForPrediction
              );
            } else {
              newListTrainedModels = deepClone(
                data.payload.data.trained_models
              );
            }
            prepareTrainedModelWithMetrics(newListTrainedModels);
          });
        }
      );
    } else {
      dispatch(setListTrainedModelModelsWithMetrics({}));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDatasetForListModels]);

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
  const handleChangeDataset = async (event: any, newValue: any) => {
    if (newValue) {
      dispatch(setSelectedDatasetForListModels(newValue.id));
      dispatch(setSelectedDatasetToPredict(newValue));
      setRequiredDataset(false);
    } else {
      dispatch(setSelectedDatasetForListModels(0));
      setRequiredDataset(true);
      dispatch(
        setSelectedDatasetToPredict({ id: 0, file_name: "", country: "" })
      );
    }
    await traceSpan(
      "Trace of get list of columns",
      async (trace_id: string, span_id: string) => {
        dispatch(
          getListOfColumns({
            idDataset: newValue.id,
            trace_id: trace_id,
            span_id: span_id,
          })
        );
      }
    );
    dispatch(setSelectedTargetForPrediction(""));
    dispatch(setSelectedSessionForPrediction(null));
  };

  const handleChangeTarget = (event: any, newValue: any) => {
    dispatch(setSelectedTargetForPrediction(newValue));
    let newListTrainedModels: any = [];
    if (newValue) {
      newListTrainedModels = deepClone(listTrainedModel).filter(
        (elem: any) =>
          elem.target === newValue &&
          (!selectedSessionForPrediction ||
            elem.session_id === selectedSessionForPrediction)
      );
    } else {
      newListTrainedModels = deepClone(listTrainedModel);
    }
    if (!newValue && selectedSessionForPrediction) {
      handleChangesession(undefined, selectedSessionForPrediction);
    } else {
      prepareTrainedModelWithMetrics(newListTrainedModels);
    }
  };

  const handleChangesession = (event: any, newValue: any) => {
    dispatch(setSelectedSessionForPrediction(newValue));
    let newListTrainedModels: any = [];

    if (newValue) {
      newListTrainedModels = deepClone(listTrainedModel).filter(
        (elem: any) => elem.session_id === newValue
      );
    } else {
      newListTrainedModels = deepClone(listTrainedModel);
      if (event) {
        dispatch(setSelectedTargetForPrediction(null));
      }
    }
    prepareTrainedModelWithMetrics(newListTrainedModels);
  };

  const prepareTrainedModelWithMetrics = (listModels: any) => {
    let newList: NewModel[] = [];
    if (listModels.length !== 0) {
      listModels.forEach((model: TrainModel) => {
        let newModel: NewModel = {
          id: model.id,
          id_dataset: model.id_dataset,
          id_model: model.id_model,
          name: model.name,
          run_id: model.run_id,
          train_progress: model.train_progress,
          train_status: model.train_status,
          task: model.task,
          target: model.target,
          is_best: model.is_best,
          email: model.email,
          session_id: model.session_id,
          sessionName: model.session_name,
          created_at: model.created_at,
        };
        model.metrics.map((metric: any) => {
          return (newModel[metric.key] = metric.value);
        });
        newList.push(newModel);
        dispatch(setListTrainedModelModelsWithMetrics(groupByTask(newList)));
      });
    } else {
      dispatch(setListTrainedModelModelsWithMetrics({}));
    }
  };

  const multiplePredict = async () => {
    if (Object.keys(listTrainedModelsWithMetrics).length !== 0) {
      dispatch(
        setFiltredModels(
          listTrainedModelsWithMetrics[
            Object.keys(listTrainedModelsWithMetrics)[0]
          ]
        )
      );
      dispatch(setDisplayPrediction(true));
    }
  };

  const getUsedTargets = () => {
    let tempUsedTargets: any[] = [];
    Object.keys(listTrainedModelsWithMetrics).forEach((type) =>
      listTrainedModelsWithMetrics[type].forEach((model: any) => {
        if (!tempUsedTargets.includes(model.target)) {
          tempUsedTargets.push(model.target);
        }
      })
    );
    return tempUsedTargets;
  };

  const getSessionList = () => {
    let sessionList: any[] = [];
    Object.keys(listTrainedModelsWithMetrics).forEach((type) =>
      listTrainedModelsWithMetrics[type].forEach((model: any) => {
        if (
          !sessionList.some(
            (session) => session.session_id === model.session_id
          )
        ) {
          const sessionObject = {
            sessionName: model.sessionName,
            session_id: model.session_id,
          };
          sessionList.push(sessionObject);
        }
      })
    );
    return sessionList;
  };

  useEffect(() => {
    if (selectedSessionForPrediction) {
      let modelIdsRegression: Array<number> = [];
      let modelIdsClassification: Array<number> = [];
      Object.keys(listTrainedModelsWithMetrics)?.forEach((task: string) => {
        if (task === "regression") {
          modelIdsRegression = modelIdsRegression.concat(
            listTrainedModelsWithMetrics[task].map((elem: any) => elem.id)
          );
        }
        if (task === "classification") {
          modelIdsClassification = modelIdsClassification.concat(
            listTrainedModelsWithMetrics[task].map((elem: any) => elem.id)
          );
        }
      });
      try {
        traceSpan(
          "Trace of plot compare",
          async (trace_id: string, span_id: string) => {
            if (modelIdsClassification.length !== 0) {
              await dispatch(
                plotCompare({
                  models_ids: modelIdsClassification,
                  trace_id: trace_id,
                  span_id: span_id,
                })
              ).then(async (resClassification: any) => {
                setPlotDataClassification(resClassification?.payload.data);
                setFileContentClassification(
                  resClassification?.payload.file_contents
                );
                if (modelIdsRegression.length !== 0) {
                  await dispatch(
                    plotCompare({
                      models_ids: modelIdsRegression,
                      trace_id: trace_id,
                      span_id: span_id,
                    })
                  ).then((resRegression: any) => {
                    setPlotDataRegression(resRegression?.payload.data);
                    setFileContentRegression(
                      resRegression?.payload.file_contents
                    );
                  });
                }
              });
            } else if (modelIdsRegression.length !== 0) {
              await dispatch(
                plotCompare({
                  models_ids: modelIdsRegression,
                  trace_id: trace_id,
                  span_id: span_id,
                })
              ).then((resRegression: any) => {
                setPlotDataRegression(resRegression?.payload.data);
                setFileContentRegression(resRegression?.payload.file_contents);
              });
            }
          }
        );

        traceSpan(
          "Trace of roc curve",
          async (trace_id: string, span_id: string) => {
            if (modelIdsClassification.length !== 0) {
              const models_ids = modelIdsClassification.join("-");
              await dispatch(
                rocCurve({
                  models_ids: models_ids,
                  trace_id: trace_id,
                  span_id: span_id,
                })
              ).then((res: any) => {
                setPlotDataRocCurve(res?.payload.data);
                setPlotDataInfo(res?.payload.info);
              });
            }
            modelIdsClassification = [];
          }
        );
      } catch (error) {
        console.error("Error :", error);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTrainedModelsWithMetrics, selectedSessionForPrediction]);

  const getPlot = (task: string) => {
    if (!loaderPlot) {
      if (task === "regression" && Array.isArray(plotDataRegression)) {
        return (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {plotDataRegression?.map((r: any) => (
              <Grid key={r.metric} xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {" "}
                  <Typography>{r.metric}</Typography>
                  <Plot plotData={r.fig} width="650" height="410" />
                </Box>
              </Grid>
            ))}
          </Grid>
        );
      } else if (
        task === "classification" &&
        Array.isArray(plotDataClassification)
      ) {
        return (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {plotDataClassification?.map((c: any) => (
              <Grid key={c?.metric} xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {" "}
                  <Typography>{c?.metric}</Typography>
                  <Plot plotData={c?.fig} width="650" height="410" />
                </Box>
              </Grid>
            ))}
          </Grid>
        );
      }

      return null;
    } else {
      return <BigLoader />;
    }
  };

  const getRocCurve = () => {
    if (!loaderRocCurve) {
      return (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid xs={12}>
            <Plot plotData={plotDataRocCurve} width="1450" height="700" />
          </Grid>
        </Grid>
      );
    } else {
      return <BigLoader />;
    }
  };

  return (
    <>
      {!showVariableImportance ? (
        <Grid container className={classes.listModelsContainer}>
          <Grid
            container
            spacing={2}
            className={classes.selectDatasetContainer}
          >
            <Grid item xs={7}>
              <Grid container spacing={2} className={classes.selectContainer}>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    value={selectedDatasetToPredict}
                    id="combo-box-demo"
                    options={listDataSet}
                    getOptionLabel={(option: any) =>
                      option.file_name
                        ? `${option.study_name} (${option.country}, ${moment(
                            option.created_at
                          ).format("DD/MM/YYYY HH:mm:SS")})`
                        : ""
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("DATASET")}
                        error={requiredDataset}
                        helperText={requiredDataset ? t("ERROR_REQUIRED") : ""}
                      />
                    )}
                    onChange={(event: any, newValue: any) => {
                      handleChangeDataset(event, newValue);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    value={
                      selectedSessionForPrediction
                        ? getSessionList().find(
                            (option) =>
                              option.session_id === selectedSessionForPrediction
                          )
                        : null
                    }
                    id="combo-box-demo"
                    options={getSessionList().map((option) => ({
                      ...option,
                      key: `session-${option.session_id}`,
                    }))}
                    getOptionLabel={(option: any) =>
                      option && option.sessionName ? option.sessionName : ""
                    }
                    renderInput={(params) => (
                      <TextField {...params} label={t("SESSION_NAME")} />
                    )}
                    onChange={(event: any, newValue: any) => {
                      handleChangesession(
                        event,
                        newValue ? newValue.session_id : null
                      );
                    }}
                    disabled={getSessionList().length === 0}
                  />
                  {!selectedSessionForPrediction && (
                    <Typography className={classes.displayPlot}>
                      {t("DISPLAY_PLOT")}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    value={selectedTargetForPrediction}
                    id="combo-box-demo"
                    options={getUsedTargets()}
                    getOptionLabel={(option: any) => option}
                    renderInput={(params) => (
                      <TextField {...params} label={t("TARGET")} />
                    )}
                    onChange={(event: any, newValue: any) => {
                      handleChangeTarget(event, newValue);
                    }}
                    disabled={getUsedTargets().length === 0}
                  />
                </Grid>
                <Grid item xs={6} className={classes.predictButtonConrainer}>
                  <Button
                    variant="outlined"
                    title={t("PREDICT").toString()}
                    onClick={multiplePredict}
                    disabled={
                      !selectedTargetForPrediction ||
                      Object.keys(listTrainedModelsWithMetrics).length === 0
                    }
                    className={
                      !selectedTargetForPrediction ||
                      Object.keys(listTrainedModelsWithMetrics).length === 0
                        ? classes.disabledPredictButton
                        : classes.predictButton
                    }
                  >
                    {" "}
                    {t("PREDICT")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.tablesContainer}>
            {!loaderTrainedModels ? (
              Object.keys(listTrainedModelsWithMetrics).length !== 0 ? (
                <>
                  {Object.keys(listTrainedModelsWithMetrics).map(
                    (task: string) => {
                      if (listTrainedModelsWithMetrics[task].length !== 0) {
                        return (
                          <TableTrainedModels
                            task={task}
                            listTrainedModelsWithMetrics={
                              listTrainedModelsWithMetrics
                            }
                            getPlot={getPlot}
                            getRocCurve={getRocCurve}
                            selectedSessionForPrediction={
                              selectedSessionForPrediction
                            }
                            handleCloseToast={handleCloseToast}
                            showToast={showToast}
                            setShowVariableImportance={
                              setShowVariableImportance
                            }
                            setSelectedModel={setSelectedModel}
                            fileContentRegression={fileContentRegression}
                            fileContentClassification={
                              fileContentClassification
                            }
                            listTrainedModel={listTrainedModel}
                            plotDataInfo={plotDataInfo}
                          />
                        );
                      }
                      return null;
                    }
                  )}
                </>
              ) : (
                <>
                  {selectedDatasetForListModels !== 0 && (
                    <Typography>{t("NO_DATA")}</Typography>
                  )}
                </>
              )
            ) : (
              <BigLoader />
            )}
          </Grid>
        </Grid>
      ) : (
        <>
          {selectedModel !== 0 && (
            <VariableImportanceReport selectedModel={selectedModel} />
          )}
        </>
      )}
    </>
  );
};
export default ListTrainedModels;
