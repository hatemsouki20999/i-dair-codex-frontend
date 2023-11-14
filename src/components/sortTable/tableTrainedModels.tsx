import {
  Alert,
  AlertColor,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import Toast from "../toast/toast";
import { useTranslation } from "react-i18next";
import trainedModelsStyle from "../../styles/trainedModelsStyle";
import {
  capitalizeText,
  downloadPlots,
  exportMetricsTable,
  getMetricsKey,
  groupByTask,
  removeDuplicates,
} from "../../utils/functions";
import { EnhancedTableToolbar } from "./tableToolbar";
import PaginationTable from "./pagination";
import { EnhancedTableHead, getComparator, stableSort } from "./sortTable";
import Rowtable from "./tableRow";
import { NewModel } from "../../interfaces/model.interface";
import { useState } from "react";
import { AppDispatch } from "../../redux/store/store";
import { useDispatch } from "react-redux";
export interface TableInterface {
  task: string;
  listTrainedModelsWithMetrics: any;
  listTrainedModel: any[];
  selectedSessionForPrediction: any;
  handleCloseToast: (
    type: AlertColor,
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
  showToast: any;
  getPlot: (task: string) => React.ReactNode | null;
  fileContentClassification: string;
  fileContentRegression: string;
  setSelectedModel: (value: number) => void;
  setShowVariableImportance: any;
  getRocCurve: () => React.ReactNode | null;
  plotDataInfo: string;
}
const TableTrainedModels = (props: TableInterface) => {
  const {
    task,
    listTrainedModelsWithMetrics,
    listTrainedModel,
    selectedSessionForPrediction,
    handleCloseToast,
    showToast,
    getPlot,
    fileContentRegression,
    fileContentClassification,
    setSelectedModel,
    setShowVariableImportance,
    getRocCurve,
    plotDataInfo,
  } = props;
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const classes = trainedModelsStyle();
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleClick = (model: any, task: string) => {
    const taskSelected = selectedTasks[task] || [];
    const sessionSelected = selectedSession[task] || [];

    const selectedIndex = taskSelected.indexOf(model.id);
    const selectedIndexSession = sessionSelected.indexOf(model.session_id);

    const newSelected = [...taskSelected];
    const sessionsIds = [...sessionSelected];

    if (selectedIndex === -1) {
      newSelected.push(model.id);
      sessionsIds.push(model.session_id);
    } else {
      newSelected.splice(selectedIndex, 1);
      sessionsIds.splice(selectedIndexSession, 1);
    }

    setSelectedTasks((prevSelectedTasks) => ({
      ...prevSelectedTasks,
      [task]: newSelected,
    }));
    setSelectedSessions((prevSelectedSessions) => ({
      ...prevSelectedSessions,
      [task]: sessionsIds,
    }));
  };

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    task: string
  ) => {
    const isChecked = event.target.checked;
    const areAllSelected =
      selectedTasks[task]?.length === listTrainedModelsWithMetrics[task].length;

    if (isChecked) {
      if (areAllSelected) {
        setSelectedTasks((prevSelectedTasks) => ({
          ...prevSelectedTasks,
          [task]: [],
        }));
        setSelectedSessions((prevSelectedSessions) => ({
          ...prevSelectedSessions,
          [task]: [],
        }));
      } else {
        let newSelected: any[] = [];
        let newSession: any[] = [];

        newSelected = listTrainedModelsWithMetrics[task].map((n: any) => n.id);
        newSession = listTrainedModelsWithMetrics[task].map(
          (x: any) => x.session_id
        );

        setSelectedTasks((prevSelectedTasks) => ({
          ...prevSelectedTasks,
          [task]: newSelected,
        }));
        setSelectedSessions((prevSelectedSessions) => ({
          ...prevSelectedSessions,
          [task]: newSession,
        }));
      }
    } else {
      setSelectedTasks((prevSelectedTasks) => ({
        ...prevSelectedTasks,
        [task]: [],
      }));
      setSelectedSessions((prevSelectedSessions) => ({
        ...prevSelectedSessions,
        [task]: [],
      }));
    }
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [selectedTasks, setSelectedTasks] = useState<{
    [task: string]: any[];
  }>({});
  const [selectedSession, setSelectedSessions] = useState<{
    [task: string]: any[];
  }>({});

  const downloadTable = (task: string) => {
    exportMetricsTable(
      listTrainedModelsWithMetrics[task],
      task,
      getMetricsKey(groupByTask(listTrainedModel)[task]),
      t
    );
  };

  const isSelected = (id: number, task: string) => {
    const selectedTaskIds = selectedTasks[task];
    return selectedTaskIds ? selectedTaskIds.indexOf(id) !== -1 : false;
  };

  const showVariableReport = (modelId: number) => {
    dispatch(setShowVariableImportance(true));
    setSelectedModel(modelId);
  };
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleDowload = (task: string) => {
    if (task === "regression") {
      downloadPlots(fileContentRegression);
    } else {
      downloadPlots(fileContentClassification);
    }
  };

  return (
    <Grid container key={task}>
      <Grid container gap={2} sx={{ marginBottom: "10px" }}>
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
        <Paper sx={{ width: "100%", mb: 2 }}>
          {selectedTasks[task] && selectedTasks[task].length > 0 && (
            <Box sx={{ width: "100%" }}>
              <EnhancedTableToolbar
                numSelected={
                  selectedTasks[task] ? selectedTasks[task].length : 0
                }
                selectedIds={selectedTasks[task] || []}
                selectedSessionsIds={removeDuplicates(
                  selectedSession[task] || []
                )}
                setSelected={setSelectedTasks}
                setSessions={setSelectedSessions}
              />
            </Box>
          )}
          <TableContainer className={classes.tableContainer}>
            {listTrainedModelsWithMetrics[task].length !== 0 ? (
              <>
                <Table stickyHeader aria-label="sticky table">
                  <EnhancedTableHead
                    numSelected={
                      selectedTasks[task] ? selectedTasks[task].length : 0
                    }
                    onSelectAllClick={(event) =>
                      handleSelectAllClick(event, task)
                    }
                    rowCount={listTrainedModelsWithMetrics[task].length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    metrics={getMetricsKey(groupByTask(listTrainedModel)[task])}
                    displayTarget={true}
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
                      .map((model: NewModel, index: number) => {
                        const isItemSelected = isSelected(model.id, task);
                        return (
                          <Rowtable
                            model={model}
                            showVariableReport={showVariableReport}
                            index={index}
                            isItemSelected={isItemSelected}
                            handleClick={() => {
                              handleClick(model, task);
                            }}
                            task={task}
                            listTrainedModel={listTrainedModel}
                            type={true}
                          />
                        );
                      })}
                  </TableBody>
                </Table>
              </>
            ) : (
              <Typography>{t("NO_DATA")}</Typography>
            )}
          </TableContainer>
        </Paper>
      </Grid>
      <Grid container className={classes.paginationContainer}>
        <PaginationTable
          task={task}
          listTrainedModelsWithMetrics={listTrainedModelsWithMetrics}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          selectedSessionForPrediction={selectedSessionForPrediction}
          setPage={setPage}
        />
      </Grid>
      {selectedSessionForPrediction && (
        <>
          <Box sx={{ marginBottom: "25px" }}>
            <Button
              variant="contained"
              component="label"
              sx={{
                textTransform: "none",
              }}
              onClick={() => {
                handleDowload(task);
              }}
            >
              {t("EXPORT_DATA_ASSOCIATED_WITH_PLOTS")}
            </Button>
            <Box sx={{ marginTop: "30px" }}>{getPlot(task)}</Box>
          </Box>
          <Box>
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
                    <Alert severity="info" className={classes.alert}>
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
          </Box>
        </>
      )}
      <Toast handleClose={handleCloseToast} showToast={showToast} />
    </Grid>
  );
};

export default TableTrainedModels;
