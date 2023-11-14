import { AlertColor } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { getDescriptiveStatistics } from "../../services/descriptiveStatistics.services";

const descriptiveStatisticsSlice = createSlice({
  name: "descriptiveStatistics",
  initialState: {
    variables: {},
    loader: false,
    showToastDescriptiveStatistics: {
      open: false,
      type: "success" as AlertColor,
      message: "",
    },
    openModal: false,
    selectedDataset: 0,
    downloadPlots: false,
    downloadLoader: false,
    expandedList: [] as Array<boolean>,
    roundDecimalNumber: "3",
  },
  reducers: {
    setVariables(state, action) {
      state.variables = action.payload;
    },
    setOpenModal(state, action) {
      state.openModal = action.payload;
    },
    setSelectedDataset(state, action) {
      state.selectedDataset = action.payload;
    },
    setDownloadPlots(state, action) {
      state.downloadPlots = action.payload;
    },
    setDownloadLoader(state, action) {
      state.downloadLoader = action.payload;
    },
    setExpandedList(state, action) {
      state.expandedList = action.payload;
    },
    setRoundDecimalNumber(state, action) {
      state.roundDecimalNumber = action.payload;
    },
    setShowToastDescriptiveStatistics(state, action) {
      state.showToastDescriptiveStatistics = action.payload;
    },
    resetDescriptiveStatistics(state) {
      state.variables = {};
      state.loader = false;
      state.showToastDescriptiveStatistics = {
        open: false,
        type: "success" as AlertColor,
        message: "",
      };
      state.openModal = false;
      state.selectedDataset = 0;
      state.downloadPlots = false;
      state.downloadLoader = false;
      state.expandedList = [] as Array<boolean>;
      state.roundDecimalNumber = "3";
    },
  },
  extraReducers: {
    [getDescriptiveStatistics.fulfilled.type]: (state, action) => {
      state.variables = action.payload.data.variables;
      state.loader = false;
      state.openModal = true;
      state.expandedList = new Array(
        Object.keys(action.payload.data.variables).length
      ).fill(true);
    },
    [getDescriptiveStatistics.pending.type]: (state, action) => {
      state.loader = true;
    },
    [getDescriptiveStatistics.rejected.type]: (state, action) => {
      state.loader = false;
      state.showToastDescriptiveStatistics = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
  },
});
export const {
  setVariables,
  setOpenModal,
  setSelectedDataset,
  setDownloadPlots,
  setDownloadLoader,
  setExpandedList,
  setRoundDecimalNumber,
  resetDescriptiveStatistics,
  setShowToastDescriptiveStatistics,
} = descriptiveStatisticsSlice.actions;

export default descriptiveStatisticsSlice.reducer;
