import {
  AlertColor,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TagsInput } from "react-tag-input-component";
import settingsStyles from "../../styles/settingsStyles";
import { createUser as createNewUser } from "../../services/settings.services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { validateEmail } from "../../utils/functions";
import { setShowToast } from "../../redux/reducers/settings.slice";
import Toast from "../toast/toast";

const CreateUser = () => {
  const { t } = useTranslation();
  const classes = settingsStyles();
  const dispatch: AppDispatch = useDispatch();
  const [emails, setEmails] = useState<Array<string>>([]);
  const [invalidEmails, setInvalidEmails] = useState<Array<string>>([]);
  let { showToast } = useSelector((state: RootState) => state.settings);

  const handleEmailsChange = (newEmails: Array<string>) => {
    setEmails(newEmails);

    // Check email validity and update invalidEmails state
    const invalidEmailList: Array<string> = newEmails.filter(
      (email) => !validateEmail(email)
    );
    setInvalidEmails(invalidEmailList);
  };

  const resetCreateUser = () => {
    setEmails([]);
    setInvalidEmails([]);
  };
  const createUser = () => {
    dispatch(createNewUser({ members: emails })).then((data: any) => {
      if (data.payload.success) {
        resetCreateUser();
      }
    });
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
    <Grid container>
      <Card className={classes.cardContainer}>
        <CardContent>
          {" "}
          <Typography className={classes.cardTitle} gutterBottom>
            {t("CREATE_USER")}
          </Typography>
          <Grid container className={classes.inviteMembersContainer}>
            <Grid item xs={3}>
              {" "}
              <Typography className={classes.title}>
                {t("ADD_USERS")}
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
          <Button variant="outlined" size="small" onClick={resetCreateUser}>
            {t("CANCEL")}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={createUser}
            disabled={emails.length === 0}
          >
            {t("SUBMIT")}
          </Button>
        </CardActions>
      </Card>
      <Toast handleClose={handleCloseToast} showToast={showToast} />
    </Grid>
  );
};
export default CreateUser;
