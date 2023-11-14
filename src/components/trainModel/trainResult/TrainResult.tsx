import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import trainModelStyles from "../../../styles/trainModelStyles";
import {
  getTrainedModels,
  getTrainingInProgressByUser,
} from "../../../services/trainModel.services";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  EnhancedTableHead,
  getComparator,
  stableSort,
} from "../../sortTable/sortTable";
import {
  setActiveStep,
  setBackFromTrainResult,
  setShowVariableImportance,
} from "../../../redux/reducers/trainModel.slice";
import VariableImportanceReport from "../../variableImportanceReport/variableImportanceReport";
import Plot from "../../descriptiveStatistics/variablePlot";
import ButtonStepper from "../buttonStepper/buttonStepper";
import {
  capitalizeText,
  downloadPlots,
  exportMetricsTable,
  groupByTask,
} from "../../../utils/functions";
import { useTranslation } from "react-i18next";
import BigLoader from "../../Loader/bigLoader";
import { plotCompare } from "../../../services/plotCompare";
import {
  ModelType,
  Trace,
  TrainModel,
} from "../../../interfaces/trainModel.interface";
import { NewModel } from "../../../interfaces/model.interface";
import Rowtable from "../../sortTable/tableRow";
import deepClone from "deep-clone";
import { traceSpan } from "../../../tracing";
import { rocCurve } from "../../../services/rocCurve";

const TrainResult = () => {
  const classes = trainModelStyles();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("");
  const [plotDataRegression, setPlotDataRegression] = useState<any>([]);
  const [plotDataClassification, setPlotDataClassification] = useState<any>([]);
  const [plotDataRocCurve, setPlotDataRocCurve] = useState<any>([]);
  const [plotDataInfo, setPlotDataInfo] = useState<string>("");
  const [fileContentRegression, setFileContentRegression] = useState<any>(null);
  const [fileContentClassification, setFileContentClassification] =
    useState<any>(null);
  const [selectedModel, setSelectedModel] = useState(0);
  const [selectedSessionForPrediction, setSelectedSessionForPrediction] =
    useState<any>(null);

  let {
    listTrainedModel,
    showVariableImportance,
    loaderTrainedModels,
    loaderPlot,
    loaderRocCurve,
  } = useSelector((state: RootState) => state.trainModel);

  const [listTrainedModelsWithMetrics, setListTrainedModelModelsWithMetrics] =
    useState<ModelType>({});

  useEffect(() => {
    traceSpan(
      "Trace of get train result",
      async (trace_id: string, span_id: string) => {
        const trace: Trace = {
          trace_id: trace_id,
          span_id: span_id,
        };
        await dispatch(getTrainedModels(trace)).then((data: any) => {
          let newList: NewModel[] = [];
          if (data.payload.data.trained_models?.length !== 0) {
            data.payload.data.trained_models?.forEach((model: TrainModel) => {
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
              setListTrainedModelModelsWithMetrics(groupByTask(newList));
            });
          } else {
            setListTrainedModelModelsWithMetrics({});
          }
        });
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const getMetricsKey = (array: Array<any>) => {
    let metrics: Array<string> = [];
    array?.map((model: any) => {
      const temp = model.metrics?.map((metric: any) => {
        return metric.key;
      });
      metrics.push(...temp);
      return true;
    });
    return Array.from(new Set(metrics));
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const showVariableReport = (modelId: number) => {
    dispatch(setShowVariableImportance(true));
    setSelectedModel(modelId);
  };
  const downloadTable = (task: any) => {
    exportMetricsTable(
      listTrainedModelsWithMetrics[task],
      task,
      getMetricsKey(groupByTask(listTrainedModel)[task]),
      t
    );
  };

  useEffect(() => {
    if (selectedSessionForPrediction) {
      let modelIdsRegression: Array<number> = [];
      let modelIdsClassification: Array<number> = [];
      if (
        listTrainedModelsWithMetrics["regression"] &&
        listTrainedModelsWithMetrics["regression"].length !== 0
      ) {
        listTrainedModelsWithMetrics["regression"].forEach((reg: any) => {
          modelIdsRegression = modelIdsRegression.concat(reg.id);
        });
      }
      if (
        listTrainedModelsWithMetrics["classification"] &&
        listTrainedModelsWithMetrics["classification"].length !== 0
      ) {
        listTrainedModelsWithMetrics["classification"].forEach((clas: any) => {
          modelIdsClassification = modelIdsClassification.concat(clas.id);
        });
      }
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
                  resClassification.payload.file_contents
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
                  modelIdsRegression = [];
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
                setPlotDataRegression(resRegression.payload.data);
                setFileContentRegression(resRegression.payload.file_contents);
              });
              modelIdsRegression = [];
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

  useEffect(() => {
    prepareTrainedModelWithMetrics(listTrainedModel);
  }, [listTrainedModel]);

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
            {plotDataRegression?.map((plotRegression: any) => (
              <Grid key={plotRegression.metic} xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {" "}
                  <Typography>{plotRegression.metric}</Typography>
                  <Plot
                    plotData={plotRegression.fig}
                    width="650"
                    height="410"
                  />
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
            {plotDataClassification?.map((plotClassification: any) => (
              <Grid key={plotClassification?.metric} xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {" "}
                  <Typography>{plotClassification?.metric}</Typography>
                  <Plot
                    plotData={plotClassification?.fig}
                    width="650"
                    height="410"
                  />
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
        setListTrainedModelModelsWithMetrics(groupByTask(newList));
      });
    } else {
      setListTrainedModelModelsWithMetrics({});
    }
  };
  const handleChangesession = (event: any, newValue: any) => {
    setSelectedSessionForPrediction(newValue);
    let newListTrainedModels: any = [];
    if (newValue) {
      newListTrainedModels = deepClone(listTrainedModel).filter(
        (elem: any) => elem.session_id === newValue
      );
    } else {
      newListTrainedModels = deepClone(listTrainedModel);
    }
    prepareTrainedModelWithMetrics(newListTrainedModels);
  };

  const handleDowload = (task: string) => {
    if (task === "regression") {
      downloadPlots(fileContentRegression);
    } else {
      downloadPlots(fileContentClassification);
    }
  };

  return (
    <>
      {!loaderTrainedModels ? (
        <>
          {!showVariableImportance ? (
            <Grid container>
              {Object.keys(listTrainedModelsWithMetrics).length !== 0 ? (
                <>
                  <Grid container sx={{ marginBottom: "10px" }}>
                    {" "}
                    <Grid item xs={2}>
                      {" "}
                      <Autocomplete
                        disablePortal
                        fullWidth
                        value={
                          selectedSessionForPrediction
                            ? getSessionList().find(
                                (option) =>
                                  option.session_id ===
                                  selectedSessionForPrediction
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

                  {Object.keys(listTrainedModelsWithMetrics)?.map(
                    (task: string, indexTask) => {
                      return (
                        <Grid container key={indexTask}>
                          <Grid container gap={2}>
                            <Grid item xs={11.2}>
                              {" "}
                              <Typography
                                sx={{
                                  color: "#1029b0",
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                }}
                              >
                                {capitalizeText(task)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              {" "}
                              <Button
                                variant="contained"
                                component="label"
                                sx={{ textTransform: "none" }}
                                onClick={() => {
                                  downloadTable(task);
                                }}
                              >
                                {t("EXPORT_THE_TABLE")}
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <TableContainer className={classes.tableContainer}>
                              {listTrainedModelsWithMetrics[task].length !==
                              0 ? (
                                <Table stickyHeader aria-label="sticky table">
                                  <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    metrics={getMetricsKey(
                                      groupByTask(listTrainedModel)[task]
                                    )}
                                    displayTarget={false}
                                  />
                                  <TableBody>
                                    {stableSort(
                                      listTrainedModelsWithMetrics[task],
                                      getComparator(order, orderBy)
                                    )
                                      .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                      )
                                      ?.map((model: any, index: number) => {
                                        return (
                                          <Rowtable
                                            model={model}
                                            showVariableReport={
                                              showVariableReport
                                            }
                                            index={index}
                                            isItemSelected={false}
                                            handleClick={() => {}}
                                            task={task}
                                            listTrainedModel={listTrainedModel}
                                            type={false}
                                          />
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Typography>{t("NO_TRAIN_RESULT")}</Typography>
                              )}
                            </TableContainer>
                          </Grid>
                          <Grid
                            container
                            className={classes.paginationContainer}
                          >
                            {listTrainedModelsWithMetrics[task].length !==
                              0 && (
                              <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={
                                  listTrainedModelsWithMetrics[task].length
                                }
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                              />
                            )}
                          </Grid>{" "}
                          {selectedSessionForPrediction && (
                            <>
                              <Grid container>
                                {" "}
                                <Box
                                  sx={{
                                    marginBottom: "25px",
                                  }}
                                >
                                  {" "}
                                  <Button
                                    variant="contained"
                                    component="label"
                                    sx={{
                                      textTransform: "none",
                                    }}
                                    onClick={() => handleDowload(task)}
                                  >
                                    {t("EXPORT_DATA_ASSOCIATED_WITH_PLOTS")}
                                  </Button>
                                </Box>
                                {getPlot(task)}
                              </Grid>
                              {task === "classification" && (
                                <Stack
                                  direction="column"
                                  justifyContent="center"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Box
                                    sx={{
                                      marginBottom: "25px",
                                      width: "100%",
                                    }}
                                  >
                                    {getRocCurve()}
                                  </Box>

                                  {plotDataInfo && (
                                    <Box className={classes.alertBox}>
                                      <Alert
                                        severity="info"
                                        className={classes.alert}
                                      >
                                        <Typography
                                          noWrap={false}
                                          className={classes.typographyAlert}
                                        >
                                          {plotDataInfo}
                                        </Typography>
                                      </Alert>
                                    </Box>
                                  )}
                                </Stack>
                              )}
                            </>
                          )}
                        </Grid>
                      );
                    }
                  )}
                </>
              ) : (
                <Typography>{t("NO_TRAIN_RESULT")}</Typography>
              )}
              <Grid container className={classes.backButtonContainer}>
                <ButtonStepper
                  onClickBack={() => {
                    dispatch(setActiveStep(2));
                    dispatch(setBackFromTrainResult(true));
                    dispatch(getTrainingInProgressByUser());
                  }}
                />
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
      ) : (
        <BigLoader />
      )}
    </>
  );
};
export default TrainResult;
