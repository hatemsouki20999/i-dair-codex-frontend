import {
  AppBar,
  Toolbar,
  Grid,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  FormControl,
  Select,
} from "@mui/material";
import logoIDair from "../../media/images/I-DAIR_logo.png";
import sidebarStyles from "../../styles/sidebarStyles";
import { useState } from "react";
import { Logout, Settings } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import HyperparametersModal from "../settings/hyperparametersModal";
import { setSelectedGroup } from "../../redux/reducers/global.slice";
import { IGroup } from "../../interfaces/group.interface";
import { getListDataset } from "../../services/uploadFile.services";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { setShowToast } from "../../redux/reducers/settings.slice";
import GroupManagementModal from "../settings/group management/groupManagementModal";
import { traceSpan } from "../../tracing";

const NavBar = (props: { logOut?: any }) => {
  const { t } = useTranslation();
  const classes = sidebarStyles();
  const dispatch: AppDispatch = useDispatch();
  const { isConnected, selectedGroup, listGroups } = useSelector(
    (state: RootState) => state.global
  );
  const { logOut } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [openGroupManagement, setOpenGroupManagement] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeSettingsModalStatus = (status: boolean) => {
    setOpenSettings(status);
  };

  const changeUserManagementModalStatus = (status: boolean) => {
    setOpenGroupManagement(status);
  };

  const onChangeGroup = async (event: any) => {
    localStorage.setItem("selectedGroup", event.target.value);
    dispatch(setSelectedGroup(event.target.value));
    await traceSpan(
      "Trace of get list dataset",
      async (trace_id: string, span_id: string) => {
        await dispatch(
          getListDataset({ trace_id: trace_id, span_id: span_id })
        );
      }
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, flexGrow: 1 }}
    >
      <Toolbar>
        <Grid container>
          <Grid item xs={6} className={classes.logoContainer}>
            <img
              className={classes.logo}
              src={logoIDair}
              alt="i-dair-logo"
            ></img>
          </Grid>
          {isConnected === 1 && (
            <>
              <Grid item xs={4} className={classes.connectedUserContainer}>
                <FormControl className={classes.connectedUserContainer}>
                  <Select
                    id="select-group"
                    value={selectedGroup}
                    onChange={onChangeGroup}
                    className={classes.groupDropdown}
                  >
                    <MenuItem disabled value="">
                      {t("SELECT_A_GROUP")}
                    </MenuItem>
                    {listGroups.map((group: IGroup, index) => (
                      <MenuItem key={index} value={group.groupId}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2} className={classes.connectedUserContainer}>
                <Tooltip
                  title="Account settings"
                  className={classes.connectedUserContainer}
                >
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    className={classes.whiteTextColor}
                  >
                    {localStorage.getItem("username")}
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar /> {t("PROFILE")}
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      changeSettingsModalStatus(true);
                    }}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    {t("SETTINGS")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      changeUserManagementModalStatus(true);
                    }}
                  >
                    <ListItemIcon>
                      <SupervisedUserCircleIcon fontSize="small" />
                    </ListItemIcon>
                    {t("GROUP_MANAGEMENT")}
                  </MenuItem>

                  <MenuItem onClick={logOut}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    {t("LOGOUT")}
                  </MenuItem>
                </Menu>
                {openSettings && (
                  <HyperparametersModal
                    open={openSettings}
                    handleClose={() => {
                      changeSettingsModalStatus(false);
                      dispatch(
                        setShowToast({
                          open: false,
                          type: "success",
                          message: "",
                        })
                      );
                    }}
                  />
                )}

                {openGroupManagement && (
                  <GroupManagementModal
                    open={openGroupManagement}
                    handleClose={() => {
                      changeUserManagementModalStatus(false);
                      dispatch(
                        setShowToast({
                          open: false,
                          type: "success",
                          message: "",
                        })
                      );
                    }}
                  />
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
