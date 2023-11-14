import { Box, Stack } from "@mui/material";
import CreateUser from "./createUser";
import TableUsers from "./tableUsers";
import listDatasetStyles from "../../styles/listDatasetStyles";

const UserManagement = () => {
  const classes = listDatasetStyles();
  return (
    <Stack className={classes.mainContainer} spacing={2}>
      <Box className={classes.card}>
        <CreateUser />
      </Box>
      <Box className={classes.cardTableUser}>
        <TableUsers />
      </Box>
    </Stack>
  );
};

export default UserManagement;
