import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "../../redux/reducers/global.slice";
import uploadDatasetReducer from "../../redux/reducers/uploadFile.slice";
import descriptiveStatisticsReducer from "../reducers/descriptiveStatistics.slice";
import dataPartitionReducer from "../../redux/reducers/dataPartition.slice";
import trainModelReducer from "../../redux/reducers/trainModel.slice";
import predictionReducer from "../../redux/reducers/prediction.slice";
import settingsReducer from "../../redux/reducers/settings.slice";
import userManagementReducer from "../../redux/reducers/userManagement.slice";
const store = configureStore({
  reducer: {
    global: globalReducer,
    uploadDataset: uploadDatasetReducer,
    descriptiveStatistics: descriptiveStatisticsReducer,
    dataPartition: dataPartitionReducer,
    trainModel: trainModelReducer,
    prediction: predictionReducer,
    settings: settingsReducer,
    userManagement: userManagementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
