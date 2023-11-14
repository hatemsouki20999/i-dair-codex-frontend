import { screen, cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import PredictionResultTable from "../../predictModel/predictionResultTable";

afterEach(() => {
  cleanup();
});
describe('prediction result table', () => {

test("render model and predicted value ", () => {
    const predictResult = {
        data: []
      };
  render(<PredictionResultTable predictResult={predictResult} />);
  const model = screen.getByText(/Model/i); 
  expect(model).toBeInTheDocument();

  const predictedValue = screen.getByText(/Predicted value/i); 
    expect(predictedValue).toBeInTheDocument();
});



});