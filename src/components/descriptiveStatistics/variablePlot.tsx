import { Grid } from "@mui/material";
import Plot from "react-plotly.js";
import { Iplot } from "../../interfaces/plots.interface";
import { exportComponentAsJPEG } from "react-component-export-image";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  setDownloadLoader,
  setDownloadPlots,
} from "../../redux/reducers/descriptiveStatistics.slice";
import trainedModelsStyle from "../../styles/trainedModelsStyle";

const VariablePlot = ({ plotData, width, height }: Iplot) => {
  const plotRef = useRef() as any;
  const classes = trainedModelsStyle();
  let dispatch: AppDispatch = useDispatch();
  let { downloadPlots } = useSelector(
    (state: RootState) => state.descriptiveStatistics
  );
  useEffect(() => {
    if (downloadPlots) {
      exportImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadPlots]);

  const exportImages = () => {
    setTimeout(() => {
      exportComponentAsJPEG(plotRef, {
        fileName: plotData?.layout?.xaxis?.title?.text
          ? plotData?.layout?.xaxis?.title?.text
          : "plot.jpg",
      }).then(() => {
        dispatch(setDownloadPlots(false));
        dispatch(setDownloadLoader(false));
      });
    }, 10);
  };
  return (
    <Grid container className={classes.plotsContainer}>
      <Plot
        data={plotData.data}
        layout={{ ...plotData.layout, width: width, height: height }}
        config={{ responsive: true }}
        ref={plotRef}
      />
    </Grid>
  );
};
export default VariablePlot;
