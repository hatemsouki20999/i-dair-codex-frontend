import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Paths from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
// import axiosInstance from "./axiosInterceptor";

const pythonBasePath = process.env.REACT_APP_HOST_PYTHON;

export const plotCompare = createAsyncThunk<any, any, { rejectValue: any }>(
  "plot/plotCompare",
  async (plotData: any, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${pythonBasePath}${Paths.plotCompare}`,
        plotData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
            "Trace-Id": plotData.trace_id,
            "Span-Id": plotData.span_id,
          },
        }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);
