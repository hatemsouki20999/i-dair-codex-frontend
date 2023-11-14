import { AlertColor, Button, Grid, Modal, Typography } from "@mui/material";
import { GroupManagementModalProps } from "../../../interfaces/settings.interface";
import settingsStyles from "../../../styles/settingsStyles";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import CreateGroup from "./createGroup";
import { useState } from "react";
import Toast from "../../toast/toast";
import { setShowToast } from "../../../redux/reducers/settings.slice";
import OwnerListGroup from "./ownerListGroup";

const GroupManagementModal = (props: GroupManagementModalProps) => {
  let classes = settingsStyles();
  let { handleClose, open } = props;
  let dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  let { showToast } = useSelector((state: RootState) => state.settings);
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);

  const handleCloseCreateGroup = () => {
    setShowCreateGroup(false);
  };

  const handleCloseToast = (
    type: AlertColor,
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      setShowToast({
        open: false,
        type,
        message: "",
      })
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={classes.modalContainer}
    >
      <Grid className={classes.modalPaper}>
        <Grid container className={classes.modalTitleContainer}>
          {" "}
          <Typography
            className={classes.modalTitle}
            sx={{ fontSize: "2vh", fontWeight: "bold" }}
          >
            {t("GROUP_MANAGEMENT")}
          </Typography>
        </Grid>
        <Grid
          container
          className={classes.createGroupContainer}
          sx={{ marginTop: "20px" }}
        >
          {!showCreateGroup && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowCreateGroup(true);
              }}
            >
              {t("CREATE_GROUP")}
            </Button>
          )}
          <CreateGroup
            display={showCreateGroup}
            handleClose={handleCloseCreateGroup}
          />
          <OwnerListGroup />
        </Grid>

        <Toast handleClose={handleCloseToast} showToast={showToast} />
      </Grid>
    </Modal>
  );
};
export default GroupManagementModal;
