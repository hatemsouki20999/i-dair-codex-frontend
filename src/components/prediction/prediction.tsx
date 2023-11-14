import ListTrainedModels from "./listTrainedModels";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import RowToPredict from "../predictModel/rowToPredict";

const Prediction = () => {
  let { displayPrediction } = useSelector(
    (state: RootState) => state.prediction
  );

  return !displayPrediction ? <ListTrainedModels /> : <RowToPredict />;
};

export default Prediction;
