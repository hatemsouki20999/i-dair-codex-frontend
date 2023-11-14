import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { setShowVariableImportance } from "../../redux/reducers/trainModel.slice";
import variableReportStyles from "../../styles/variableReportStyles";
import Plot from "../descriptiveStatistics/variablePlot";
import deepClone from "deep-clone";
import { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useTranslation } from "react-i18next";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { PDFExport } from "@progress/kendo-react-pdf";
import {
  capitalizeText,
  downloadCSV,
  objectToCSV,
} from "../../utils/functions";
import { TransformedData } from "../../interfaces/variable.interface";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#9393931f",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const VariableImportanceReport = ({ selectedModel }: any) => {
  const { t } = useTranslation();
  let pdfExportHyperparameters = useRef<PDFExport>(null);
  let pdfExportFeatureEngineeringSummary = useRef<PDFExport>(null);
  let pdfExportSettings = useRef<PDFExport>(null);
  const dispatch: AppDispatch = useDispatch();
  const classes = variableReportStyles();
  const [modelData, setModalData] = useState<any>();

  const handleBack = () => {
    dispatch(setShowVariableImportance(false));
  };
  let { listTrainedModel } = useSelector(
    (state: RootState) => state.trainModel
  );

  useEffect(() => {
    let selectedModelData: any = listTrainedModel.find(
      (elem: any) => elem.id === selectedModel
    );
    setModalData(selectedModelData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadFeatureEngineeringSummary = () => {
    if (pdfExportFeatureEngineeringSummary.current) {
      pdfExportFeatureEngineeringSummary.current.save();
    }
  };
  const downloadHyperparameters = () => {
    if (pdfExportHyperparameters.current) {
      pdfExportHyperparameters.current.save();
    }
  };
  const downloadSettings = () => {
    if (pdfExportSettings.current) {
      pdfExportSettings.current.save();
    }
  };

  const transformData = (plotData: any[]): TransformedData => {
    const transformedData: TransformedData = {};
    plotData.forEach((data: any) => {
      data.y.forEach((label: string, index: any) => {
        transformedData[label] = data.x[index];
      });
    });
    return transformedData;
  };

  const handleDownload = (fileName: string) => {
    const transformedData = transformData(modelData.plot.data);
    const csvData = objectToCSV(transformedData);
    downloadCSV(csvData, fileName);
  };
  return (
    <Grid container>
      <Grid
        container
        className={classes.handleBackContainer}
        onClick={handleBack}
      >
        <ArrowBackIcon color="primary" />{" "}
        <Typography className={classes.goBackTitle}>{t("GO_BACK")}</Typography>
      </Grid>

      <Card className={classes.featureEngineeringSummary}>
        <CardContent>
          <Grid container>
            <Grid item xs={11}>
              <Typography gutterBottom variant="h6" component="h2">
                {t("FEATURE_ENGINEERING_SUMMARY")}
              </Typography>{" "}
            </Grid>
            <Grid xs={1} className={classes.downloadIconContainer}>
              {" "}
              <FileDownloadIcon
                onClick={downloadFeatureEngineeringSummary}
                color={"primary"}
                className={classes.downloadIcon}
              />
            </Grid>
          </Grid>
          <Grid container>
            <PDFExport
              paperSize="auto"
              margin="1cm"
              ref={pdfExportFeatureEngineeringSummary}
              fileName={`Feature Engineering Summary.pdf`}
            >
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {modelData &&
                        modelData.feature_engineering &&
                        Object.keys(modelData?.feature_engineering).map(
                          (elem) => {
                            return (
                              <>
                                {elem !== "selected_features" && (
                                  <StyledTableCell
                                    align="center"
                                    sx={{ width: "25%" }}
                                  >
                                    <Typography className={classes.tableTitle}>
                                      {capitalizeText(elem)}
                                    </Typography>
                                  </StyledTableCell>
                                )}
                              </>
                            );
                          }
                        )}
                      <StyledTableCell align="center" sx={{ width: "25%" }}>
                        {" "}
                        <Typography className={classes.tableTitle}>
                          {" "}
                          {t("NUMBER_OF_FEATURE")}
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {modelData &&
                        modelData.feature_engineering &&
                        Object.keys(modelData?.feature_engineering).map(
                          (elem) => {
                            return (
                              <>
                                {elem !== "selected_features" && (
                                  <StyledTableCell align="center">
                                    <Typography>
                                      {" "}
                                      {typeof modelData?.feature_engineering[
                                        elem
                                      ] === "object"
                                        ? modelData?.feature_engineering[
                                            elem
                                          ]?.join(", ")
                                        : modelData?.feature_engineering[elem]}
                                    </Typography>
                                  </StyledTableCell>
                                )}
                              </>
                            );
                          }
                        )}{" "}
                      <StyledTableCell align="center">
                        {" "}
                        {modelData?.feature_engineering?.selected_features}
                      </StyledTableCell>{" "}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>{" "}
            </PDFExport>
          </Grid>
        </CardContent>
      </Card>

      <Card className={classes.settings}>
        <CardContent>
          <Grid container>
            <Grid item xs={11}>
              <Typography gutterBottom variant="h6" component="h2">
                {t("SETTINGS")}
              </Typography>{" "}
            </Grid>
            <Grid xs={1} className={classes.downloadIconContainer}>
              {" "}
              <FileDownloadIcon
                onClick={downloadSettings}
                color={"primary"}
                className={classes.downloadIcon}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Box style={{ width: "100%" }}>
              <PDFExport
                paperSize="auto"
                margin="1cm"
                ref={pdfExportSettings}
                fileName={`Settings.pdf`}
              >
                <Box>
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">
                            {" "}
                            <Typography className={classes.tableTitle}>
                              {" "}
                              {t("PARAMETER")}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {" "}
                            <Typography className={classes.tableTitle}>
                              {" "}
                              {t("VALUE")}
                            </Typography>
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {modelData &&
                          modelData.settings &&
                          modelData?.settings?.map((elem: any) => {
                            return (
                              <TableRow>
                                <StyledTableCell align="center">
                                  <Typography>{elem.key}</Typography>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Typography>{elem.value}</Typography>
                                </StyledTableCell>
                              </TableRow>
                            );
                          })}{" "}
                      </TableBody>
                    </Table>
                  </TableContainer>{" "}
                </Box>
              </PDFExport>
            </Box>
          </Grid>
        </CardContent>
      </Card>

      <Card className={classes.hyperparameters}>
        <CardContent>
          <Grid container>
            <Grid item xs={11}>
              <Typography gutterBottom variant="h6" component="h2">
                {t("HYPERPARAMETER_VALUES")}
              </Typography>{" "}
            </Grid>
            <Grid xs={1} className={classes.downloadIconContainer}>
              {" "}
              <FileDownloadIcon
                onClick={downloadHyperparameters}
                color={"primary"}
                className={classes.downloadIcon}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Box style={{ width: "100%" }}>
              <PDFExport
                paperSize="auto"
                margin="1cm"
                ref={pdfExportHyperparameters}
                fileName={`Hyperparameters.pdf`}
              >
                <Box>
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">
                            {" "}
                            <Typography className={classes.tableTitle}>
                              {" "}
                              {t("PARAMETER")}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {" "}
                            <Typography className={classes.tableTitle}>
                              {" "}
                              {t("SEARCH_SPACE")}
                            </Typography>
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            {" "}
                            <Typography className={classes.tableTitle}>
                              {" "}
                              {t("OPTIMAL_PARAMETERS")}
                            </Typography>
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {modelData &&
                          modelData.parameters &&
                          modelData?.parameters?.map((elem: any) => {
                            return (
                              <TableRow>
                                <StyledTableCell align="center">
                                  <Typography>{elem.key}</Typography>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Typography>
                                    {JSON.stringify(elem.param_space)}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Typography>{elem.value}</Typography>
                                </StyledTableCell>
                              </TableRow>
                            );
                          })}{" "}
                      </TableBody>
                    </Table>
                  </TableContainer>{" "}
                </Box>
              </PDFExport>
            </Box>
          </Grid>
        </CardContent>
      </Card>
      <Card className={classes.permutationImportanceContainer}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {t("PERMUTATION_IMPORTANCE")}
          </Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ textTransform: "none" }}
            onClick={() => {
              handleDownload("data_plot");
            }}
          >
            {t("EXPORT_DATA_ASSOCIATED_WITH_PLOTS")}
          </Button>
          <Grid container>
            {" "}
            {modelData && (
              <Plot
                plotData={deepClone(modelData?.plot)}
                width="1250"
                height={modelData?.plot.layout.height}
              />
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default VariableImportanceReport;
