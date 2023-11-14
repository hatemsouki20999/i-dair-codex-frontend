import { AlertColor, Box, Button, Grid, Typography } from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import UploadComponent from "./uploadComponent";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import {
  seDisplayDescriptiveStatistics,
  setSelectedFile,
  setShowToast,
  setUploadedFileName,
} from "../../redux/reducers/uploadFile.slice";
import {
  getListDataset,
  setCustomDataSet,
} from "../../services/uploadFile.services";
import Toast from "../toast/toast";
import uploadStyles from "../../styles/uploadStyles";
import InputComponent from "./inputComponent";
import { useState, useEffect } from "react";
import { IFormInputs } from "../../interfaces/upload.interface";
import { getDescriptiveStatistics } from "../../services/descriptiveStatistics.services";
import SuccessModal from "./successModal";
import { setSelectedTab } from "../../redux/reducers/global.slice";
import {
  setOpenModal,
  setSelectedDataset,
  setShowToastDescriptiveStatistics,
} from "../../redux/reducers/descriptiveStatistics.slice";
import { useTranslation } from "react-i18next";
import { traceSpan } from "../../tracing";

const UploadDataset = (props: CircularProgressProps) => {
  const dispatch: AppDispatch = useDispatch();
  const classes = uploadStyles();
  const { t } = useTranslation();
  const [country, setCountry] = useState<IFormInputs>({
    value: "",
    errorMessage: "",
  });
  const [studyName, setStudyName] = useState<IFormInputs>({
    value: "",
    errorMessage: "",
  });

  const { uploadedFileName, selectedFile, showToast, idDataset } = useSelector(
    (state: RootState) => state.uploadDataset
  );

  const { loader, variables, openModal, showToastDescriptiveStatistics } =
    useSelector((state: RootState) => state.descriptiveStatistics);

  const { selectedGroup } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    dispatch(
      setUploadedFileName({
        errorMessage: "",
        value: "",
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeHandler = (event: any) => {
    dispatch(setSelectedFile(event.target.files[0]));
    if (event.target.files[0]?.name?.length === 0) {
      dispatch(
        setUploadedFileName({
          value: "",
          errorMessage: t("ERROR_UPLOAD_REQUIRED"),
        })
      );
    } else {
      dispatch(
        setUploadedFileName({
          errorMessage: "",
          value: event.target.files[0].name,
        })
      );
    }
  };

  const deleteFile = () => {
    dispatch(setSelectedFile(""));

    dispatch(
      setUploadedFileName({
        errorMessage: t("ERROR_UPLOAD_REQUIRED"),
        value: "",
      })
    );
  };

  const handleSubmit = async () => {
    if (
      country.value.length !== 0 &&
      studyName.value.length !== 0 &&
      uploadedFileName.value.length !== 0
    ) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("studyName", studyName.value);
      formData.append("country", country.value);
      formData.append(
        "idGroup",
        selectedGroup ? selectedGroup.toString() : "0"
      );

      await traceSpan(
        "Trace of upload dataset",
        async (trace_id: string, span_id: string) => {
          const data = {
            formData: formData,
            trace_id: trace_id,
            span_id: span_id,
          };
          const response = await dispatch(setCustomDataSet(data));
          if (response.payload.success) {
            setCountry({ value: "", errorMessage: "" });
            setStudyName({ value: "", errorMessage: "" });
            const dataStatistic = {
              idDataset: response.payload.fileId,
              trace_id: trace_id,
              span_id: span_id,
            };
            return dispatch(getDescriptiveStatistics(dataStatistic));
          }
        }
      );
      await traceSpan(
        "Trace of get list dataset",
        async (trace_id: string, span_id: string) => {
          await dispatch(
            getListDataset({ trace_id: trace_id, span_id: span_id })
          );
        }
      );
    } else {
      if (country.value.length === 0) {
        setCountry({ ...country, errorMessage: t("ERROR_REQUIRED") });
      }
      if (studyName.value.length === 0) {
        setStudyName({ ...studyName, errorMessage: t("ERROR_REQUIRED") });
      }
      if (uploadedFileName.value.length === 0) {
        dispatch(
          setUploadedFileName({
            errorMessage: t("ERROR_UPLOAD_REQUIRED"),
            value: "",
          })
        );
      }
    }
  };

  const handleClose = (
    type: AlertColor,
    event: React.SyntheticEvent | Event,
    reason: string,
    closeToastFunction: any
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      closeToastFunction({
        open: false,
        type,
        message: "",
      })
    );
  };

  const handleChangeCountry = (event: any) => {
    setCountry({ value: event.target.value, errorMessage: "" });
  };

  const handleChangeStudyName = (event: any) => {
    setStudyName({ value: event.target.value, errorMessage: "" });
  };

  const goToDescriptiveStatictics = () => {
    dispatch(setSelectedTab(1));
    dispatch(seDisplayDescriptiveStatistics(true));
    dispatch(setOpenModal(false));
    dispatch(setSelectedDataset(idDataset));
  };

  return (
    <Grid container className={classes.removeOverflowY}>
      <Grid container className={classes.globalContainer}>
        {" "}
        <Grid container className={classes.titleContainer}>
          {" "}
          <Typography className={classes.formTitle}>
            {t("UPLOAD_NEW_DATASET")}
          </Typography>
        </Grid>
        <InputComponent
          name={t("STUDY_NAME")}
          label={t("STUDY_NAME")}
          changeHandler={handleChangeStudyName}
          state={studyName}
          title={t("STUDY_NAME")}
        />
        <InputComponent
          name={t("COUNTRY")}
          label={t("COUNTRY")}
          changeHandler={handleChangeCountry}
          state={country}
          title={t("COUNTRY")}
        />
        <UploadComponent
          name={t("DATASET_LABEL")}
          changeHandler={changeHandler}
          state={uploadedFileName}
          closeFile={deleteFile}
        />
      </Grid>

      <Grid container className={classes.submitContainer}>
        <Grid item xs={4.2}>
          {" "}
          <Button
            variant="contained"
            component="label"
            className={classes.submitButton}
            onClick={handleSubmit}
            disabled={loader}
          >
            {t("UPLOAD_DATASET")}
          </Button>
        </Grid>
      </Grid>

      <Toast
        handleClose={(
          type: AlertColor,
          event: React.SyntheticEvent | Event,
          reason: string
        ) => handleClose(type, event, reason, setShowToast)}
        showToast={showToast}
      />
      <Toast
        handleClose={(
          type: AlertColor,
          event: React.SyntheticEvent | Event,
          reason: string
        ) =>
          handleClose(type, event, reason, setShowToastDescriptiveStatistics)
        }
        showToast={showToastDescriptiveStatistics}
      />
      {loader ? (
        <Grid container className={classes.blockDescriptiveStatistics}>
          <span className={classes.labelDescriptiveStatistics}>
            {t("GENERATE_DESCRIPTIVE_STATISTIC")}
          </span>
          <Box className={classes.loaderDescriptiveStatistics}>
            <CircularProgress
              variant="determinate"
              sx={{
                color: (theme) =>
                  theme.palette.grey[
                    theme.palette.mode === "light" ? 200 : 800
                  ],
              }}
              size={"10vw"}
              thickness={4}
              {...props}
              value={100}
            />
            <CircularProgress
              variant="indeterminate"
              disableShrink
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                animationDuration: "550ms",
                position: "absolute",
                left: 0,
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: "round",
                },
              }}
              size={"10vw"}
              thickness={4}
              {...props}
            />
          </Box>
        </Grid>
      ) : (
        Object.keys(variables).length > 0 && (
          <Grid container>
            <SuccessModal
              open={openModal}
              handleClose={goToDescriptiveStatictics}
            />{" "}
          </Grid>
        )
      )}
    </Grid>
  );
};

export default UploadDataset;
