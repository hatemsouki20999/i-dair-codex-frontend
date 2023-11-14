import { makeStyles } from "@mui/styles";

const sliderStyles = makeStyles(
  {
    submitContainer: {
      display: "flex",
      justifyContent: "end",
      marginTop: "6vh",
    },
    submitButton: {
      borderRadius: "18px",
    },
    globalContainer: {
      marginTop: "6vh",
      width: "100%",
    },
    text: {
      marginRight: "20px",
    },
    input: {
      width: "30px",
    },
    randomSeedText: {
      marginRight: "20px !important",
      marginTop: "2vh !important",
    },
    sliderContainer: {
      width: "40% !important",
    },
    selectDataSetContainer: {
      maxWidth: "40% !important",
      marginTop: "4vh",
    },
    error: {
      color: "#d32f2f",
    },
    textSummary: {
      fontSize: "3vh !important",
      color: "#03124f",
      marginBottom: "2vh !important",
      marginTop: "3vh !important",
    },
    summarySubTitle: {
      fontWeight: "bold !important",
      marginBottom: "1.5vh !important",
    },
    columns: {
      marginLeft: "2vh !important",
    },
    targetContainer: { marginTop: "3vh", width: "40% !important" },
    suffleContainer: {
      marginTop: "2vh",
    },
  },
  { index: 1 }
);

export default sliderStyles;
