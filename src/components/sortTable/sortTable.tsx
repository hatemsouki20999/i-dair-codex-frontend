import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "react-i18next";
import { capitalizeText } from "../../utils/functions";

export type Order = "asc" | "desc";

export interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  order: Order;
  orderBy: string;
  metrics?: any;
  displayTarget: boolean;
  numSelected?: number;
  rowCount?: number;
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
}

const getSortTable = (order: any) => {
  return order === "desc" ? "sorted descending" : "sorted ascending";
};

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { t } = useTranslation();
  const {
    order,
    orderBy,
    onRequestSort,
    metrics,
    displayTarget,
    numSelected,
    onSelectAllClick,
    rowCount,
  } = props;
  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead>
      <TableRow>
        {displayTarget && rowCount && numSelected !== undefined && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected === rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
        )}
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {t("MODEL_NAME")}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {t("SESSION_NAME")}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {t("CREATED_AT")}
        </TableCell>
        {displayTarget && (
          <TableCell align={"center"} sx={{ minWidth: 120 }}>
            {t("TARGET_LABEL")}
          </TableCell>
        )}
        {metrics.map((metric: string, index: number) => {
          return (
            <TableCell
              align={"center"}
              sx={{ minWidth: 120 }}
              key={index}
              sortDirection={orderBy === metric ? order : false}
            >
              <TableSortLabel
                active={orderBy === metric}
                direction={orderBy === metric ? order : "asc"}
                onClick={createSortHandler(metric)}
              >
                {" "}
                <Typography>{capitalizeText(metric)}</Typography>{" "}
                {orderBy === metric ? (
                  <Box component="span" sx={visuallyHidden}>
                    {getSortTable(order)}
                  </Box>
                ) : null}
              </TableSortLabel>{" "}
            </TableCell>
          );
        })}
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {t("MLFLOW_LINK")}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {t("VIEW")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export function stableSort(
  array: readonly any[],
  comparator: (a: any, b: any) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

export function descendingComparator(a: any, b: any, orderBy: keyof any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
