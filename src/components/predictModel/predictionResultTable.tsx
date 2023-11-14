import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import predictionStyles from "../../styles/predictionStyles";
import { capitalizeText } from "../../utils/functions";

const PredictionResultTable = ({ predictResult }: any) => {
  const { t } = useTranslation();
  const classes = predictionStyles();

  let { selectedTargetForPrediction } = useSelector(
    (state: RootState) => state.prediction
  );

  return (
    <Grid container className={classes.predictionsTable}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align={"center"} sx={{ minWidth: 120 }}>
                <Typography className={classes.tableText}>
                  {t("MODEL")}
                </Typography>
              </TableCell>
              <TableCell align={"center"} sx={{ minWidth: 120 }}>
                <Typography className={classes.tableText}>{`${t(
                  "PREDICTED_VALUE"
                )} (${selectedTargetForPrediction})`}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictResult.data.map((prediction: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell align={"center"} sx={{ minWidth: 120 }}>
                    {` ${capitalizeText(prediction.model_name)} (${
                      prediction.email
                    })`}
                  </TableCell>
                  <TableCell align={"center"} sx={{ minWidth: 120 }}>
                    {prediction.predictions}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default PredictionResultTable;
