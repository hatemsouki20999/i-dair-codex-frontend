import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Paths from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
// import axiosInstance from "./axiosInterceptor";

const pythonBasePath = process.env.REACT_APP_HOST_PYTHON;

export const deleteDataset = createAsyncThunk<any, any, { rejectValue: any }>(
  "dataset/deleteDataset",
  async (dataset_id, { rejectWithValue }) => {
    try {
      let { data } = await axios.delete(
        `${pythonBasePath}${Paths.deleteDataset}`,
        {
          params: {
            dataset_id,
          },
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
          },
        }
      );
      data.idDataset = dataset_id;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);
