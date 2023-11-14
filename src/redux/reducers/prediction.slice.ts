import { predictingModel } from "./../../services/predictModel.services";
import { createSlice } from "@reduxjs/toolkit";
import { getListOfColumns } from "../../services/predictModel.services";
import base64 from "base64-js";
const predictionSlice = createSlice({
  name: "predictionSlice",
  initialState: {
    displayPrediction: false,
    predictionModel: {
      idModel: 0,
      target: "",
      idDataset: 0,
    },
    columnList: [] as any[],
    predictResult: null as any,
    selectedDatasetToPredict: {
      id: 0,
      file_name: "",
      country: "",
    },
    selectedTargetForPrediction: "",
    selectedSessionForPrediction: null as any,
    filtredModels: [],
    predictionFiles: null as any,
  },
  reducers: {
    setDisplayPrediction(state, action) {
      state.displayPrediction = action.payload;
    },
    setSelectedDatasetToPredict(state, action) {
      state.selectedDatasetToPredict = action.payload;
    },
    setPredictionModel(state, action) {
      state.predictionModel = action.payload;
    },
    setSelectedTargetForPrediction(state, action) {
      state.selectedTargetForPrediction = action.payload;
    },
    setSelectedSessionForPrediction(state, action) {
      state.selectedSessionForPrediction = action.payload;
    },
    setColumnList(state, action) {
      state.columnList = action.payload;
    },
    reset(state) {
      state.columnList = [];
      state.predictResult = null;
      state.displayPrediction = false;
    },
    setFiltredModels(state, action) {
      state.filtredModels = action.payload;
    },
    setPredictResult(state, action) {
      state.predictResult = action.payload;
    },
  },
  extraReducers: {
    [getListOfColumns.fulfilled.type]: (state, action) => {
      state.columnList = action.payload.data;
    },
    [predictingModel.fulfilled.type]: (state, action) => {
      state.predictResult = action.payload.data;

      const decodedFileContents: any = {};
      for (const fileName in action.payload.file_contents) {
        const encodedData = action.payload.file_contents[fileName];
        const decodedData = new TextDecoder("utf-8").decode(
          base64.toByteArray(encodedData)
        );
        const byteArray = new Uint8Array(decodedData.length);

        for (let i = 0; i < decodedData.length; i++) {
          byteArray[i] = decodedData.charCodeAt(i);
        }

        decodedFileContents[fileName] = byteArray;
      }
      state.predictionFiles = decodedFileContents;
    },
    [predictingModel.pending.type]: (state, action) => {
      state.predictResult = null;
    },
    [predictingModel.rejected.type]: (state, action) => {
      state.predictResult = action.payload.data;
    },
  },
});

export const {
  setDisplayPrediction,
  setPredictionModel,
  reset,
  setSelectedDatasetToPredict,
  setSelectedTargetForPrediction,
  setSelectedSessionForPrediction,
  setFiltredModels,
  setPredictResult,
  setColumnList,
} = predictionSlice.actions;

export default predictionSlice.reducer;
