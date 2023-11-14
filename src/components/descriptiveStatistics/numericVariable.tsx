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
import { NumericVariableI } from "../../interfaces/variable.interface";
import Plot from "./variablePlot";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";
import getTableRow from "./getTableRow";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useTranslation } from "react-i18next";

const NumericVariable = (props: {
  variable: NumericVariableI;
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
      <Grid container>
        <Grid xs={2}>
          <Grid>
            <Typography variant="h6" className={classes.title}>
              {variableName}
            </Typography>
          </Grid>
          <Grid>
            <Grid>
              <Typography className={classes.title}>
                {t("REAL_NUMBER")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={2}>
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
                {getTableRow(t("INFINITE"), variable.n_infinite)}
                {getTableRow(
                  `${t("INFINITE")} ${t("PERCENT_SYMBOL")}`,
                  `${Number(variable.p_infinite * 100).toFixed(
                    parseInt(roundDecimalNumber)
                  )} ${t("PERCENT_SYMBOL")}`
                )}
                {getTableRow(
                  t("MEAN"),
                  Number(variable.mean).toFixed(parseInt(roundDecimalNumber))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid xs={2}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                {getTableRow(
                  t("MINIMUM"),
                  Number(variable.min).toFixed(parseInt(roundDecimalNumber))
                )}
                {getTableRow(
                  t("MAXIMUM"),
                  Number(variable.max).toFixed(parseInt(roundDecimalNumber))
                )}
                {getTableRow(t("ZEROS"), variable.n_zeros)}
                {getTableRow(
                  `${t("ZEROS")} ${t("PERCENT_SYMBOL")}`,
                  `${Number(variable.p_zeros).toFixed(
                    parseInt(roundDecimalNumber)
                  )} ${t("PERCENT_SYMBOL")}`
                )}
                {getTableRow(t("NEGATIVE"), variable.n_negative)}
                {getTableRow(
                  `${t("NEGATIVE")} ${t("PERCENT_SYMBOL")}`,
                  `${Number(variable.p_negative).toFixed(
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
      <Grid container className={classes.globalTableContainer}>
        <Grid xs={6}>
          <TableContainer className={classes.tableContainer}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {" "}
                  <TableCell>
                    <Typography className={classes.tableTitle}>
                      {t("QUANTILE_STATISTICS")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTableRow(
                  t("MINIMUM"),
                  `${Number(variable.min).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("FIFTH_PERCENTILE"),
                  `${Number(variable["5%"]).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("Q_ONE"),
                  `${Number(variable["25%"]).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("MEDIAN"),
                  `${Number(variable["50%"]).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("Q_THREE"),
                  `${Number(variable["75%"]).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("NINETY_FIFTH_PERCENTILE"),
                  `${Number(variable["95%"]).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("MAXIMUM"),
                  `${Number(variable.max).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("RANGE"),
                  `${Number(variable.range).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("INTERQUARTILE_RANGE"),
                  `${Number(variable.iqr).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid xs={6}>
          <TableContainer className={classes.tableContainer}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {" "}
                  <TableCell>
                    <Typography className={classes.tableTitle}>
                      {t("DESCRIPTIVE_STATISTICS")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTableRow(
                  t("STANDARD_DEVIATION"),
                  `${Number(variable.std).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("COEFFICIENT_OF_VARIATION"),
                  `${Number(variable.cv).toFixed(parseInt(roundDecimalNumber))}`
                )}
                {getTableRow(
                  t("KURTOSIS"),
                  `${Number(variable.kurtosis).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("MEAN"),
                  `${Number(variable.mean).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("MAD"),
                  `${Number(variable.mad).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("SKEWNESS"),
                  `${Number(variable.skewness).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("SUM"),
                  `${Number(variable.sum).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("VARIANCE"),
                  `${Number(variable.variance).toFixed(
                    parseInt(roundDecimalNumber)
                  )}`
                )}
                {getTableRow(
                  t("MONOTONICITY"),
                  `${
                    variable.monotonic !== 0
                      ? variable.monotonic
                      : "Not monotonic"
                  }`
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NumericVariable;
