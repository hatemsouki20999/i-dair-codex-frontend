import { createAsyncThunk } from "@reduxjs/toolkit";
import { IDataPartitionBody } from "../interfaces/dataPartition.interface";
import * as Path from "../utils/endpoints";
// import axiosInstance from "./axiosInterceptor";
import axios from "axios";
import { getToken, getEmail, getRefreshToken } from "../utils/utils";

const pyhtonBasePath = process.env.REACT_APP_HOST_PYTHON;

export const createPartitionStrategy = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>(
  "dataPartition/createPartitionStrategy",
  async (partitionData: IDataPartitionBody, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${pyhtonBasePath}${Path.dataPartition}`,
        {
          ...partitionData,
        },
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
      console.log("error", error);
      throw rejectWithValue(error.response);
    }
  }
);
