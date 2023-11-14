import { makeStyles } from "@mui/styles";

const settingsStyles = makeStyles({
  modalContainer: {
    left: "40%",
    height: "100%",
  },
  modalPaper: {
    position: "absolute",
    width: "50%",
    backgroundColor: "white",
    right: "0",
    bottom: "0",
    height: "calc(100% - 64px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
  modalTitle: {
    fontSize: "2vh",
  },
  modalTitleContainer: {
    margin: "3vh",
  },
  modelContainer: {
    padding: "1vh",
  },
  hyperparametersContainer: {
    padding: "2vh",
  },
  paramContainer: {
    padding: "2%",
  },
  submitContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  buttons: {
    marginRight: "1vw",
  },
  paramTitle: {
    lineBreak: "anywhere",
  },
  accordionContainer: {
    width: "95% !important",
    margin: "auto !important",
  },
  infoIcon: { color: "#c6c2c2" },
  titleContainer: { display: "flex", alignItems: "center" },
  generateNumbersContainer: { marginBottom: "1.5vh !important" },
  errorContainer: {
    display: "flex",
    alignItems: "center",
  },
  tagStyle: {
    color: "black",
  },
  invalidEmailTagStyle: {
    color: "red",
  },
  createGroupContainer: {
    marginLeft: "3vh",
  },
  cardActions: {
    display: "flex",
    justifyContent: "end",
  },
  invalidEmailContainer: {
    marginTop: "1vh",
    color: "red",
  },
  title: {
    color: "#7d7373",
  },
  inviteMembersContainer: {
    marginTop: "3vh",
    alignItems: "center",
  },
  cardContainer: {
    width: "90%",
    marginTop: "2vh",
  },
  groupNameContainer: {
    marginTop: "3vh",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: "1.7vh !important",
    fontWeight: "600 !important",
  },
  nameContainer: {
    marginTop: "1vh",
    alignItems: "center",
  },
  groupCreatedTitle: {
    color: "#7d7373",
  },
  listGroupCard: {
    marginTop: "1vh",
    width: "90%",
  },
  groupCard: {
    width: "100%",
    marginTop: "2vh",
  },
  membersContainer: {
    marginTop: "1vh",
  },
  editMembersIcon: {
    color: "#7d7373",
    cursor: "pointer",
  },
  editMembersAction: {
    justifyContent: "end",
    marginTop: "1.8vh !important",
  },
});
export default settingsStyles;
