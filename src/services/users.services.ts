import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getEmail, getRefreshToken, getToken } from "../utils/utils";
import * as Paths from "../utils/endpoints";

const basePath = process.env.REACT_APP_HOST;

export const getListUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`${basePath}${Paths.getAllUsers}`, {
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

export const changeUserStatus = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>("users/changeUserStatus", async (body, { rejectWithValue }) => {
  try {
    let { data } = await axios.post(
      `${basePath}${Paths.changeUserStatus}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "X-User-Email": getEmail(),
          "X-User-Refresh-Token": getRefreshToken(),
          Accept: "application/json",
        },
      }
    );
    data.idUser = body.idUserToChange;
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response);
  }
});

export const changeUserRole = createAsyncThunk<any, any, { rejectValue: any }>(
  "users/changeUserRole",
  async (body, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `${basePath}${Paths.changeUserRole}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-User-Email": getEmail(),
            "X-User-Refresh-Token": getRefreshToken(),
            Accept: "application/json",
          },
        }
      );
      data.idUser = body.idUserToChange;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);
