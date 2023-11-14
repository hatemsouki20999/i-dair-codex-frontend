import { makeStyles } from "@mui/styles";

const uploadStyles = makeStyles(
  {
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: "2vw",
      "& .css-1rwt2y5-MuiButtonBase-root-MuiButton-root": {
        textTransform: "none",
      },
      "& .css-1nkhxq8-MuiTypography-root": {
        fontSize: "0.75rem",
        letterSpacing: "0.03333em",
        marginTop: "4px",
        marginRight: "14px",
        marginBottom: "0",
        marginLeft: " 14px",
      },
    },
    contentFileUploded: {
      "& .css-1f0on15-MuiTypography-root": {
        fontWeight: "bold",
        textTransform: "none",
      },
      display: "flex",
      width: "25vw !important",
      alignItems: "center",
    },
    fileName: {
      lineBreak: "anywhere",
      fontWeight: "bold",
      textTransform: "none",
    },
    label: {
      color: "#616161",
    },
    error: {
      lineBreak: "anywhere",
    },
    submitContainer: {
      display: "flex",
      justifyContent: "end",
      marginTop: "6vh",
    },
    submitButton: {
      borderRadius: "18px",
    },
    globalContainer: {
      width: "60% !important",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "2vh",
    },
    formTitle: {
      fontSize: "1.2vw !important",
      color: "#3b3b73",
      marginTop: "2vh !important",
    },
    titleContainer: {
      justifyContent: "center",
    },
    blockDescriptiveStatistics: {
      display: "flex !important",
      flexDirection: "column !important" as "column",
      marginTop: "5%",
    },
    labelDescriptiveStatistics: {
      margin: "auto",
      textAlign: "center",
      fontSize: "1.5vw",
    },
    loaderDescriptiveStatistics: {
      position: "relative",
      margin: "auto",
      marginTop: "5%",
    },
    acceptedFilesText: {
      lineBreak: "anywhere",
      color: "#616161",
      width: "10vw",
    },
    removeOverflowY: {
      overflowY: "hidden",
    },
  },
  { index: 1 }
);

export default uploadStyles;
