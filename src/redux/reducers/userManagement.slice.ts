import { AlertColor } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/user.interface";
import { createUser } from "../../services/settings.services";
import {
  changeUserRole,
  changeUserStatus,
  getListUsers,
} from "../../services/users.services";

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: {
    loader: false,
    showToastUserManagement: {
      open: false,
      type: "success" as AlertColor,
      message: "",
    },
    usersList: [] as IUser[],
  },
  reducers: {
    setShowToastUserManagement(state, action) {
      state.showToastUserManagement = action.payload;
    },
    setUsersList(state, action) {
      state.usersList = action.payload;
    },
  },
  extraReducers: {
    [getListUsers.fulfilled.type]: (state, action) => {
      state.usersList = action.payload.data.map((user: IUser) => {
        user.is_active = !!user.is_active;
        return user;
      });
      state.loader = false;
    },
    [getListUsers.pending.type]: (state) => {
      state.loader = true;
    },
    [getListUsers.rejected.type]: (state, action) => {
      state.loader = false;
      state.showToastUserManagement = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
    [changeUserStatus.fulfilled.type]: (state, action) => {
      state.usersList = state.usersList.map((user: IUser) => {
        if (user.id === action.payload.idUser) {
          user.is_active = !user.is_active;
        }
        return user;
      });
      state.showToastUserManagement = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
    },
    [changeUserStatus.rejected.type]: (state, action) => {
      state.showToastUserManagement = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },

    [changeUserRole.fulfilled.type]: (state, action) => {
      state.usersList = state.usersList.map((user: IUser) => {
        if (user.id === action.payload.idUser) {
          user.role = user.role === "admin" ? "simple user" : "admin";
        }
        return user;
      });
      state.showToastUserManagement = {
        open: true,
        type: "success" as AlertColor,
        message: action.payload.message,
      };
    },
    [changeUserRole.rejected.type]: (state, action) => {
      state.showToastUserManagement = {
        open: true,
        type: "error" as AlertColor,
        message: action.payload.data.message,
      };
    },
    [createUser.fulfilled.type]: (state, action) => {
      state.usersList = [...state.usersList, ...action.payload.data];
    },
  },
});
export const { setShowToastUserManagement, setUsersList } =
  userManagementSlice.actions;

export default userManagementSlice.reducer;
