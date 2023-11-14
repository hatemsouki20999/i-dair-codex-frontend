import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Paths from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
import { Trace, TraceReset } from "../interfaces/trainModel.interface";
// import axiosInstance from "./axiosInterceptor";

const pythonBasePath = process.env.REACT_APP_HOST_PYTHON;
const basePath = process.env.REACT_APP_HOST;

export const getHyperparameters = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("settings/getHyperParameters", async (body: Trace, { rejectWithValue }) => {
  try {
    let { data } = await axios.get(
      `${pythonBasePath}${Paths.getHyperParameters}`,
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

export const getModelsParams = createAsyncThunk<any, any, { rejectValue: any }>(
  "settings/getModelsParams",
  async (body: Trace, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `${pythonBasePath}${Paths.getModelsParams}`,
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
  }
);

export const saveHyperparameters = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("settings/saveHyperparameters", async (body, { rejectWithValue }) => {
  try {
    let { data } = await axios.post(
      `${pythonBasePath}${Paths.saveHyperparameters}`,
      body,
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
});

export const validateHyperparameter = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("settings/validateHyperparameter", async (body: any, { rejectWithValue }) => {
  try {
    let { data } = await axios.get(
      `${pythonBasePath}${Paths.validateHyperparameter}`,
      {
        params: {
          model_id: body.model_id,
          task: body.task,
          hyperparameters: body.hyperparameters,
        },
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
});

export const resetSettings = createAsyncThunk<any, any, { rejectValue: any }>(
  "settings/resetSettings",
  async (body: TraceReset, { rejectWithValue }) => {
    try {
      let { data } = await axios.delete(
        `${pythonBasePath}${Paths.deleteUserPreference}/${body.modelId}`,
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
  }
);

export const createGroup = createAsyncThunk<any, any, { rejectValue: any }>(
  "settings/createGroup",
  async (body, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${pythonBasePath}${Paths.createGroup}`,
        body,
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

export const createUser = createAsyncThunk<any, any, { rejectValue: any }>(
  "settings/createUser",
  async (body, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${basePath}${Paths.createMember}`,
        body,
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

export const inviteMembers = createAsyncThunk<any, any, { rejectValue: any }>(
  "settings/inviteMembers",
  async (body, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${pythonBasePath}${Paths.inviteMembers}`,
        body,
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
