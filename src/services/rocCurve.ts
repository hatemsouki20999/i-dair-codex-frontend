import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Paths from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
// import axiosInstance from "./axiosInterceptor";

const pythonBasePath = process.env.REACT_APP_HOST_PYTHON;

export const rocCurve = createAsyncThunk<any, any, { rejectValue: any }>(
  "plot/rocCurve",
  async (rocData: any, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`${pythonBasePath}${Paths.rocCurve}`, {
        params: {
          models_ids: rocData.models_ids,
        },
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "X-User-Email": getEmail(),
          "X-User-Refresh-Token": getRefreshToken(),
          Accept: "application/json",
          "Trace-Id": rocData.trace_id,
          "Span-Id": rocData.span_id,
        },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);
