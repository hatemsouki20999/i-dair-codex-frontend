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
import deepClone from "deep-clone";
import { CategoricalVariableI } from "../../interfaces/variable.interface";
import Plot from "./variablePlot";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";
import getTableRow from "./getTableRow";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useTranslation } from "react-i18next";

const CategoricalVariable = (props: {
  variable: CategoricalVariableI;
  variableName: string;
}) => {
  const { variable, variableName } = props;
  const { t } = useTranslation();
  const classes = descriptiveStatisticsStyles();
  let { roundDecimalNumber } = useSelector(
    (state: RootState) => state.descriptiveStatistics
  );

  return (
    <Grid container spacing={2}>
      <Grid xs={3}>
        <Grid>
          <Typography variant="h6" className={classes.title}>
            {variableName}
          </Typography>
        </Grid>
        <Typography className={classes.title}>{t("CATEGORICAL")}</Typography>
      </Grid>
      <Grid xs={3}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableBody>
              {getTableRow(t("DISTINCT"), variable.n_distinct)}
              {getTableRow(
                `${t("DISTINCT")} ${t("PERCENT_SYMBOL")}`,
                `${Number(variable.p_distinct * 100).toFixed(
                  parseInt(roundDecimalNumber)
                )} ${t("PERCENT_SYMBOL")}`
              )}
              {getTableRow(t("MISSING"), variable.n_missing)}
              {getTableRow(
                `${t("MISSING")} ${t("PERCENT_SYMBOL")}`,
                `${Number(variable.p_missing * 100).toFixed(
                  parseInt(roundDecimalNumber)
                )} ${t("PERCENT_SYMBOL")}`
              )}
              {getTableRow(
                t("MEMORY_SIZE"),
                `${Number(variable.memory_size / 1024).toFixed(
                  parseInt(roundDecimalNumber)
                )} ${t("KIB")}`
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xs={6}>
        <Plot plotData={deepClone(variable.plot)} width="650" height="410" />
      </Grid>
      <Grid xs={6}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {" "}
                <TableCell>{t("LENGTH")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getTableRow(t("MAX_LENGTH"), variable.max_length)}
              {getTableRow(t("MEDIAN_LENGTH"), variable.median_length)}
              {getTableRow(
                t("MEAN_LENGTH"),
                `${Number(variable.mean_length).toFixed(
                  parseInt(roundDecimalNumber)
                )}`
              )}
              {getTableRow(t("MIN_LENGTH"), variable.min_length)}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xs={6}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {" "}
                <TableCell>{t("UNIQUE")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getTableRow(t("UNIQUE"), variable.n_unique)}
              {getTableRow(
                `${t("UNIQUE")} ${t("PERCENT_SYMBOL")}`,
                `${Number(variable.p_unique).toFixed(
                  parseInt(roundDecimalNumber)
                )} ${t("PERCENT_SYMBOL")}`
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default CategoricalVariable;
