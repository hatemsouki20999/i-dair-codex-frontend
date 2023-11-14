import { makeStyles } from "@mui/styles";

const variableReportStyles = makeStyles({
  handleBackContainer: {
    marginTop: "2vh",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: "3vh",
  },
  goBackTitle: {
    fontSize: "2.3vh !important",
    color: "#1976d2",
  },
  permutationImportanceContainer: {
    width: "95%",
  },
  featureEngineeringSummary: {
    width: "95%",
    marginBottom: "2vh",
  },
  hyperparameters: {
    width: "95%",
    marginBottom: "2vh",
  },
  settings: {
    width: "95%",
    marginBottom: "2vh",
  },
  hyperParametersContainer: {
    width: "95%",
    marginBottom: "2vh",
  },
  title: {
    fontWeight: "600 !important",
  },
  cancelTrainButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1vh !important",
  },
  cancelTrainButton: {
    textTransform: "capitalize",
  },
  tableTitle: {
    fontWeight: "bold !important",
  },
  downloadIconContainer: {
    justifyContent: "end",
    display: "flex",
  },
  downloadIcon: {
    cursor: "pointer",
  },
});

export default variableReportStyles;
