import { createSlice } from "@reduxjs/toolkit";
import { createPartitionStrategy } from "../../services/dataPartition.services";
import { AlertColor } from "@mui/material";
import {
  defaultPartitionValue,
  defaultRandomSeedValue,
} from "../../utils/data";

const dataPartitionSlice = createSlice({
  name: "dataPartition",
  initialState: {
    loader: false,
    displaySummary: false,
    summaryData: { columns: [], numberOfCasesTest: 0, numberOfCasesTrain: 0 },
    showToast: {
      open: false,
      type: "success" as AlertColor,
      message: "",
    },
    selectedDataset: "0",
    selectedSplitPercent: {
      training: defaultPartitionValue,
      validation: 100 - defaultPartitionValue,
      seed: defaultRandomSeedValue,
    },
    shuffle: "1",
  },
  reducers: {
    setShowToast(state, action) {
      state.showToast = action.payload;
    },
    setSelectedPartitionDataset(state, action) {
      state.selectedDataset = action.payload;
    },
    resetDataPartitionStore(state) {
      state.loader = false;
      state.displaySummary = false;
      state.summaryData = {
        columns: [],
        numberOfCasesTest: 0,
        numberOfCasesTrain: 0,
      };
      state.showToast = {
        open: false,
        type: "success" as AlertColor,
        message: "",
      };
      state.selectedDataset = "0";
      state.selectedSplitPercent = {
        training: defaultPartitionValue,
        validation: 100 - defaultPartitionValue,
        seed: defaultRandomSeedValue,
      };
      state.shuffle = "1";
    },
    setSelectedSplitPercent(state, action) {
      state.selectedSplitPercent = action.payload;
    },
    setShuffle(state, action) {
      state.shuffle = action.payload;
    },
  },
  extraReducers: {
    [createPartitionStrategy.fulfilled.type]: (state, action) => {
      state.summaryData = {
        columns: action.payload.columns,
        numberOfCasesTest: action.payload.test_rows,
        numberOfCasesTrain: action.payload.train_rows,
      };
      state.displaySummary = true;
      state.loader = false;
    },
    [createPartitionStrategy.pending.type]: (state, action) => {
      state.loader = true;
    },
    [createPartitionStrategy.rejected.type]: (state, action) => {
      state.loader = false;
      state.showToast = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
  },
});

export const {
  setShowToast,
  resetDataPartitionStore,
  setSelectedPartitionDataset,
  setSelectedSplitPercent,
  setShuffle,
} = dataPartitionSlice.actions;

export default dataPartitionSlice.reducer;
