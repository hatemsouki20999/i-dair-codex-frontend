import { TablePagination } from "@mui/material";
import { useEffect } from "react";

export interface Pagination {
  task: string;
  listTrainedModelsWithMetrics: any;
  rowsPerPage: number;
  page: number;
  handleChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePage: any;
  selectedSessionForPrediction: any;
  setPage: any;
}

const PaginationTable = (props: Pagination) => {
  const {
    task,
    listTrainedModelsWithMetrics,
    rowsPerPage,
    page,
    handleChangeRowsPerPage,
    handleChangePage,
    selectedSessionForPrediction,
    setPage,
  } = props;
  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionForPrediction]);

  return (
    <div>
      {listTrainedModelsWithMetrics[task].length !== 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={listTrainedModelsWithMetrics[task].length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default PaginationTable;
