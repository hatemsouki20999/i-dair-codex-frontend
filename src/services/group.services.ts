import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Path from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
// import axiosInstance from "./axiosInterceptor";
const basePath = process.env.REACT_APP_HOST_PYTHON;

export const getListGroup = createAsyncThunk(
  "getListGroup",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${basePath}${Path.getUserGroups}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "X-User-Email": getEmail(),
          "X-User-Refresh-Token": getRefreshToken(),
          Accept: "application/json",
        },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const assignDatasetToGroup = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("assignDatasetToGroup", async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(
      `${basePath}${Path.assignDatasetToGroup}`,
      params,
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
