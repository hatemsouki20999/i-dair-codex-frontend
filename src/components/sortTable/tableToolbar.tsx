import { IconButton, Toolbar, Tooltip, Typography, alpha } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppDispatch } from "../../redux/store/store";
import { useDispatch } from "react-redux";
import { deleteTrainedModels } from "../../services/removeTrainedModels";
import { useState } from "react";
import ConfirmDeleteModal from "../modals/confirmDeleteModal";
import { useTranslation } from "react-i18next";

export interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedIds?: number[];
  selectedSessionsIds?: number[];
  setSelected: any;
  setSessions: any;
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const dispatch: AppDispatch = useDispatch();
  const {
    numSelected,
    selectedIds,
    selectedSessionsIds,
    setSelected,
    setSessions,
  } = props;
  const { t } = useTranslation();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleConfirmModal = (openModal: boolean) => {
    setOpenConfirmModal(openModal);
  };
  const handleDelete = () => {
    const body = {
      trained_models: selectedIds,
      training_sessions: selectedSessionsIds,
    };
    dispatch(deleteTrainedModels(body)).then((res: any) => {
      if (res.payload.success) {
        setOpenConfirmModal(false);
      }
    });
    setSelected([]);
    setSessions([]);
  };
  return (
    <Toolbar
      sx={{
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleConfirmModal(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      <ConfirmDeleteModal
        handleDelete={() => handleDelete()}
        open={openConfirmModal}
        handleClose={() => handleConfirmModal(false)}
        message={t("CONFIRM_DELETE_TRAINED_MODELS")}
        header={t("CONFIRM_DELETE_TRAINED_MODELS_HEADER").toUpperCase()}
      />
    </Toolbar>
  );
}
