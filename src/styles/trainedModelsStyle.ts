import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const trainedModelsStyle = makeStyles((theme: Theme) => ({
  bestPerformant: {
    display: "flex",
    alignItems: "center",
    color: "#4CAF50",
    justifyContent: "center",
  },
  displayPlot: {
    marginTop: "5px !important",
    color: "grey",
    fontSize: "1.5vh !important",
  },
  paginationContainer: {
    width: "95% !important",
    margin: "auto",
    justifyContent: "end",
  },
  tableContainer: {
    width: "100% !important",
    marginTop: "3vh",
    margin: "auto",
    paddingRight: "25px",
    maxWidth: "80vw",
    overflowX: "auto",
  },
  listModelsContainer: {
    marginTop: "3%",
  },
  selectDatasetContainer: {
    width: "100% !important",
  },
  tablesContainer: {
    marginTop: "3% !important",
  },
  bestPerformantModalText: {
    fontSize: "13px !important",
  },
  bestPerformantModalButton: {
    fontSize: "11px !important",
  },
  predictButton: {
    fontSize: "11px !important",
    cursor: "pointer",
  },
  disabledPredictButton: {
    fontSize: "11px !important",
    color: "rgba(0, 0, 0, 0.6) !important",
    borderColor: "rgba(0, 0, 0, 0.6) !important",
    cursor: "auto",
  },
  plotsContainer: {
    justifyContent: "center",
  },
  predictButtonConrainer: {
    display: "flex",
    alignItems: "center",
  },
  exportMetricsContainer: {
    display: "flex",
    cursor: "pointer",
  },
  selectContainer: {
    marginBottom: "1vh",
  },
  downloadDataContainer: {
    marginBottom: "1.5vh",
  },
  downloadContainer: {
    display: "flex",
  },
  downloadText: {
    fontSize: "15px !important",
    marginBottom: "5px !important",
  },
  downloadIcon: {
    cursor: "pointer",
  },
  alert: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    paddingBottom: "20px",
    width: "85%",
  },
  typographyAlert: {
    textAlign: "center",
  },
}));

export default trainedModelsStyle;
