import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Paths from "../utils/endpoints";
// import axiosInstance from "./axiosInterceptor";
import axios from "axios";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
import { Trace } from "../interfaces/trainModel.interface";

const basePath = process.env.REACT_APP_HOST;
const basePathPython = process.env.REACT_APP_HOST_PYTHON;

export const getListAvailableModel = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>(
  "trainModel/getListAvailableModel",
  async (body: any, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `${basePath}${Paths.getListModelsByType}`,
        {
          params: {
            idDataset: body.idDataset,
            target: body.target,
          },
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
            "Trace-Id": body.trace_id,
            "Span-Id": body.span_id,
          },
        }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const getTrainedModels = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("trainModel/getTrainedModels", async (body: Trace, { rejectWithValue }) => {
  try {
    let { data } = await axios.get(
      `${basePathPython}${Paths.getTrainedModels}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "X-User-Email": getEmail(),
          "X-User-Refresh-Token": getRefreshToken(),
          Accept: "application/json",
          "Trace-Id": body.trace_id,
          "Span-Id": body.span_id,
        },
      }
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response);
  }
});

let controller = new AbortController();
export const trainModel = createAsyncThunk(
  "trainModel/trainModel",
  async (trainData: any, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${basePathPython}${Paths.trainModel}`,
        {
          ...trainData,
        },
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
            "Trace-Id": trainData.trace_id,
            "Span-Id": trainData.span_id,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const cancelTrain = createAsyncThunk(
  "trainModel/cancelTrain",
  async (cancelData: any, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${basePathPython}/cancel-train`,
        cancelData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const cancelCreatePost = () => {
  controller.abort();
  controller = new AbortController();
};

export const getTrainedModelsByDataset = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("trainModel/getTrainedModels", async (body: any, { rejectWithValue }) => {
  try {
    let { data } = await axios.get(
      `${basePathPython}${Paths.getTrainedModelsByDataset}`,
      {
        params: { idDataset: body.idDataset },
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "X-User-Email": getEmail(),
          "X-User-Refresh-Token": getRefreshToken(),
          Accept: "application/json",
          "Trace-Id": body.trace_id,
          "Span-Id": body.span_id,
        },
      }
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response);
  }
});

export const getGroupTrainingProgress = createAsyncThunk(
  "trainModel/getGroupTrainingProgress",
  async (_, { rejectWithValue }) => {
    try {
      const selectedGroup = localStorage.getItem("selectedGroup")
        ? localStorage.getItem("selectedGroup")
        : "0";
      let { data } = await axios.get(
        `${basePathPython}${Paths.getGroupTrainingProgress}`,
        {
          params: { idGroup: selectedGroup },
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
          },
        }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const getTrainingInProgressByUser = createAsyncThunk(
  "predictModel/getTrainingInProgressByUser",
  async (_, { rejectWithValue }) => {
    try {
      const selectedGroup = localStorage.getItem("selectedGroup")
        ? localStorage.getItem("selectedGroup")
        : "0";
      let { data } = await axios.get(
        `${basePathPython}${Paths.getTrainingInProgressByUser}`,
        {
          params: { idGroup: selectedGroup },
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
          },
        }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);
