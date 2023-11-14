import { AlertColor } from "@mui/material";
import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createPartitionStrategy } from "../../services/dataPartition.services";
import { getDescriptiveStatistics } from "../../services/descriptiveStatistics.services";
import {
  assignDatasetToGroup,
  getListGroup,
} from "../../services/group.services";
import {
  getListOfColumns,
  getTemplateExample,
  predictingModel,
} from "../../services/predictModel.services";
import {
  createGroup,
  getHyperparameters,
  getModelsParams,
  inviteMembers,
  saveHyperparameters,
} from "../../services/settings.services";
import {
  cancelTrain,
  getGroupTrainingProgress,
  getListAvailableModel,
  getTrainedModels,
  getTrainedModelsByDataset,
  getTrainingInProgressByUser,
  trainModel,
} from "../../services/trainModel.services";
import {
  downloadFile,
  getListDataset,
  setCustomDataSet,
} from "../../services/uploadFile.services";
import { getAppVersion } from "../../services/global.services";
import { translate } from "../../utils/utils";

const getToastMessage = (toastMessage: string) => {
  return {
    open: true,
    type: "error" as AlertColor,
    message: toastMessage,
  };
};

const handleUnauthorizedApi =
  <T extends PayloadAction<any>>(actionType: string): CaseReducer<any, T> =>
  (state, action) => {
    if (action.payload.status === 401) {
      state.isConnected = 2;
      state.showToast = getToastMessage(translate("SESSION_EXPIRED"));
    }
  };

const groupSelected = localStorage.getItem("selectedGroup")
  ? localStorage.getItem("selectedGroup")
  : 0;
const globalSlice = createSlice({
  name: "global",
  initialState: {
    selectedTab: 0,
    isConnected: 0, // 0: pending, 1: connected, 2: unauthorized
    showToast: {
      open: false,
      type: "success" as AlertColor,
      message: "",
    },
    appVersion: "",
    selectedGroup: groupSelected,
    listGroups: [
      {
        groupId: 0,
        name: "My workspace",
        members: [] as Array<string>,
        owner: "",
      },
    ],
    connectedUser: {
      id: 0,
      email: "",
      role: "",
    },
  },
  reducers: {
    setSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    },
    setShowToast(state, action) {
      state.showToast = action.payload;
    },
    setSelectedGroup(state, action) {
      state.selectedGroup = action.payload;
    },
    setListGroups(state, action) {
      state.listGroups = action.payload;
    },
    setConnectedUser(state, action) {
      state.connectedUser = action.payload;
    },
    resetGlobalSlice(state) {
      state.selectedTab = 0;
      state.showToast = {
        open: false,
        type: "success" as AlertColor,
        message: "",
      };
      state.selectedGroup = groupSelected;
      state.listGroups = [
        {
          groupId: 0,
          name: "My workspace",
          members: [] as Array<string>,
          owner: "",
        },
      ];
    },
  },
  extraReducers: {
    [createPartitionStrategy.rejected.type]: handleUnauthorizedApi(
      createPartitionStrategy.rejected.type
    ),
    [getDescriptiveStatistics.rejected.type]: handleUnauthorizedApi(
      getDescriptiveStatistics.rejected.type
    ),
    [getListOfColumns.rejected.type]: handleUnauthorizedApi(
      getListOfColumns.rejected.type
    ),
    [predictingModel.rejected.type]: handleUnauthorizedApi(
      predictingModel.rejected.type
    ),
    [getListAvailableModel.rejected.type]: handleUnauthorizedApi(
      getListAvailableModel.rejected.type
    ),
    [getTrainedModels.rejected.type]: handleUnauthorizedApi(
      getTrainedModels.rejected.type
    ),
    [trainModel.rejected.type]: handleUnauthorizedApi(trainModel.rejected.type),
    [cancelTrain.rejected.type]: handleUnauthorizedApi(
      cancelTrain.rejected.type
    ),
    [getTrainedModelsByDataset.rejected.type]: handleUnauthorizedApi(
      getTrainedModelsByDataset.rejected.type
    ),
    [getGroupTrainingProgress.rejected.type]: handleUnauthorizedApi(
      getGroupTrainingProgress.rejected.type
    ),
    [setCustomDataSet.rejected.type]: handleUnauthorizedApi(
      setCustomDataSet.rejected.type
    ),
    [getListDataset.rejected.type]: handleUnauthorizedApi(
      getListDataset.rejected.type
    ),
    [downloadFile.rejected.type]: handleUnauthorizedApi(
      downloadFile.rejected.type
    ),
    [getTrainingInProgressByUser.rejected.type]: handleUnauthorizedApi(
      getTrainingInProgressByUser.rejected.type
    ),
    [getAppVersion.fulfilled.type]: (state, action) => {
      state.appVersion = action.payload.data.appVersion;
    },
    [getListGroup.fulfilled.type]: (state, action) => {
      state.listGroups = [
        { groupId: 0, name: "My workspace", members: [], owner: "" },
        ...action.payload.data.userGroups,
      ];
    },
    [getListGroup.rejected.type]: handleUnauthorizedApi(
      getListGroup.rejected.type
    ),
    [assignDatasetToGroup.rejected.type]: handleUnauthorizedApi(
      assignDatasetToGroup.rejected.type
    ),
    [getTemplateExample.rejected.type]: handleUnauthorizedApi(
      getTemplateExample.rejected.type
    ),
    [getHyperparameters.rejected.type]: handleUnauthorizedApi(
      getHyperparameters.rejected.type
    ),
    [getModelsParams.rejected.type]: handleUnauthorizedApi(
      getModelsParams.rejected.type
    ),
    [saveHyperparameters.rejected.type]: handleUnauthorizedApi(
      saveHyperparameters.rejected.type
    ),
    [createGroup.rejected.type]: handleUnauthorizedApi(
      createGroup.rejected.type
    ),
    [inviteMembers.rejected.type]: handleUnauthorizedApi(
      inviteMembers.rejected.type
    ),
  },
});

export const {
  setSelectedTab,
  setIsConnected,
  setShowToast,
  setSelectedGroup,
  setListGroups,
  resetGlobalSlice,
  setConnectedUser,
} = globalSlice.actions;

export default globalSlice.reducer;
