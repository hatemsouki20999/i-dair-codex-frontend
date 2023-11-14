import {
  AlertColor,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { getListDataset } from "../../services/uploadFile.services";
import DataSlider from "./dataSlider";
import TrainingTestSummary from "./TrainingTestSummary";
import dataPartitionStyles from "../../styles/sliderStyles";
import Toast from "../toast/toast";
import {
  resetDataPartitionStore,
  setSelectedPartitionDataset,
  setSelectedSplitPercent,
  setShowToast,
  setShuffle,
} from "../../redux/reducers/dataPartition.slice";
import { createPartitionStrategy } from "../../services/dataPartition.services";
import {
  defaultPartitionValue,
  defaultRandomSeedValue,
} from "../../utils/data";
import { setIsBack } from "../../redux/reducers/trainModel.slice";
import moment from "moment";
import { updateDataStrategyDataset } from "../../redux/reducers/uploadFile.slice";
import { useTranslation } from "react-i18next";
import { traceSpan } from "../../tracing";

const DataPartition = () => {
  const dispatch: AppDispatch = useDispatch();
  const classes = dataPartitionStyles();
  const { t } = useTranslation();
  const [requiredDataset, setRequiredDataset] = useState(false);

  const { listDataSet } = useSelector(
    (state: RootState) => state.uploadDataset
  );
  const {
    displaySummary,
    showToast,
    selectedDataset,
    selectedSplitPercent,
    shuffle,
  } = useSelector((state: RootState) => state.dataPartition);
  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setSelectedPartitionDataset(event.target.value));
    setRequiredDataset(false);
  };

  useEffect(() => {
    dispatch(resetDataPartitionStore());
    traceSpan(
      "Trace of get list dataset",
      async (trace_id: string, span_id: string) => {
        await dispatch(
          getListDataset({ trace_id: trace_id, span_id: span_id })
        );
      }
    );
    dispatch(setIsBack(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let newSelectedDatataset: any = listDataSet.find(
      (dataset: any) => dataset.id === selectedDataset
    );
    if (newSelectedDatataset) {
      dispatch(
        setSelectedSplitPercent({
          training: newSelectedDatataset.train
            ? newSelectedDatataset.train
            : defaultPartitionValue,
          validation: newSelectedDatataset.test
            ? newSelectedDatataset.test
            : 100 - defaultPartitionValue,
          seed: newSelectedDatataset.seed
            ? newSelectedDatataset.seed
            : defaultRandomSeedValue,
        })
      );
      if (!newSelectedDatataset.shuffle) {
        dispatch(setShuffle("0"));
      } else {
        dispatch(setShuffle("1"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataset]);

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

  const handleSubmit = () => {
    if (selectedDataset === "0") {
      setRequiredDataset(true);
    }

    if (selectedDataset !== "0") {
      dispatch(
        createPartitionStrategy({
          idDataset: selectedDataset,
          train: selectedSplitPercent.training,
          test: selectedSplitPercent.validation,
          seed:
            shuffle === "1"
              ? selectedSplitPercent.seed
              : defaultRandomSeedValue,
          shuffle: shuffle === "1" ? true : false,
        })
      );
      dispatch(
        updateDataStrategyDataset({
          idDataset: selectedDataset,
          train: selectedSplitPercent.training,
          test: selectedSplitPercent.validation,
          seed:
            shuffle === "1"
              ? selectedSplitPercent.seed
              : defaultRandomSeedValue,
          shuffle: shuffle === "1" ? true : false,
        })
      );
    }
  };

  return (
    <>
      <Box className={classes.selectDataSetContainer}>
        <FormControl fullWidth>
          <InputLabel>{t("DATASET")}</InputLabel>
          <Select
            value={selectedDataset}
            label={t("DATASET")}
            onChange={handleChange}
            error={requiredDataset}
          >
            {listDataSet.map((dataset: any) => {
              return (
                <MenuItem key={dataset.id} value={dataset.id}>{`${
                  dataset.study_name
                } (${dataset.country}, ${moment(dataset.created_at).format(
                  "DD/MM/YYYY HH:mm:SS"
                )})`}</MenuItem>
              );
            })}
          </Select>
          {requiredDataset && (
            <Typography className={classes.error}>
              {t("ERROR_REQUIRED")}
            </Typography>
          )}
        </FormControl>
      </Box>
      <DataSlider />
      <Grid container className={classes.submitContainer}>
        <Grid item xs={7.5}>
          {" "}
          <Button
            variant="contained"
            component="label"
            className={classes.submitButton}
            onClick={handleSubmit}
          >
            {t("SUBMIT")}
          </Button>
        </Grid>
      </Grid>
      {displaySummary && <TrainingTestSummary />}

      <Toast handleClose={handleClose} showToast={showToast} />
    </>
  );
};

export default DataPartition;
