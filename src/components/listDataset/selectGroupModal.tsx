import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { assignDatasetToGroup } from "../../services/group.services";
import { setListDataset } from "../../redux/reducers/uploadFile.slice";
import deepClone from "deep-clone";
import { PropsModalI } from "../../interfaces/settings.interface";

const SelectGroupModal = (props: PropsModalI) => {
  const [selectedGroup, setSelectedGroup] = useState<any>();
  const [requiredDataset, setRequiredDataset] = useState(false);
  const { handleClose, open } = props;
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();

  const { listGroups } = useSelector((state: RootState) => state.global);
  const { listDataSet } = useSelector(
    (state: RootState) => state.uploadDataset
  );
  const { selectedDataset } = useSelector(
    (state: RootState) => state.descriptiveStatistics
  );

  const onSubmit = (e: any) => {
    if (!selectedGroup) {
      setRequiredDataset(true);
    } else {
      dispatch(
        assignDatasetToGroup({
          id_dataset: selectedDataset,
          group_id: selectedGroup.groupId,
        })
      ).then(() => {
        let newDataset = deepClone(listDataSet) as any;
        newDataset = newDataset.map((dataset: any) => {
          let tempDataset = dataset;
          if (tempDataset.id === selectedDataset) {
            tempDataset.id_group = selectedGroup.groupId;
            tempDataset.group_name = selectedGroup.name;
          }
          return tempDataset;
        });
        dispatch(setListDataset(newDataset));
      });
      handleClose();
    }
  };
  const handleSelectGroup = (e: any, newValue: any) => {
    if (!newValue) {
      setRequiredDataset(true);
      setSelectedGroup(undefined);
    } else {
      setRequiredDataset(false);
      setSelectedGroup(newValue);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} scroll={"paper"}>
      <DialogTitle>{t("ASSIGN_DATASET_TO_GROUP")}</DialogTitle>
      <DialogContent dividers={true} sx={{ width: "30vw", height: "25vh" }}>
        <br />{" "}
        <DialogContentText>{t("SELECT_GROUP_TO_ASSIGN")}</DialogContentText>
        <br />{" "}
        <Grid container>
          <Grid item xs={8}>
            <Autocomplete
              // value={selectedSessionForPrediction}
              id="combo-box-demo"
              options={listGroups.slice(1)}
              getOptionLabel={(option: any) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("GROUP_NAME")}
                  error={requiredDataset}
                  helperText={requiredDataset ? t("ERROR_REQUIRED") : ""}
                />
              )}
              onChange={(event: any, newValue: any) => {
                handleSelectGroup(event, newValue);
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("CLOSE")}</Button>
        <Button variant="contained" onClick={onSubmit}>
          {t("SUBMIT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default SelectGroupModal;
