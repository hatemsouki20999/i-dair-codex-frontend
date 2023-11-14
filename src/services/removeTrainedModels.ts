import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Paths from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
// import axiosInstance from "./axiosInterceptor";

const pythonBasePath = process.env.REACT_APP_HOST_PYTHON;

export const deleteTrainedModels = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("trainedModels/deleteTrainedModels", async (body, { rejectWithValue }) => {
  try {
    let { data } = await axios.delete(
      `${pythonBasePath}${Paths.deleteTrainedModels}`,

      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "X-User-Email": getEmail(),
          "X-User-Refresh-Token": getRefreshToken(),
          Accept: "application/json",
        },
        data: {
          trained_models: body.trained_models,
          training_sessions: body.training_sessions,
        },
      }
    );
    data.trained_models = body.trained_models;
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response);
  }
});
