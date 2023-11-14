import { makeStyles } from "@mui/styles";

const listDatasetStyles = makeStyles({
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableContainer: {
    width: "90% !important",
    marginTop: "5vh",
    marginLeft: "2vw",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "end",
    width: "93% !important",
  },
  noDataText: {
    textAlign: "center",
  },
  card: {
    width: "90%",
  },
  cardTableUser: {
    width: "90%",
    paddingBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  alert: {
    display: "flex",
    justifyContent: "center",
  },
  alertBox: {
    width: "100%",
    paddingTop: "20px",
  },
});
export default listDatasetStyles;
