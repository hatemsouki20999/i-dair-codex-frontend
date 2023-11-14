import { useEffect, useState } from "react";

import {
  AlertColor,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  Box,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import listDatasetStyles from "../../styles/listDatasetStyles";
import { capitalizeText } from "../../utils/functions";
import settingsStyles from "../../styles/settingsStyles";
import { AntSwitch, SwitchButton } from "../switchButton/switchButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import BigLoader from "../Loader/bigLoader";
import {
  changeUserStatus,
  getListUsers,
  changeUserRole,
} from "../../services/users.services";
import Toast from "../toast/toast";
import { setShowToastUserManagement } from "../../redux/reducers/userManagement.slice";
import { IUser } from "../../interfaces/user.interface";

const TableUsers = () => {
  const classes = listDatasetStyles();
  const classesSettings = settingsStyles();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const { usersList, loader, showToastUserManagement } = useSelector(
    (state: RootState) => state.userManagement
  );
  const { connectedUser } = useSelector((state: RootState) => state.global);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchUser, setSearchUser] = useState("");
  const [usersListSearch, setUsersListSearch] = useState<IUser[]>([]);

  useEffect(() => {
    dispatch(getListUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchUser) {
      setUsersListSearch(usersList);
    } else {
      setUsersListSearch(
        usersList.filter(
          (user: any) =>
            user.email.toLowerCase().indexOf(searchUser.toLowerCase()) !== -1
        )
      );
    }
  }, [searchUser, usersList]);

  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const changeStatusUser = (idUser: number, status: boolean) => {
    dispatch(changeUserStatus({ idUserToChange: idUser, status }));
  };
  const changeRoleUser = (idUser: number, role: string) => {
    dispatch(changeUserRole({ idUserToChange: idUser, role }));
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleClose = (
    type: AlertColor,
    event: React.SyntheticEvent | Event,
    reason: string,
    closeToastFunction: any
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      closeToastFunction({
        open: false,
        type,
        message: "",
      })
    );
  };

  const handleChangeSearchUser = (event: any) => {
    setSearchUser(event.target.value);
    setPage(0);
  };

  return !loader ? (
    <Card className={classes.card}>
      <CardContent>
        <Grid container display={"flex"}>
          <Grid item xs={8.2} lg={9.2}>
            <Typography className={classesSettings.cardTitle} gutterBottom>
              {t("LIST_OF_USERS")}
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.searchContainer}>
          <Grid>
            <TextField
              size="small"
              value={searchUser}
              label={t("SEARCH_USER")}
              onChange={handleChangeSearchUser}
            />
          </Grid>
        </Grid>
        {usersListSearch.length !== 0 ? (
          <Grid container>
            <TableContainer
              className={classes.tableContainer}
              data-testid="dataset-table"
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align={"center"} sx={{ minWidth: 120 }}>
                      {t("EMAIL")}
                    </TableCell>
                    <TableCell align={"center"} sx={{ minWidth: 120 }}>
                      {t("STATUS")}
                    </TableCell>
                    {connectedUser.role === "super admin" && (
                      <TableCell align={"center"} sx={{ minWidth: 120 }}>
                        {t("ROLE")}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersListSearch
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align={"center"} sx={{ minWidth: 120 }}>
                            {capitalizeText(user.email)}
                          </TableCell>
                          <TableCell align={"center"} sx={{ minWidth: 120 }}>
                            <FormControlLabel
                              sx={{ minWidth: 120 }}
                              control={
                                <SwitchButton
                                  sx={{ m: 1 }}
                                  checked={user.is_active}
                                  onChange={() =>
                                    changeStatusUser(user.id, !user.is_active)
                                  }
                                />
                              }
                              label={
                                user.is_active ? t("ACTIVE") : t("INACTIVE")
                              }
                            />
                          </TableCell>
                          {connectedUser.role === "super admin" && (
                            <TableCell align={"center"} sx={{ minWidth: 120 }}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Typography>{t("SIMPLE_USER")}</Typography>
                                <AntSwitch
                                  checked={user.role === "admin"}
                                  inputProps={{ "aria-label": "ant design" }}
                                  onChange={() =>
                                    changeRoleUser(
                                      user.id,
                                      user.role === "admin"
                                        ? "simple user"
                                        : "admin"
                                    )
                                  }
                                />
                                <Typography>{t("ADMIN")}</Typography>
                              </Stack>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid container className={classes.paginationContainer}>
              {usersListSearch.length !== 0 && (
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={usersListSearch.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </Grid>
          </Grid>
        ) : (
          <Box className={classes.alertBox}>
            <Alert severity="info" className={classes.alert}>
              <Typography>{t("NO_USER_FOUND")}</Typography>
            </Alert>
          </Box>
        )}

        <Toast
          handleClose={(
            type: AlertColor,
            event: React.SyntheticEvent | Event,
            reason: string
          ) => handleClose(type, event, reason, setShowToastUserManagement)}
          showToast={showToastUserManagement}
        />
      </CardContent>
    </Card>
  ) : (
    <BigLoader />
  );
};

export default TableUsers;
