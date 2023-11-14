import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import deepClone from "deep-clone";
import { BooleanVariableI } from "../../interfaces/variable.interface";
import Plot from "./variablePlot";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";
import getTableRow from "./getTableRow";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useTranslation } from "react-i18next";

const BooleanVariable = (props: {
  variable: BooleanVariableI;
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

        <Grid>
          {" "}
          <Typography className={classes.title}>{t("BOOLEAN")}</Typography>
        </Grid>
      </Grid>
      <Grid xs={3}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableBody>
              {getTableRow(t("DISTINCT"), variable.n_distinct)}
              {getTableRow(
                `${t("DISTINCT")} ${t("PERCENT_SYMBOL")}`,
                `${
                  Number(variable.p_distinct * 100) < 0.1
                    ? "< 0.1%"
                    : `${Number(variable.p_distinct * 100).toFixed(
                        parseInt(roundDecimalNumber)
                      )}%`
                }`
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
    </Grid>
  );
};

export default BooleanVariable;
