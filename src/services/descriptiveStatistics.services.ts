import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Path from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
const basePath = process.env.REACT_APP_HOST_PYTHON;

export const getDescriptiveStatistics = createAsyncThunk(
  "statistics",
  async (body: any, { rejectWithValue }) => {
    try {
      const idDataset = body.idDataset;
      const { data } = await axios.post(
        `${basePath}${Path.descriptiveStatistics}`,
        { idDataset },
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
