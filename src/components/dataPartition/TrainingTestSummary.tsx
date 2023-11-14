import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import sliderStyles from "../../styles/sliderStyles";
import { capitalizeText } from "../../utils/functions";
const TrainingTestSummary = () => {
  const { t } = useTranslation();
  const { summaryData } = useSelector(
    (state: RootState) => state.dataPartition
  );
  const classes = sliderStyles();
  return (
    <Grid container>
      <Grid container>
        <Typography className={classes.textSummary}>{t("SUMMARY")} </Typography>
      </Grid>
      <Grid container>
        <Typography className={classes.summarySubTitle}>
          {" "}
          {t("TEST_NUMBER_CASES")} : &ensp;
        </Typography>{" "}
        <Typography> {summaryData.numberOfCasesTrain}</Typography>
      </Grid>
      <Grid container>
        {" "}
        <Typography className={classes.summarySubTitle}>
          {t("VALIDATION_NUMBER_CASES")} : &ensp;
        </Typography>
        <Typography> {summaryData.numberOfCasesTest}</Typography>
      </Grid>
      <Grid container>
        {" "}
        <Grid container>
          <Typography className={classes.summarySubTitle}>
            {" "}
            {t("VARIABLES")} :{" "}
          </Typography>
        </Grid>
        <Grid container className={classes.columns}>
          <br />
          {summaryData.columns.map((column: string, index: number) => {
            return (
              <Grid item xs={2} key={index}>
                <li>{capitalizeText(column)}</li>{" "}
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TrainingTestSummary;
