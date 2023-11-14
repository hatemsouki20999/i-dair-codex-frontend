import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TagsInput } from "react-tag-input-component";
import settingsStyles from "../../../styles/settingsStyles";
import { CreateGroupProps } from "../../../interfaces/settings.interface";
import { createGroup as createNewGroup } from "../../../services/settings.services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { validateEmail } from "../../../utils/functions";
import { setListGroups } from "../../../redux/reducers/global.slice";

const CreateGroup = (props: CreateGroupProps) => {
  const { t } = useTranslation();
  let { display, handleClose } = props;
  const classes = settingsStyles();
  const dispatch: AppDispatch = useDispatch();
  const { listGroups } = useSelector((state: RootState) => state.global);
  const [emails, setEmails] = useState<Array<string>>([]);
  const [invalidEmails, setInvalidEmails] = useState<Array<string>>([]);
  const [groupName, setGoupName] = useState<string>("");
  const [groupNameError, setGoupNameError] = useState<boolean>(false);

  const handleEmailsChange = (newEmails: Array<string>) => {
    setEmails(newEmails);

    // Check email validity and update invalidEmails state
    const invalidEmailList: Array<string> = newEmails.filter(
      (email) => !validateEmail(email)
    );
    setInvalidEmails(invalidEmailList);
  };

  const handleChangeGroupName = (event: any) => {
    setGoupName(event.target.value);
    if (!event.target.value) {
      setGoupNameError(true);
    } else {
      setGoupNameError(false);
    }
  };

  const resetCreateGroup = () => {
    handleClose();
    setGoupName("");
    setEmails([]);
    setInvalidEmails([]);
    setGoupNameError(false);
  };
  const createGroup = () => {
    if (!groupName) {
      setGoupNameError(true);
    } else {
      setGoupNameError(false);
    }
    if (invalidEmails.length === 0 && groupName) {
      dispatch(createNewGroup({ group_name: groupName, members: emails })).then(
        (data: any) => {
          if (data.payload.success) {
            resetCreateGroup();
            //add the new group to the global list of groups
            let newListGroups = [...listGroups];
            newListGroups.push({
              groupId: data.payload?.data?.group_id,
              members: emails,
              name: groupName,
              owner: localStorage.getItem("email") as string,
            });
            dispatch(setListGroups(newListGroups));
          }
        }
      );
    }
  };

  return (
    <Grid container>
      {display && (
        <Card className={classes.cardContainer}>
          <CardContent>
            {" "}
            <Typography className={classes.cardTitle} gutterBottom>
              {t("CREATE_GROUP")}
            </Typography>
            <Grid container className={classes.groupNameContainer}>
              <Grid item xs={3}>
                {" "}
                <Typography className={classes.title}>
                  {t("GROUP_NAME")}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                {" "}
                <TextField
                  variant="standard"
                  onChange={handleChangeGroupName}
                  helperText={groupNameError ? t("ERROR_REQUIRED") : ""}
                  error={groupNameError}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.inviteMembersContainer}>
              <Grid item xs={3}>
                {" "}
                <Typography className={classes.title}>
                  {t("INVITE_MEMBERS")}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TagsInput
                  value={emails}
                  onChange={handleEmailsChange}
                  placeHolder={t("ENTER_EMAIL_ADDRESSES") || ""}
                />
                {invalidEmails.length > 0 && (
                  <Grid container className={classes.invalidEmailContainer}>
                    {invalidEmails.map((email) => (
                      <Typography key={email}>{email}*</Typography>
                    ))}
                    <Typography>
                      {" "}
                      &ensp;{t("ENTER_VALID_EMAIL_ADDRESSES")}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button variant="outlined" size="small" onClick={resetCreateGroup}>
              {t("CANCEL")}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={createGroup}
              disabled={!groupName || invalidEmails.length !== 0}
            >
              {t("SUBMIT")}
            </Button>
          </CardActions>
        </Card>
      )}
    </Grid>
  );
};
export default CreateGroup;
