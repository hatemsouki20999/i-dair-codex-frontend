import { makeStyles } from "@mui/styles";

const descriptiveStatisticsStyles = makeStyles({
  title: {
    marginLeft: "1vw !important",
    fontWeight: "bold !important",
  },
  titleVariable: {
    color: "#061860cc",
    fontSize: "2vh !important",
    marginBottom: "1vh !important",
  },
  accordionContainer: {
    marginBottom: "1.5vh",
  },
  globalTableContainer: {
    marginTop: "2vh",
  },
  tableContainer: {
    padding: "3vh",
  },
  tableTitle: {
    fontWeight: "bold !important",
  },
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
  loader: {
    justifyContent: "center",
  },
  plotContainer: {
    justifyContent: "center",
  },
  successModalTitle: {
    textAlign: "center",
  },
  successImage: {
    width: "30%",
  },
  imageContainer: {
    justifyContent: "center",
  },
  varibalesContainer: {
    marginTop: "2vh",
  },
  accordion: {
    border: "0.5px inset #80808033",
    boxShadow: "none",
  },
  exportPdfButtonContainer: {
    justifyContent: "end",
    display: "flex",
  },
  roundNumberContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
  },
  selectModelContainer:{
    width: "40% !important", marginBottom: "2vh"
  },
  selectModel:{
    width: "100% !important" 
  },
  predictionResultContainer:{
    width:"95% !important",
    marginTop:"4vh",
    marginBottom:"4vh"
  },
  alertContainer:{
    width:"100%",
  },
  predictionFileContainer:{
    marginBottom: "1.5vh"
  },
  predictionDataText:{
    marginBottom: "1vh", marginTop: "2vh" 
  },
  radioGroup:{
    display:"block !important"
  }
});

export default descriptiveStatisticsStyles;
