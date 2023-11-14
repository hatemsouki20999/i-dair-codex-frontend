import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Toolbar } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { ISidebar } from "../../interfaces/sideBar";
import PersonIcon from "@mui/icons-material/Person";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import sidebarStyles from "../../styles/sidebarStyles";
import { setSelectedTab } from "../../redux/reducers/global.slice";
import { resetDataPartitionStore } from "../../redux/reducers/dataPartition.slice";
import {
  resetTrainSlice,
  setActiveStep,
  setBackFromTrainResult,
  setSelectedDatasetForListModels,
  setShowVariableImportance,
} from "../../redux/reducers/trainModel.slice";
import { seDisplayDescriptiveStatistics } from "../../redux/reducers/uploadFile.slice";
import { setOpenModal } from "../../redux/reducers/descriptiveStatistics.slice";
import {
  reset,
  setSelectedDatasetToPredict,
  setSelectedTargetForPrediction,
} from "../../redux/reducers/prediction.slice";
import { useTranslation } from "react-i18next";

const SideBar = ({ children }: ISidebar) => {
  const { t } = useTranslation();
  const { selectedTab, connectedUser } = useSelector(
    (state: RootState) => state.global
  );
  const { activeStep, listTrainingProgressForConnectedUser } = useSelector(
    (state: RootState) => state.trainModel
  );
  const classes = sidebarStyles();
  const dispatch: AppDispatch = useDispatch();
  const handleChangeSelectedTab = (tab: number) => {
    dispatch(setSelectedTab(tab));
  };
  return (
    <>
      <Drawer variant="permanent" className={classes.drawerContainer}>
        <Toolbar />
        <Box className={classes.listContainer}>
          <List>
            <ListItem
              key={t("UPLOAD_DATASET")}
              disablePadding
              onClick={() => {
                handleChangeSelectedTab(0);
                dispatch(seDisplayDescriptiveStatistics(false));
                dispatch(setOpenModal(false));
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon
                    className={
                      selectedTab === 0 ? classes.sideBarItem : undefined
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t("UPLOAD_DATASET")}
                  className={
                    selectedTab === 0 ? classes.sideBarItem : undefined
                  }
                />
              </ListItemButton>
            </ListItem>

            <ListItem
              key={t("LIST_UPLOADED_DATASETS")}
              disablePadding
              onClick={() => {
                handleChangeSelectedTab(1);
                dispatch(seDisplayDescriptiveStatistics(false));
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon
                    className={
                      selectedTab === 1 ? classes.sideBarItem : undefined
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t("LIST_UPLOADED_DATASETS")}
                  className={
                    selectedTab === 1 ? classes.sideBarItem : undefined
                  }
                />
              </ListItemButton>
            </ListItem>

            <ListItem
              key={t("DATA_PARTITIONING_STRATEGY")}
              disablePadding
              onClick={() => {
                handleChangeSelectedTab(2);
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <SplitscreenIcon
                    className={
                      selectedTab === 2 ? classes.sideBarItem : undefined
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t("DATA_PARTITIONING_STRATEGY")}
                  className={
                    selectedTab === 2 ? classes.sideBarItem : undefined
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              key={t("TRAIN_MODELS")}
              disablePadding
              onClick={() => {
                handleChangeSelectedTab(3);
                dispatch(resetDataPartitionStore());
                dispatch(resetTrainSlice());
                dispatch(setBackFromTrainResult(false));

                if (
                  activeStep !== 2 ||
                  (activeStep === 2 &&
                    listTrainingProgressForConnectedUser &&
                    listTrainingProgressForConnectedUser.length === 0)
                ) {
                  dispatch(resetTrainSlice());
                  dispatch(setActiveStep(0));
                }
                dispatch(setShowVariableImportance(false));
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon
                    className={
                      selectedTab === 3 ? classes.sideBarItem : undefined
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t("TRAIN_MODELS")}
                  className={
                    selectedTab === 3 ? classes.sideBarItem : undefined
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              key={t("GROUP_TRAINING_PROGRESS")}
              disablePadding
              onClick={() => {
                handleChangeSelectedTab(4);
                dispatch(setSelectedDatasetForListModels(0));
                dispatch(
                  setSelectedDatasetToPredict({
                    id: 0,
                    file_name: "",
                    country: "",
                  })
                );
                dispatch(reset());
                dispatch(setShowVariableImportance(false));
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon
                    className={
                      selectedTab === 4 ? classes.sideBarItem : undefined
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t("GROUP_TRAINING_PROGRESS")}
                  className={
                    selectedTab === 4 ? classes.sideBarItem : undefined
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              key={t("LIST_DEPLOYED_MODELS")}
              disablePadding
              onClick={() => {
                handleChangeSelectedTab(5);
                dispatch(setSelectedDatasetForListModels(0));
                dispatch(
                  setSelectedDatasetToPredict({
                    id: 0,
                    file_name: "",
                    country: "",
                  })
                );
                dispatch(setSelectedTargetForPrediction(""));
                dispatch(reset());
                dispatch(setShowVariableImportance(false));
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon
                    className={
                      selectedTab === 5 ? classes.sideBarItem : undefined
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t("LIST_DEPLOYED_MODELS")}
                  className={
                    selectedTab === 5 ? classes.sideBarItem : undefined
                  }
                />
              </ListItemButton>
            </ListItem>

            {(connectedUser.role === "admin" ||
              connectedUser.role === "super admin") && (
              <ListItem
                key={t("USER_MANAGEMENT")}
                disablePadding
                onClick={() => {
                  handleChangeSelectedTab(6);
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon
                      className={
                        selectedTab === 6 ? classes.sideBarItem : undefined
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("USER_MANAGEMENT")}
                    className={
                      selectedTab === 6 ? classes.sideBarItem : undefined
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      <Box component="main" className={classes.childrenContainer}>
        <Toolbar />
        {children}
      </Box>
    </>
  );
};
export default SideBar;
