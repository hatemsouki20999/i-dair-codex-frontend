import { makeStyles } from "@mui/styles";

const trainModelStyles = makeStyles({
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
  paginationContainer: {
    width: "80% !important",
    margin: "auto",
    justifyContent: "end",
  },
  displayPlot: {
    marginTop: "5px !important",
    color: "grey",
    fontSize: "1.5vh !important",
  },
  trainStatusContainer: {
    justifyContent: "center",
  },
  trainStatusText: {
    marginBottom: "4vh !important",
    marginTop: "2vh !important",
  },
  modelName: {
    width: "25%",
  },
  modelProgress: {
    width: "40%",
  },
  bestPerformant: {
    display: "flex",
    alignItems: "center",
    color: "#4CAF50",
    justifyContent: "center",
  },
  cancelTrainButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1vh !important",
  },
  cancelTrainButton: {
    textTransform: "capitalize",
  },
  launchTrainContainer: {
    marginTop: "2vh",
    width: "84% !important",
    display: "flex !important",
    justifyContent: "flex-end",
  },
  textTransformer: {
    textTransform: "capitalize",
  },
  sessionContainer: { justifyContent: "center" },
  sessionCard: { width: "70% !important", marginBottom: "2vh" },
  currentSession: {
    boxShadow: "0 0 5px 4px #88bdf7c7 !important",
  },
  backButtonContainer: {
    justifyContent: "flex-end",
    marginLeft: "-13vw",
    marginBottom: "2vh",
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
});

export default trainModelStyles;
