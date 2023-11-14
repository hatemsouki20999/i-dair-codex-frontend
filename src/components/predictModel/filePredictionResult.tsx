import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import predictionStyles from "../../styles/predictionStyles";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useTranslation } from "react-i18next";

const FilePredictionResult = () => {
  const classes = predictionStyles();
  const { t } = useTranslation();
  let { predictResult, predictionFiles } = useSelector(
    (state: RootState) => state.prediction
  );

  let downloadPedictionsFile = (idModel: number, fileName: string) => {
    const fileData = predictionFiles[`${fileName}.csv`];
    const blob = new Blob([fileData]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    let modelName = "";
    if (!idModel) {
      modelName = fileName;
    } else {
      modelName = predictResult?.data?.find(
        (elem: any) => elem.id_model === idModel
      )?.model_name;
    }
    link.download = `${modelName}.csv`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  let downloadAllPedictionsFile = () => {
    downloadPedictionsFile(0, "all_models_prediction");
  };

  return (
    <Grid container>
      {" "}
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
                <Typography className={classes.tableText}>
                  {t("PREDICTION")}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictResult?.data?.map((model: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell align={"center"} sx={{ minWidth: 120 }}>
                    {`${model.model_name} (${model.email})`}
                  </TableCell>
                  <TableCell align={"center"} sx={{ minWidth: 120 }}>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      onClick={() => {
                        downloadPedictionsFile(
                          model.id_model,
                          `model_${model.id_model}`
                        );
                      }}
                    >
                      {t("DOWNlOAD")}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {predictResult?.data.length > 1 && (
              <TableRow key={"all"}>
                <TableCell align={"center"} sx={{ minWidth: 120 }}>
                  {t("ALL_MODELS")}
                </TableCell>
                <TableCell align={"center"} sx={{ minWidth: 120 }}>
                  <Button
                    sx={{ textTransform: "capitalize" }}
                    onClick={downloadAllPedictionsFile}
                  >
                    {t("DOWNlOAD")}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default FilePredictionResult;
