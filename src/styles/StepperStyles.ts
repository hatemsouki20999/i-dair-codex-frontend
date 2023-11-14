import { makeStyles } from "@mui/styles";

const StepperStyles = makeStyles({
  backBtn: {
    borderRadius: "50px !important",
    marginRight: "1vh !important",
    backgroundColor: "#ffffff !important",
    color: "#2196F3 !important",
    border: "1px solid #2196F3 !important",
    boxShadow: "none !important",
  },
  buttonStepper: {
    borderRadius: "50px !important",
  },
  boxCursor: {
    cursor: "true",
  },
  modelSelectionContainer: { justifyContent: "center" },
  accordionContainer: {
    width: "65%",
    marginBottom: "2vh",
  },
  hyperparamsText: {
    marginBottom: "2vh",
  },
  hyperParamsContainer: {
    alignItems: "center",
    marginBottom: "1.5vh",
  },
  requiredModelContainer: {
    marginLeft: "18%",
  },
  requiredModelText: {
    color: "#d32f2f",
  },
  modelSelectionStepperContainer: {
    marginTop: "12vw",
    display: "flex",
    justifyContent: "end",
    marginLeft: "-13vw",
  },
  setDataContainer: {
    paddingLeft: "13vw",
  },
  selectDataSetContainer: {
    marginTop: "3vh",
    width: "30% !important",
  },
  setDataButtonStepperContainer: {
    marginTop: "8vw",
    display: "flex",
    justifyContent: "end",
    marginLeft: "-13vw",
  },
  selectTargetContainer: {
    marginTop: "3vh",
    width: "30% !important",
  },
  dataSliderContainer: {
    width: "75% !important",
  },
  trainModelStepperContainer: {
    marginTop: "12vw",
    display: "flex",
    justifyContent: "end",
    marginLeft: "-13vw",
  },
  typeModelContainer: {
    width: "65% !important",
    marginBottom: "2vh",
  },
  typeModelText: {
    color: "#1e46a4",
    fontSize: "17px",
  },
  displayingFlex: {
    justifyContent: "flex-end",
    display: "flex !important",
    width: "83% !important",
  },
  paramButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
});

export default StepperStyles;
