import { makeStyles } from "@mui/styles";

const sidebarStyles = makeStyles({
  sideBarItem: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  logoContainer: {
    justifyContent: "flex-start",
    display: "flex",
  },
  connectedUserContainer: {
    justifyContent: "flex-end",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "13%",
  },
  childrenContainer: {
    flexGrow: 1,
    bgcolor: "background.default",
    p: 3,
    marginLeft: "2vw",
    marginTop: "1vh",
  },
  mainContainer: {
    display: "flex",
  },
  drawerContainer: {
    width: 280,
    flexShrink: 0,
    overflow: "hidden",
  },
  listContainer: {
    overflow: "auto",
    marginTop: "2vh",
  },
  whiteTextColor: {
    color: "#ffffff !important",
  },
  centerLogo: {
    minHeight: "80vh",
  },
  groupDropdown: {
    border: "1px solid #ced4da",
    borderRadius: "18px !important",
    borderColor: "#80bdff",
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    backgroundColor: "#ffffff",
    width: "15vw",
    height: "5vh",
  },
});

export default sidebarStyles;
