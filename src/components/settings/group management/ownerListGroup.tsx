import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import settingsStyles from "../../../styles/settingsStyles";
import { TagsInput } from "react-tag-input-component";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { validateEmail } from "../../../utils/functions";
import { inviteMembers } from "../../../services/settings.services";
import { setListGroups } from "../../../redux/reducers/global.slice";

const OwnerListGroup = () => {
  const { t } = useTranslation();
  const classes = settingsStyles();
  const dispatch: AppDispatch = useDispatch();
  let ownerEmail = localStorage.getItem("email");
  let { listGroups } = useSelector((state: RootState) => state.global);
  let listOfGroups: any = listGroups
    ?.filter((group: any) => group.owner === ownerEmail)
    ?.map((elem: any) => {
      return {
        ...elem,
        editMembers: false,
        invalidEmails: [],
        newMembers: [...elem.members],
      };
    });
  let [ownerListGroup, setOwnerListGroup] = useState(listOfGroups);
  useEffect(() => {
    setOwnerListGroup(listOfGroups);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listGroups, ownerEmail]);

  const displayEditMembers = (groupId: number, displaying: boolean) => {
    let newOwnerListGroup = [...ownerListGroup];
    let groupIndex = ownerListGroup.findIndex(
      (group: any) => group.groupId === groupId
    );
    if (groupIndex !== -1) {
      newOwnerListGroup[groupIndex].editMembers = displaying;
      setOwnerListGroup(newOwnerListGroup);
    }
  };

  const handleEmailsChange = (newEmails: Array<string>, groupId: number) => {
    let newOwnerListGroup = [...ownerListGroup];
    let groupIndex = ownerListGroup.findIndex(
      (group: any) => group.groupId === groupId
    );
    if (groupIndex !== -1) {
      newOwnerListGroup[groupIndex].newMembers = newEmails;
      const invalidEmailList: Array<string> = newEmails.filter(
        (email) => !validateEmail(email)
      );
      newOwnerListGroup[groupIndex].newMembers = newEmails;
      newOwnerListGroup[groupIndex].invalidEmails = invalidEmailList;
      setOwnerListGroup(newOwnerListGroup);
    }
  };
  const getNewListGroup = (
    groups: any,
    idGroup: number,
    members: Array<string>
  ) => {
    const newListGroup = groups.map((group: any) => {
      if (group.groupId === idGroup) {
        return { ...group, members: members };
      }
      return group;
    });
    return newListGroup;
  };
  const editMembers = (groupId: number, members: Array<string>) => {
    dispatch(inviteMembers({ group_id: groupId, emails: members })).then(
      (data: any) => {
        if (data.payload.success) {
          let newOwnerListGroup = [...ownerListGroup];
          let groupIndex = ownerListGroup.findIndex(
            (group: any) => group.groupId === groupId
          );
          if (groupIndex !== -1) {
            newOwnerListGroup[groupIndex].members = members;
            newOwnerListGroup[groupIndex].invalidEmails = [];
            newOwnerListGroup[groupIndex].editMembers = false;
            const idGroup = newOwnerListGroup[groupIndex].groupId;
            const newListGroup = getNewListGroup(listGroups, idGroup, members);
            dispatch(setListGroups(newListGroup));
            setOwnerListGroup(newOwnerListGroup);
          }
        }
      }
    );
    setListGroups(ownerListGroup);
  };

  return (
    <Card className={classes.listGroupCard}>
      <CardContent>
        {" "}
        <Typography className={classes.cardTitle}>{t("MY_GROUP")}</Typography>
        <Typography className={classes.groupCreatedTitle}>
          {ownerListGroup.length}&ensp;{t("GROUP_CREATED")}
        </Typography>
        <Grid container>
          {ownerListGroup?.map((group: any) => {
            return (
              <Card className={classes.groupCard}>
                <CardContent>
                  <Grid container className={classes.nameContainer}>
                    <Grid item xs={3}>
                      {" "}
                      <Typography className={classes.title}>
                        {t("GROUP_NAME")}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography>{group.name}</Typography>
                    </Grid>
                    <Grid container className={classes.membersContainer}>
                      <Typography>
                        {group.members.length} {t("MEMBERS")} &ensp;
                      </Typography>
                      <Typography
                        title={t("EDIT_MEMBERS")}
                        onClick={() => {
                          displayEditMembers(group.groupId, true);
                        }}
                      >
                        <EditIcon className={classes.editMembersIcon} />
                      </Typography>{" "}
                    </Grid>
                  </Grid>
                  {group?.editMembers && (
                    <>
                      <Grid
                        container
                        className={classes.inviteMembersContainer}
                      >
                        <Grid item xs={3}>
                          {" "}
                          <Typography className={classes.title}>
                            {t("INVITE_MEMBERS")}
                          </Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <TagsInput
                            value={group.members}
                            onChange={(event) => {
                              handleEmailsChange(event, group.groupId);
                            }}
                            placeHolder={t("ENTER_EMAIL_ADDRESSES") || ""}
                          />
                          {group?.invalidEmails.length > 0 && (
                            <Grid
                              container
                              className={classes.invalidEmailContainer}
                            >
                              {group?.invalidEmails.map((email: string) => (
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
                      <Grid
                        container
                        spacing={2}
                        className={classes.editMembersAction}
                      >
                        <Grid item>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              displayEditMembers(group.groupId, false);
                            }}
                          >
                            {t("CANCEL")}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              editMembers(group?.groupId, group?.newMembers);
                            }}
                            disabled={group?.invalidEmails.length !== 0}
                          >
                            {t("EDIT")}
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OwnerListGroup;
