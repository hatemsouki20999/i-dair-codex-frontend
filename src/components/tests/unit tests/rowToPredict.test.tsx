import { screen, cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import RowToPredict from "../../predictModel/rowToPredict";
import { translate } from "../../../utils/utils";

afterEach(() => {
  cleanup();
});
describe("row to predict", () => {
  test("enders form when selectedDataFormat is 'form ", () => {
    render(<RowToPredict />);
    const goBack = screen.getByText(translate("GO_BACK"));
    expect(goBack).toBeInTheDocument();

    const submit = screen.getByRole("button", { name: translate("SUBMIT") });
    expect(submit).toBeInTheDocument();
    const model = screen.getByText("models");
    expect(model).toBeInTheDocument();
    const predictionData = screen.getByText(translate("PREDICTION_DATA"));
    expect(predictionData).toBeInTheDocument();
  });
});
