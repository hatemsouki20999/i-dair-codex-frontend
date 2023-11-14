import { AlertColor } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { assignDatasetToGroup } from "../../services/group.services";
import {
  getListDataset,
  setCustomDataSet,
} from "../../services/uploadFile.services";
import { deleteDataset } from "../../services/removeDataset.services";

const uploadDatasetSlice = createSlice({
  name: "uploadDataSet",
  initialState: {
    uploadedFileName: {
      value: "",
      errorMessage: "",
    },
    selectedFile: "" as any,
    idDataset: 0,
    loader: false,
    showToast: {
      open: false,
      type: "success" as AlertColor,
      message: "",
    },
    listDataSet: [],
    displayDescriptiveStatistics: false,
  },
  reducers: {
    setUploadedFileName(state, action) {
      state.uploadedFileName = action.payload;
    },
    setSelectedFile(state, action) {
      state.selectedFile = action.payload;
    },
    setShowToast(state, action) {
      state.showToast = action.payload;
    },
    seDisplayDescriptiveStatistics(state, action) {
      state.displayDescriptiveStatistics = action.payload;
    },
    setIdDataset(state, action) {
      state.idDataset = action.payload;
    },
    setListDataset(state, action) {
      state.listDataSet = action.payload;
    },
    updateDataStrategyDataset(state, action) {
      state.listDataSet = state.listDataSet.map((dataset: any) => {
        if (dataset.id === action.payload.idDataset) {
          dataset.train = action.payload.train;
          dataset.test = action.payload.test;
          dataset.seed = action.payload.seed;
        }
        return dataset;
      }) as any;
    },
    resetTrainSlice(state) {
      state.uploadedFileName = {
        value: "",
        errorMessage: "",
      };
      state.selectedFile = "" as any;
      state.idDataset = 0;
      state.loader = false;
      state.showToast = {
        open: false,
        type: "success" as AlertColor,
        message: "",
      };
      state.listDataSet = [];
      state.displayDescriptiveStatistics = false;
    },
  },
  extraReducers: {
    [setCustomDataSet.fulfilled.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
      state.idDataset = action.payload.fileId;
      state.loader = false;
      state.selectedFile = "";
      state.uploadedFileName = {
        value: "",
        errorMessage: "",
      };
    },
    [setCustomDataSet.pending.type]: (state, action) => {
      state.loader = true;
    },
    [setCustomDataSet.rejected.type]: (state, action) => {
      state.loader = false;
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
    [getListDataset.fulfilled.type]: (state, action) => {
      state.listDataSet = action.payload.data;
      state.loader = false;
    },
    [getListDataset.pending.type]: (state, action) => {
      state.loader = true;
    },
    [getListDataset.rejected.type]: (state, action) => {
      state.loader = false;
    },
    [assignDatasetToGroup.fulfilled.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
    },
    [assignDatasetToGroup.rejected.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
    [deleteDataset.fulfilled.type]: (state, action) => {
      const isDeleted = action.payload.idDataset;
      state.listDataSet = state.listDataSet.filter(
        (elem: any) => elem.id !== isDeleted
      );
      state.showToast = {
        open: true,
        type: "success" as AlertColor,
        message: "The dataset is successfully deleted",
      };
    },
    [deleteDataset.rejected.type]: (state, action) => {
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: "There is an error when deleting dataset",
      };
    },
  },
});

export const {
  setUploadedFileName,
  setSelectedFile,
  setShowToast,
  seDisplayDescriptiveStatistics,
  setIdDataset,
  updateDataStrategyDataset,
  setListDataset,
  resetTrainSlice,
} = uploadDatasetSlice.actions;

export default uploadDatasetSlice.reducer;
