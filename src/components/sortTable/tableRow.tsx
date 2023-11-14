import {
  capitalizeText,
  getMetricsKey,
  groupByTask,
} from "../../utils/functions";
import { Button, Checkbox, Link, TableCell, TableRow } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTranslation } from "react-i18next";
import { NewModel } from "../../interfaces/model.interface";

export interface RowtableProps {
  index: number;
  model: NewModel;
  handleClick?: (model: any, task: string) => void;
  isItemSelected?: boolean;
  showVariableReport: (modelId: number) => void;
  task: string;
  listTrainedModel: any[];
  type: boolean;
}

const Rowtable = (props: RowtableProps) => {
  const {
    index,
    model,
    handleClick,
    isItemSelected,
    showVariableReport,
    task,
    listTrainedModel,
    type,
  } = props;
  const mlflowBaseUrl = process.env.REACT_APP_HOST_MLFLOW;
  const { t } = useTranslation();
  if (type && handleClick) {
    return (
      <TableRow
        key={index}
        hover
        onClick={() => {
          handleClick(model, task);
        }}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell padding="checkbox">
          <Checkbox color="primary" checked={isItemSelected} />
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {capitalizeText(model.name)}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {capitalizeText(model.sessionName)}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {`${moment(model.created_at).format("DD/MM/YYYY hh:mm:ss")}`}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {capitalizeText(model.target)}
        </TableCell>
        {getMetricsKey(groupByTask(listTrainedModel)[task]).map(
          (metric: any, indexMetric: number) => {
            return (
              <TableCell
                align={"center"}
                sx={{
                  minWidth: 120,
                }}
                key={indexMetric}
              >
                {model[metric]}
              </TableCell>
            );
          }
        )}
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          <Link
            href={`${mlflowBaseUrl}/#/experiments/0/runs/${model.run_id}`}
            color="primary"
            target={"_blank"}
          >
            <LaunchIcon />
          </Link>
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          <Button
            variant="outlined"
            title={t("DETAILS").toString()}
            onClick={() => {
              showVariableReport(model.id);
            }}
          >
            <VisibilityIcon />
          </Button>
        </TableCell>
      </TableRow>
    );
  } else {
    return (
      <TableRow key={index}>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {capitalizeText(model.name)}{" "}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {capitalizeText(model.sessionName)}{" "}
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          {`${moment(model.created_at).format("DD/MM/YYYY HH:mm:SS")}`}
        </TableCell>
        {getMetricsKey(groupByTask(listTrainedModel)[task])?.map(
          (metric: any, metricIndex: number) => {
            return (
              <TableCell
                align={"center"}
                sx={{ minWidth: 120 }}
                key={metricIndex}
              >
                {model[metric]}
              </TableCell>
            );
          }
        )}
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          <Link
            href={`${mlflowBaseUrl}/#/experiments/0/runs/${model.run_id}`}
            color="primary"
            target={"_blank"}
          >
            <LaunchIcon />
          </Link>
        </TableCell>
        <TableCell align={"center"} sx={{ minWidth: 120 }}>
          <Button
            variant="outlined"
            title={t("DETAILS").toString()}
            onClick={() => {
              showVariableReport(model.id);
            }}
          >
            <VisibilityIcon />
          </Button>
        </TableCell>
      </TableRow>
    );
  }
};

export default Rowtable;
