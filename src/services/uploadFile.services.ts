import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Path from "../utils/endpoints";
import { getEmail, getRefreshToken, getToken } from "../utils/utils";
import { Trace } from "../interfaces/trainModel.interface";
const basePath = process.env.REACT_APP_HOST;

export const setCustomDataSet = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("uploadDataSet/setCustomDataSet", async (body: any, { rejectWithValue }) => {
  try {
    const formData = body.formData;
    const { data } = await axios.post(
      `${basePath}${Path.uploadFilePath}`,
      formData,
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

export const getListDataset = createAsyncThunk<any, any, { rejectValue: any }>(
  "uploadDataSet/getListDataset",
  async (body: Trace, { rejectWithValue }) => {
    const selectedGroup = localStorage.getItem("selectedGroup")
      ? localStorage.getItem("selectedGroup")
      : "0";
    try {
      const { data } = await axios.get(`${basePath}${Path.getAllDataset}`, {
        params: { idGroup: selectedGroup },
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "X-User-Email": getEmail(),
          "X-User-Refresh-Token": getRefreshToken(),
          Accept: "application/json",
          "Trace-Id": body.trace_id,
          "Span-Id": body.span_id,
        },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const downloadFile = createAsyncThunk<any, any, { rejectValue: any }>(
  "uploadDataSet/downloadFile",
  async (body: any, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${basePath}${Path.downloadFile}`,
        { idDataset: body.id },
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
      throw rejectWithValue(error.response);
    }
  }
);
