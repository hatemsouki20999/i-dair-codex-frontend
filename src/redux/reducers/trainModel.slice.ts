import { createSlice } from "@reduxjs/toolkit";
import {
  getListAvailableModel,
  getTrainedModels,
  trainModel,
  getTrainedModelsByDataset,
  cancelTrain,
  getGroupTrainingProgress,
  getTrainingInProgressByUser,
} from "../../services/trainModel.services";
import { getSortedKeys, groupBy, sortFnc } from "../../utils/functions";
import { translate } from "../../utils/utils";
import { deleteTrainedModels } from "../../services/removeTrainedModels";
import { ModelType } from "../../interfaces/trainModel.interface";
import { plotCompare } from "../../services/plotCompare";
import { AlertColor } from "@mui/material";
import { rocCurve } from "../../services/rocCurve";

const trainModelSlice = createSlice({
  name: "trainModel",
  initialState: {
    activeStep: 0,
    selectedDataset: 0,
    selectedTarget: "",
    sessionName: undefined,
    listModels: [],
    modelsChanged: false,
    isBack: false,
    listModelToTrain: [],
    listModelProgress: [],
    listTrainedModel: [],
    listGroupTrainingProgress: (null as unknown as any[]) || null,
    trainFinished: 0,
    trainStatus: "start",
    showVariableImportance: false,
    selectedDatasetForListModels: 0,
    listTrainedModelsWithMetrics: {} as ModelType,
    trainCanceled: false,
    connectedUserId: 0,
    listTrainingProgressForConnectedUser: (null as unknown as any[]) || null,
    backFromTrainResult: false,
    loaderTrainedModels: false,
    loaderPlot: false,
    loaderRocCurve: false,
    showToast: {
      open: false,
      type: "success" as AlertColor,
      message: "",
    },
  },
  reducers: {
    setIsBack(state, action) {
      state.isBack = action.payload;
    },
    setActiveStep(state, action) {
      state.activeStep = action.payload;
    },
    setSelectedDataset(state, action) {
      state.selectedDataset = action.payload;
    },
    setListTrainedModelModelsWithMetrics(state, action) {
      state.listTrainedModelsWithMetrics = action.payload;
    },
    setShowToast(state, action) {
      state.showToast = action.payload;
    },
    setSelectedTarget(state, action) {
      state.selectedTarget = action.payload;
    },
    setSessionName(state, action) {
      state.sessionName = action.payload;
    },
    setLoaderTrainedModels(state, action) {
      state.loaderTrainedModels = action.payload;
    },
    setLoaderPlot(state, action) {
      state.loaderPlot = action.payload;
    },
    setLoaderRocCurve(state, action) {
      state.loaderRocCurve = action.payload;
    },
    setListGroupTrainingProgress(state, action) {
      state.listGroupTrainingProgress = action.payload;
    },
    editListModels(state, action) {
      const model: any = state.listModels.find(
        (elem: any) => elem.id === action.payload.id
      );
      if (model) model.checked = action.payload.checked;
      model.hyperparameters.forEach((param: any) => {
        param.error = false;
        param.textError = "";
      });
    },
    setModelsChanged(state, action) {
      state.modelsChanged = action.payload;
    },
    editHyperparameter(state, action) {
      const model: any = state.listModels.find(
        (elem: any) => elem.id === action.payload.modelId
      );
      if (model) {
        let hyperparameter = model.hyperparameters.find(
          (elem: any) => elem.label === action.payload.hyperparameter
        );
        if (hyperparameter) {
          hyperparameter.value = action.payload.value;
          if (
            action.payload.value.length === 0 ||
            (hyperparameter.value === "0" &&
              (hyperparameter.label === "max_iter" ||
                hyperparameter.label === "n_iter"))
          ) {
            hyperparameter.error = true;
            if (action.payload.value.length === 0) {
              hyperparameter.textError = translate("ERROR_REQUIRED");
            } else {
              hyperparameter.textError = translate("ERROR_GREATER_ZERO");
            }
          } else {
            hyperparameter.error = false;
            hyperparameter.textError = "";
          }
        }
      }
    },
    editHyperparameterError(state) {
      let checkedModels: any = state.listModels.filter(
        (elem: any) => elem.checked === true
      );
      if (checkedModels && checkedModels.length !== 0) {
        checkedModels.forEach((model: any) => {
          if (model) {
            model.hyperparameters.map((hyperparameter: any) => {
              if (
                (hyperparameter && hyperparameter.value.length === 0) ||
                (hyperparameter.value === "0" &&
                  (hyperparameter.label === "max_iter" ||
                    hyperparameter.label === "n_iter"))
              ) {
                hyperparameter.error = true;
                if (hyperparameter.value.length === 0) {
                  hyperparameter.textError = translate("ERROR_REQUIRED");
                } else {
                  hyperparameter.textError = translate("ERROR_GREATER_ZERO");
                }
              } else {
                hyperparameter.error = false;
                hyperparameter.textError = "";
              }
              return true;
            });
          }
        });
        state.modelsChanged = true;
      }
    },
    resetTrainSlice(state) {
      state.selectedDataset = 0;
      state.selectedTarget = "";
      state.listModels = [];
      state.modelsChanged = false;
      state.isBack = false;
      state.sessionName = undefined;
    },
    setListModelToTrain(state, action) {
      state.listModelToTrain = action.payload;
    },
    editModelToTrainProgress(state, action) {
      const model: any = state.listModelToTrain.find(
        (elem: any) => elem.id === action.payload.id
      );
      let nIterParam = model.hyperparameters.find(
        (param: any) => param.label === "n_iter"
      );
      let nIter = nIterParam ? nIterParam.value : 10;
      if (model) {
        model.status = action.payload.status;

        if (action.payload.status === "completed") {
          model.progress = 100;
        } else {
          model.progress = (action.payload.progress * 100) / nIter;
        }
        model.sessionId = action.payload.sessionId;
      }
    },
    resetTrainProgress(state) {
      state.trainStatus = "start";
      state.trainFinished = 0;
      state.trainCanceled = false;
    },
    setListTrainedModel(state, action) {
      state.listTrainedModel = action.payload;
    },
    setShowVariableImportance(state, action) {
      state.showVariableImportance = action.payload;
    },
    setSelectedDatasetForListModels(state, action) {
      state.selectedDatasetForListModels = action.payload;
    },
    setTrainCanceled(state, action) {
      state.trainCanceled = action.payload;
    },
    setListTrainingProgressForConnectedUser(state, action) {
      state.listTrainingProgressForConnectedUser = action.payload;
    },
    setBackFromTrainResult(state, action) {
      state.backFromTrainResult = action.payload;
    },
  },
  extraReducers: {
    [getListAvailableModel.fulfilled.type]: (state, action) => {
      state.listModels = action.payload.data;
    },
    [getTrainedModels.fulfilled.type]: (state, action) => {
      state.listTrainedModel = action.payload.data.trained_models;
      state.loaderTrainedModels = false;
    },
    [getTrainedModels.pending.type]: (state, action) => {
      state.loaderTrainedModels = true;
    },
    [getTrainedModels.rejected.type]: (state, action) => {
      state.loaderTrainedModels = true;
    },
    [plotCompare.fulfilled.type]: (state, action) => {
      state.loaderPlot = false;
    },

    [plotCompare.pending.type]: (state, action) => {
      state.loaderPlot = true;
    },
    [plotCompare.rejected.type]: (state, action) => {
      state.loaderPlot = false;
    },

    [rocCurve.fulfilled.type]: (state, action) => {
      state.loaderRocCurve = false;
    },

    [rocCurve.pending.type]: (state, action) => {
      state.loaderRocCurve = true;
    },
    [rocCurve.rejected.type]: (state, action) => {
      state.loaderRocCurve = false;
    },

    [trainModel.fulfilled.type]: (state, action) => {
      if (!action.payload) {
        state.trainCanceled = true;
      }
    },
    [trainModel.pending.type]: (state, action) => {
      state.trainStatus = "pending";
      state.trainFinished = 0;
    },
    [trainModel.rejected.type]: (state, action) => {
      state.trainFinished = 2;
    },
    [getTrainedModelsByDataset.fulfilled.type]: (state, action) => {
      state.listTrainedModel = action.payload.data.trained_models;
      state.loaderTrainedModels = false;
    },
    [getTrainedModelsByDataset.pending.type]: (state, action) => {
      state.loaderTrainedModels = true;
      state.listTrainedModel = [];
    },
    [cancelTrain.fulfilled.type]: (state, action) => {
      state.trainFinished = 3;
    },
    [getGroupTrainingProgress.fulfilled.type]: (state, action) => {
      const arrSession = groupBy(
        action.payload.data.trained_models,
        "session_id"
      );
      let tempListGroupTrainingProgress = Object.keys(arrSession).map(
        (session) => arrSession[session].sort(sortFnc)
      );
      state.listGroupTrainingProgress = tempListGroupTrainingProgress;
      state.connectedUserId = action.payload?.data?.user_id;
    },
    [getGroupTrainingProgress.rejected.type]: (state, action) => {
      state.trainFinished = 2;
    },

    [getTrainingInProgressByUser.fulfilled.type]: (state, action) => {
      const arrSession = groupBy(
        action.payload.data.trained_models,
        "session_id"
      );
      let tempListTrainingProgressForConnectedUser = getSortedKeys(
        arrSession
      ).map((session) => arrSession[session].sort(sortFnc));
      state.listTrainingProgressForConnectedUser =
        tempListTrainingProgressForConnectedUser;
      state.connectedUserId = action.payload?.data?.user_id;
    },
    [deleteTrainedModels.fulfilled.type]: (state, action) => {
      const isDeleted = action.payload.trained_models;
      if (
        state.listTrainedModelsWithMetrics["classification"] &&
        state.listTrainedModelsWithMetrics["classification"].length !== 0
      ) {
        state.listTrainedModelsWithMetrics["classification"] =
          state.listTrainedModelsWithMetrics["classification"].filter(
            (elem: any) => !isDeleted.includes(elem.id)
          );
      }
      if (
        state.listTrainedModelsWithMetrics["regression"] &&
        state.listTrainedModelsWithMetrics["regression"].length !== 0
      ) {
        state.listTrainedModelsWithMetrics["regression"] =
          state.listTrainedModelsWithMetrics["regression"].filter(
            (elem: any) => !isDeleted.includes(elem.id)
          );
      }
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: "The trained models is successfully deleted",
      };
    },
    [deleteTrainedModels.rejected.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: "There is an error when deleting trained models",
      };
    },
  },
});

export const {
  setActiveStep,
  setSelectedDataset,
  setSelectedTarget,
  setSessionName,
  editListModels,
  editHyperparameter,
  editHyperparameterError,
  setModelsChanged,
  resetTrainSlice,
  setIsBack,
  setListModelToTrain,
  editModelToTrainProgress,
  resetTrainProgress,
  setListTrainedModel,
  setShowVariableImportance,
  setSelectedDatasetForListModels,
  setTrainCanceled,
  setListGroupTrainingProgress,
  setListTrainingProgressForConnectedUser,
  setBackFromTrainResult,
  setLoaderTrainedModels,
  setLoaderPlot,
  setLoaderRocCurve,
  setListTrainedModelModelsWithMetrics,
  setShowToast,
} = trainModelSlice.actions;
export default trainModelSlice.reducer;
