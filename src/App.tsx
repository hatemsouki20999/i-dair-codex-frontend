import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatasetTable from "./components/listDataset/datasetTable";
import SideBar from "./components/sideBar/sidebar";
import UploadDataset from "./components/uploadDataset/uploadDataset";
import { AppDispatch, RootState } from "./redux/store/store";
import DataPartition from "./components/dataPartition/dataPartition";
import TrainModelStepper from "./components/trainModel/trainModelStepper";
import Prediction from "./components/prediction/prediction";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import axios from "axios";
import { AlertColor, Box, CssBaseline, Grid, Typography } from "@mui/material";
import NavBar from "./components/navBar/navBar";
import sidebarStyles from "./styles/sidebarStyles";
import logoIDairSmall from "./media/images/IDAIR-final logo-secondary.png";
import GroupTrainingProgress from "./components/groupTrainingProgress/groupTrainingProgress";
import {
  resetGlobalSlice,
  setConnectedUser,
  setIsConnected,
  setSelectedGroup,
  setShowToast,
} from "./redux/reducers/global.slice";
import BigLoader from "./components/Loader/bigLoader";
import Toast from "./components/toast/toast";
import VersionDisplay from "./components/versionDisplay/versionDisplay";
import { getAppVersion } from "./services/global.services";
import { useTranslation } from "react-i18next";
import { getListGroup } from "./services/group.services";
import { resetDataPartitionStore } from "./redux/reducers/dataPartition.slice";
import { resetTrainSlice } from "./redux/reducers/uploadFile.slice";
import { resetDescriptiveStatistics } from "./redux/reducers/descriptiveStatistics.slice";
import { reset } from "./redux/reducers/prediction.slice";
import { resetSettingsSlice } from "./redux/reducers/settings.slice";
import axiosInstance from "./services/axiosInterceptor";
import UserManagement from "./components/userManagement/userManagement";
const isLocal = process.env.REACT_APP_IS_LOCAL === "True";
function App() {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { selectedTab, isConnected, showToast, appVersion } = useSelector(
    (state: RootState) => state.global
  );
  const [user, setUser] = useState<any>(null);
  const classes = sidebarStyles();

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
    flow: "auth-code",
  });
  const handleClose = (
    type: AlertColor,
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      setShowToast({
        open: false,
        type,
        message: "",
      })
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(getAppVersion());
    if (!isLocal) {
      if (token) {
        axiosInstance
          .get(`${process.env.REACT_APP_HOST_AUTH}/check-authentication`, {
            headers: {
              Accept: "application/json",
            },
          })
          .then((res) => {
            dispatch(
              setConnectedUser({
                email: res.data.data.email,
                role: res.data.data.userRole,
              })
            );
            dispatch(getListGroup());
            dispatch(setIsConnected(1));
          })
          .catch((err) => {
            logOut();
          });
      } else {
        dispatch(setIsConnected(2));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .post(`${process.env.REACT_APP_HOST_AUTH}/verify-authentication`, {
          code: user.code,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.data.idToken);
          localStorage.setItem("username", res.data.data.username);
          localStorage.setItem("email", res.data.data.email);
          localStorage.setItem("refreshToken", res.data.data.refreshToken);

          dispatch(
            setConnectedUser({
              email: res.data.data.email,
              role: res.data.data.userRole,
            })
          );
          dispatch(getListGroup());
          dispatch(setIsConnected(1));
          //reset all the application
          dispatch(resetDataPartitionStore());
          dispatch(resetTrainSlice());
          dispatch(resetDescriptiveStatistics());
          dispatch(resetGlobalSlice());
          dispatch(reset());
          dispatch(resetSettingsSlice());
          dispatch(resetTrainSlice());
        })
        .catch((err) => {
          logOut();
          dispatch(
            setShowToast({
              open: true,
              type: "error",
              message: err.response.data.message,
            })
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const logOut = () => {
    googleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("selectedGroup");
    localStorage.removeItem("refreshToken");
    dispatch(setSelectedGroup(0));
    dispatch(setIsConnected(2));
  };
  useEffect(() => {
    if (isConnected === 2) {
      logOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);
  return (
    <Box className={classes.mainContainer}>
      <CssBaseline />
      {<NavBar logOut={isConnected ? logOut : null} />}
      {isConnected === 1 || isLocal ? (
        <SideBar>
          {(() => {
            switch (selectedTab) {
              case 0:
                return <UploadDataset />;
              case 1:
                return <DatasetTable />;
              case 2:
                return <DataPartition />;
              case 3:
                return <TrainModelStepper />;
              case 4:
                return <GroupTrainingProgress />;
              case 5:
                return <Prediction />;
              case 6:
                return <UserManagement />;
              default:
                return <></>;
            }
          })()}
        </SideBar>
      ) : isConnected === 2 ? (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          className={classes.centerLogo}
        >
          <img
            className={classes.logo}
            src={logoIDairSmall}
            alt="i-dair-logo"
          />
          <Typography
            paddingTop="1%"
            paddingBottom="2%"
            fontSize="1.6vw"
            variant="h5"
            component="h6"
          >
            {t("SIGN_IN_WITH_GOOGLE")}
          </Typography>
          <GoogleButton onClick={login} />
          <Toast handleClose={handleClose} showToast={showToast} />
        </Grid>
      ) : (
        <BigLoader />
      )}
      <VersionDisplay version={appVersion} />
    </Box>
  );
}

export default App;
