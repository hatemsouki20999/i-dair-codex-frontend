import { createSlice } from "@reduxjs/toolkit";
import {
  createGroup,
  createUser,
  getHyperparameters,
  getModelsParams,
  inviteMembers,
  saveHyperparameters,
  validateHyperparameter,
} from "../../services/settings.services";
import { AlertColor } from "@mui/material";

const settingsSlice = createSlice({
  name: "settingsSlice",
  initialState: {
    hyperParametersListByModel: [],
    hyperParametersListForTrain: [],
    hyperparametersTypes: {} as any,
    showToast: {
      open: false,
      type: "success" as AlertColor,
      message: "",
    },
  },
  reducers: {
    setHyperParametersListByModel(state, action) {
      state.hyperParametersListByModel = action.payload;
    },
    setShowToast(state, action) {
      state.showToast = action.payload;
    },
    setHyperParametersListForTrain(state, action) {
      state.hyperParametersListForTrain = action.payload;
    },
    resetSettingsSlice(state) {
      state.hyperParametersListByModel = [];
      state.hyperParametersListForTrain = [];
      state.hyperparametersTypes = {} as any;
      state.showToast = {
        open: false,
        type: "success" as AlertColor,
        message: "",
      };
    },
  },
  extraReducers: {
    [getHyperparameters.fulfilled.type]: (state, action) => {
      state.hyperParametersListByModel = action.payload.data;
    },
    [getModelsParams.fulfilled.type]: (state, action) => {
      state.hyperparametersTypes = action.payload.data;
    },
    [saveHyperparameters.fulfilled.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
    },
    [saveHyperparameters.rejected.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.message,
      };
    },
    [createGroup.fulfilled.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
    },

    [createGroup.rejected.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
    [createUser.fulfilled.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
    },
    [createUser.rejected.type]: (state, action) => {
      if (action.payload.status === 400) {
        state.showToast = {
          open: true,
          type: "error" as AlertColor,
          message:
            JSON.stringify(action.payload.data.data.existingMembers) +
            " " +
            action.payload.data.message,
        };
      } else if (action.payload.status === 500) {
        state.showToast = {
          open: true,
          type: "error" as AlertColor,
          message: action.payload.data.message,
        };
      }
    },
    [inviteMembers.fulfilled.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
    },
    [inviteMembers.rejected.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
    [validateHyperparameter.rejected.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
  },
});

export const {
  setHyperParametersListByModel,
  setShowToast,
  setHyperParametersListForTrain,
  resetSettingsSlice,
} = settingsSlice.actions;

export default settingsSlice.reducer;
