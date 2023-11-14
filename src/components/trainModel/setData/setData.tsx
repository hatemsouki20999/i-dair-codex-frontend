import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getListDataset } from "../../../services/uploadFile.services";
import {
  setActiveStep,
  setIsBack,
  setSelectedDataset,
  setSelectedTarget,
  setSessionName,
} from "../../../redux/reducers/trainModel.slice";
import {
  defaultPartitionValue,
  defaultRandomSeedValue,
} from "../../../utils/data";
import ButtonStepper from "../buttonStepper/buttonStepper";
import {
  setSelectedSplitPercent,
  setShuffle,
} from "../../../redux/reducers/dataPartition.slice";
import { getListAvailableModel } from "../../../services/trainModel.services";
import StepperStyles from "../../../styles/StepperStyles";
import DataSlider from "../../dataPartition/dataSlider";
import moment from "moment";
import { getListOfColumns } from "../../../services/predictModel.services";
import { useTranslation } from "react-i18next";
import {
  getHyperparameters,
  getModelsParams,
} from "../../../services/settings.services";
import { setHyperParametersListForTrain } from "../../../redux/reducers/settings.slice";
import { formatHyperParameters } from "../../../utils/functions";
import { traceSpan } from "../../../tracing";
import {
  Trace,
  TraceAvailableModel,
} from "../../../interfaces/trainModel.interface";

const SetData = () => {
  const { t } = useTranslation();
  const classes = StepperStyles();
  const dispatch: AppDispatch = useDispatch();
  const { listDataSet } = useSelector(
    (state: RootState) => state.uploadDataset
  );
  const { selectedDataset, selectedTarget, isBack, sessionName } = useSelector(
    (state: RootState) => state.trainModel
  );

  const { columnList } = useSelector((state: RootState) => state.prediction);

  const [dataset, setDataset] = useState<any>({
    id: 0,
    file_name: "",
    country: "",
  });
  const [requiredDataset, setRequiredDataset] = useState(false);
  const [requiredTarget, setRequiredTarget] = useState(false);
  const [targetChanged, setTargetChanged] = useState(false);

  useEffect(() => {
    if (listDataSet.length === 0) {
      traceSpan(
        "Trace of get list dataset",
        async (trace_id: string, span_id: string) => {
          dispatch(getListDataset({ trace_id: trace_id, span_id: span_id }));
        }
      );
      dispatch(setSelectedTarget(""));
    } else if (selectedDataset) {
      setDataset(listDataSet.find((item: any) => item.id === selectedDataset));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let newSelectedDatataset: any = listDataSet.find(
      (data: any) => data.id === dataset.id
    );
    if (newSelectedDatataset) {
      setDataset(newSelectedDatataset);
      if (!isBack) {
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
      } else {
        dispatch(setSelectedTarget(""));
        dispatch(setSelectedDataset(0));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataset, isBack]);
  const handleNext = async () => {
    if (selectedDataset === 0 || !sessionName || !selectedTarget) {
      if (selectedDataset === 0) {
        setRequiredDataset(true);
      }
      if (!sessionName) {
        dispatch(setSessionName(""));
      }
      if (!selectedTarget) {
        setRequiredTarget(true);
      }
    } else {
      dispatch(setActiveStep(1));
      if (!isBack || targetChanged) {
        await traceSpan(
          "Trace of get list models by type ",
          async (trace_id: string, span_id: string) => {
            const data: TraceAvailableModel = {
              idDataset: selectedDataset,
              target: selectedTarget,
              trace_id: trace_id,
              span_id: span_id,
            };
            const listModelsAvailable = await dispatch(
              getListAvailableModel(data)
            );
            const trace: Trace = {
              trace_id: trace_id,
              span_id: span_id,
            };
            await dispatch(getHyperparameters(trace)).then(
              async (hyperParametersList: any) => {
                await dispatch(getModelsParams(trace)).then((data: any) => {
                  let newHyperparams: any = formatHyperParameters(
                    hyperParametersList,
                    data
                  );
                  dispatch(
                    setHyperParametersListForTrain(
                      newHyperparams.filter((model: any) =>
                        listModelsAvailable?.payload?.data?.some(
                          (id: number) => id === model.id
                        )
                      )
                    )
                  );
                });
              }
            );
          }
        );
      }
    }
  };

  const handleChangeDataset = (event: any, newValue: any) => {
    dispatch(setIsBack(false));
    dispatch(setSelectedTarget(""));
    if (newValue) {
      dispatch(setSelectedDataset(newValue.id));
      setDataset(newValue);
      setRequiredDataset(false);
      traceSpan(
        "Trace of get list of columns",
        async (trace_id: string, span_id: string) => {
          await dispatch(
            getListOfColumns({
              idDataset: newValue.id,
              trace_id: trace_id,
              span_id: span_id,
            })
          );
        }
      );
    } else {
      dispatch(setSelectedDataset(0));
      setRequiredDataset(true);
      setDataset({ id: 0, file_name: "", country: "" });
    }
  };
  const handleChangeSessionName = (event: any) => {
    dispatch(setSessionName(event.target.value));
  };
  return (
    <>
      <Grid
        container
        flexDirection={"column"}
        className={classes.setDataContainer}
      >
        <Grid container className={classes.selectDataSetContainer}>
          <TextField
            value={sessionName}
            label={t("SESSION_NAME")}
            onChange={handleChangeSessionName}
            error={sessionName === ""}
            helperText={sessionName === "" ? t("ERROR_REQUIRED") : ""}
          />
        </Grid>
        <Grid container className={classes.selectDataSetContainer}>
          {" "}
          <Autocomplete
            disablePortal
            fullWidth
            value={dataset}
            id="combo-box-demo"
            options={listDataSet}
            getOptionLabel={(option: any) =>
              option.file_name
                ? `${option.study_name} (${option.country}, ${moment(
                    option.created_at
                  ).format("DD/MM/YYYY HH:mm:SS")})`
                : ""
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("DATASET")}
                error={requiredDataset}
                helperText={requiredDataset ? t("ERROR_REQUIRED") : ""}
              />
            )}
            onChange={(event: any, newValue: any) => {
              handleChangeDataset(event, newValue);
            }}
          />
        </Grid>
        <Grid container className={classes.dataSliderContainer}>
          {dataset.id !== 0 && <DataSlider />}
        </Grid>
        <Grid container className={classes.selectTargetContainer}>
          <Autocomplete
            disablePortal
            fullWidth
            value={selectedTarget}
            id="combo-box-demo"
            options={Object.keys(columnList)}
            getOptionLabel={(option: string) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("TARGET")}
                helperText={requiredTarget ? t("ERROR_REQUIRED") : ""}
                error={requiredTarget}
              />
            )}
            onChange={(event: any, newValue: any) => {
              dispatch(setSelectedTarget(newValue));
              setTargetChanged(true);
              setRequiredTarget(false);
            }}
          />
        </Grid>
      </Grid>{" "}
      <Grid container className={classes.setDataButtonStepperContainer}>
        <ButtonStepper onClick={handleNext} />
      </Grid>
    </>
  );
};

export default SetData;
