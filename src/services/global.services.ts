import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Path from "../utils/endpoints";
// import axiosInstance from "./axiosInterceptor";
const basePath = process.env.REACT_APP_HOST_AUTH;

export const getAppVersion = createAsyncThunk(
  "appVersion",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${basePath}${Path.getAppVersion}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const getAppClientId = createAsyncThunk(
  "appClientId",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${basePath}${Path.getAppClientId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);
