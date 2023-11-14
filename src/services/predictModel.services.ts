import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IParamsGetModelList } from "../interfaces/trainModel.interface";
import * as Paths from "../utils/endpoints";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";
// import axiosInstance from "./axiosInterceptor";

const pythonBasePath = process.env.REACT_APP_HOST_PYTHON;

export const getListOfColumns = createAsyncThunk(
  "predictModel/getListOfColumns",
  async (body: IParamsGetModelList, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`${pythonBasePath}${Paths.getColumns}`, {
        params: {
          idDataset: body.idDataset,
        },
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

export const predictingModel = createAsyncThunk<any, any, { rejectValue: any }>(
  "predictModel/predictingModel",
  async (dataToPredict: any, { rejectWithValue }) => {
    try {
      let formData = new FormData();
      formData.append("idModels", JSON.stringify(dataToPredict.idModels));
      formData.append("isFile", dataToPredict.isFile);
      formData.append(
        "data",
        dataToPredict.isFile
          ? dataToPredict.data
          : JSON.stringify(dataToPredict.data)
      );

      let { data } = await axios.post(
        `${pythonBasePath}${Paths.predict}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
            "Trace-Id": dataToPredict.trace_id,
            "Span-Id": dataToPredict.span_id,
          },
        }
      );
      return data;
    } catch (error: any) {
      throw rejectWithValue(error.response);
    }
  }
);

export const getTemplateExample = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>(
  "predictModel/getTemplateExample",
  async (templateData: any, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${pythonBasePath}${Paths.getTemplate}`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
            "Trace-Id": templateData.trace_id,
            "Span-Id": templateData.span_id,
          },
        }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);
