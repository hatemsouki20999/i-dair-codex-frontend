import { TableCell, TableRow } from "@mui/material";

const getTableRow = (rowLabel: string, rowValue: string | number) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {rowLabel}
      </TableCell>
      <TableCell align="right">{rowValue}</TableCell>
    </TableRow>
  );
};

export default getTableRow;
