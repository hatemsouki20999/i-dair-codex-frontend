import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { seDisplayDescriptiveStatistics } from "../../redux/reducers/uploadFile.slice";
import { AppDispatch, RootState } from "../../redux/store/store";
import DescriptiveStatistics from "../descriptiveStatistics/descriptiveStatistics";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";
import Loader from "../Loader/loader";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { PDFExport } from "@progress/kendo-react-pdf";
import {
  setDownloadLoader,
  setDownloadPlots,
  setExpandedList,
} from "../../redux/reducers/descriptiveStatistics.slice";
import { useTranslation } from "react-i18next";
import { capitalizeText } from "../../utils/functions";

const DisplayDescriptiveStatistics = () => {
  const dispatch: AppDispatch = useDispatch();
  const classes = descriptiveStatisticsStyles();
  const { t } = useTranslation();

  let pdfExportComponent = useRef<PDFExport>(null);

  const { variables, loader, selectedDataset, downloadLoader, downloadPlots } =
    useSelector((state: RootState) => state.descriptiveStatistics);
  const { listDataSet } = useSelector(
    (state: RootState) => state.uploadDataset
  );
  const [datasetData, setDatasetData] = useState<any>({});

  useEffect(() => {
    let data = listDataSet.find((elem: any) => elem.id === selectedDataset);
    setDatasetData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataset]);

  useEffect(() => {
    // dispatch(setDownloadLoader(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadPlots]);

  const handleBack = () => {
    dispatch(seDisplayDescriptiveStatistics(false));
  };

  const exportPdf = async () => {
    dispatch(
      setExpandedList(new Array(Object.keys(variables).length).fill(true))
    );
    setTimeout(async () => {
      dispatch(setDownloadLoader(true));
      if (pdfExportComponent.current) {
        pdfExportComponent.current.save(() => {
          dispatch(setDownloadLoader(false));
        });
      }
    }, 1200);
  };

  const exportImages = async () => {
    dispatch(
      setExpandedList(new Array(Object.keys(variables).length).fill(true))
    );
    setTimeout(async () => {
      dispatch(setDownloadPlots(true));
    }, 10000);
    dispatch(setDownloadLoader(true));
  };
  useEffect(() => {
    if (!downloadLoader) {
      dispatch(
        setExpandedList(new Array(Object.keys(variables).length).fill(false))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadLoader]);

  return (
    <Grid container>
      <Grid
        container
        className={classes.handleBackContainer}
        onClick={handleBack}
      >
        <ArrowBackIcon color="primary" />{" "}
        <Typography className={classes.goBackTitle}>{t("GO_BACK")}</Typography>
      </Grid>
      <Grid container>
        {" "}
        {loader ? (
          <Grid container className={classes.loader}>
            {" "}
            <Loader />
          </Grid>
        ) : (
          <>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={downloadLoader}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <PDFExport
              paperSize="auto"
              margin="1cm"
              ref={pdfExportComponent}
              fileName={`${datasetData?.study_name}.pdf`}
            >
              <Grid container>
                <Grid container>
                  <Grid item xs={2}>
                    {" "}
                    <Typography className={classes.titleVariable}>
                      {t("STUDY_NAME")}:
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    {" "}
                    <Typography>
                      {capitalizeText(datasetData?.study_name)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4.5}
                    className={classes.exportPdfButtonContainer}
                  >
                    {" "}
                    <Button variant="outlined" onClick={exportPdf}>
                      {t("GENERATE_PDF")}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={1.5}
                    className={classes.exportPdfButtonContainer}
                  >
                    <Button variant="outlined" onClick={exportImages}>
                      {t("EXPORT_PLOTS")}
                    </Button>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={2}>
                    {" "}
                    <Typography className={classes.titleVariable}>
                      {t("COUNTRY")}:
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    {" "}
                    <Typography>
                      {capitalizeText(datasetData?.country)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={2}>
                    {" "}
                    <Typography className={classes.titleVariable}>
                      {t("UPLOAD_DATA")}:
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    {" "}
                    <Typography>
                      {moment(datasetData?.created_at).format(
                        "DD/MM/YYYY HH:mm:SS"
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography className={classes.titleVariable}>
                      {t("DATASET_LABEL")}:
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    {" "}
                    <Typography>
                      {capitalizeText(datasetData?.file_name)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  {Object.keys(variables).length > 0 && (
                    <Grid container>
                      <DescriptiveStatistics variables={variables} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </PDFExport>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default DisplayDescriptiveStatistics;
