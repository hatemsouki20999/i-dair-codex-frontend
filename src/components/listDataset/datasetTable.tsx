import {
  AlertColor,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  downloadFile,
  getListDataset,
} from "../../services/uploadFile.services";
import listDatasetStyles from "../../styles/listDatasetStyles";
import Loader from "../Loader/loader";
import DownloadIcon from "@mui/icons-material/Download";
import download from "downloadjs";
import {
  seDisplayDescriptiveStatistics,
  setShowToast,
} from "../../redux/reducers/uploadFile.slice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DisplayDescriptiveStatistics from "./displayDescriptiveStatistics";
import { getDescriptiveStatistics } from "../../services/descriptiveStatistics.services";
import { deleteDataset } from "../../services/removeDataset.services";
import { setSelectedDataset } from "../../redux/reducers/descriptiveStatistics.slice";
import { useTranslation } from "react-i18next";
import SelectGroupModal from "./selectGroupModal";
import Toast from "../toast/toast";
import { capitalizeText } from "../../utils/functions";
import ConfirmDeleteModal from "../modals/confirmDeleteModal";
import { traceSpan } from "../../tracing";

const DatasetTable = () => {
  const classes = listDatasetStyles();
  const { t } = useTranslation();
  const { listDataSet, loader, displayDescriptiveStatistics, showToast } =
    useSelector((state: RootState) => state.uploadDataset);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [idDataset, setIdDataset] = useState<any>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleConfirmModal = (openModal: boolean) => {
    setOpenConfirmModal(openModal);
  };
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    traceSpan(
      "Trace of get list dataset",
      async (trace_id: string, span_id: string) => {
        await dispatch(
          getListDataset({ trace_id: trace_id, span_id: span_id })
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const downloadDataset = async (id: number) => {
    await traceSpan(
      "Trace of download file",
      async (trace_id: string, span_id: string) => {
        await dispatch(
          downloadFile({ id: id, trace_id: trace_id, span_id: span_id })
        ).then((data: any) => {
          if (data.payload.success) {
            const downloadDocData = data.payload.data.data;
            const currentFile: any = listDataSet.find(
              (dataset: any) => dataset.id === id
            );
            const uint8Array = new Uint8Array(downloadDocData);
            const uint8ArrayBuffer = uint8Array.buffer;
            const documentFile = new Blob([uint8ArrayBuffer], {
              type: "text/csv",
            });
            download(documentFile, currentFile?.file_name, "text/csv");
          }
        });
      }
    );
  };

  const showDetails = async (id: number) => {
    await traceSpan(
      "Display Descriptive Statistics",
      async (trace_id: string, span_id: string) => {
        const dataStatistic = {
          idDataset: id.toString(),
          trace_id: trace_id,
          span_id: span_id,
        };
        return dispatch(getDescriptiveStatistics(dataStatistic));
      }
    );
    dispatch(seDisplayDescriptiveStatistics(true));
    dispatch(setSelectedDataset(id));
  };

  const removeDataset = (id: number) => {
    dispatch(deleteDataset(id)).then((res: any) => {
      if (res.payload.success) {
        setOpenConfirmModal(false);
      }
    });
  };

  const handleDelete = (id: number) => {
    setIdDataset(id);
    setOpenConfirmModal(true);
  };

  const handleModal = (isOpen: boolean, idDataset?: number) => {
    setOpen(isOpen);
    dispatch(setSelectedDataset(idDataset));
  };

  const handleClose = (
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
    <>
      {!displayDescriptiveStatistics ? (
        <>
          {loader ? (
            <Box sx={{ mt: 8 }}>
              {" "}
              <Loader />{" "}
            </Box>
          ) : (
            <Grid container>
              <TableContainer
                className={classes.tableContainer}
                data-testid="dataset-table"
              >
                {listDataSet.length !== 0 ? (
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("FILE_NAME")}
                        </TableCell>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("STUDY_NAME")}
                        </TableCell>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("COUNTRY")}
                        </TableCell>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("UPLOAD_DATA")}
                        </TableCell>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("DOWNlOAD")}
                        </TableCell>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("VIEW")}
                        </TableCell>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("DELETE")}
                        </TableCell>
                        <TableCell align={"center"} sx={{ minWidth: 120 }}>
                          {t("GROUP_NAME")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listDataSet
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((dataset: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                {capitalizeText(dataset.file_name)}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                {capitalizeText(dataset.study_name)}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                {capitalizeText(dataset.country)}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                {moment(dataset.created_at).format(
                                  "DD/MM/YYYY HH:mm:SS"
                                )}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                <Button
                                  variant="outlined"
                                  title={t("DOWNlOAD").toString()}
                                  onClick={() => {
                                    downloadDataset(dataset.id);
                                  }}
                                >
                                  <DownloadIcon />
                                </Button>{" "}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                <Button
                                  variant="outlined"
                                  title={t("DETAILS").toString()}
                                  onClick={() => {
                                    showDetails(dataset.id);
                                  }}
                                >
                                  <VisibilityIcon />
                                </Button>
                              </TableCell>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                <Button
                                  variant="outlined"
                                  title={t("DELETE").toString()}
                                  onClick={() => {
                                    handleDelete(dataset.id);
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </TableCell>
                              <TableCell
                                align={"center"}
                                sx={{ minWidth: 120 }}
                              >
                                {dataset.group_name ? (
                                  dataset.group_name
                                ) : (
                                  <Button
                                    variant="outlined"
                                    title={t("ASSIGN_TO_GROUP").toString()}
                                    onClick={() =>
                                      handleModal(true, dataset.id)
                                    }
                                  >
                                    {t("ASSIGN_TO_GROUP")}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography className={classes.noDataText}>
                    {t("NO_DATASET")}
                  </Typography>
                )}
              </TableContainer>
              <Grid container className={classes.paginationContainer}>
                {listDataSet.length !== 0 && (
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={listDataSet.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <DisplayDescriptiveStatistics />
      )}
      {open && (
        <SelectGroupModal open={open} handleClose={() => handleModal(false)} />
      )}
      <ConfirmDeleteModal
        handleDelete={() => removeDataset(idDataset)}
        open={openConfirmModal}
        handleClose={() => handleConfirmModal(false)}
        message={t("CONFIRM_DELETE_DATASET")}
        header={t("CONFIRM_DELETE_DATASET_HEADER").toUpperCase()}
      />
      <Toast handleClose={handleClose} showToast={showToast} />
    </>
  );
};

export default DatasetTable;
