import { screen, cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { translate } from "../../../utils/utils";
import {
  EnhancedTableHead,
  EnhancedTableProps,
} from "../../sortTable/sortTable";

afterEach(() => {
  cleanup();
});
describe("EnhancedT able Head", () => {
  test("render model and predicted value ", () => {
    const props: EnhancedTableProps = {
      onRequestSort: jest.fn(),
      order: "asc",
      orderBy: "model_name",
      metrics: ["metric1", "metric2"],
      displayTarget: true,
    };
    render(<EnhancedTableHead {...props} />);

    const model = screen.getByText(/Model name/i);
    expect(model).toBeInTheDocument();

    const sessionName = screen.getByText(/Session name/i);
    expect(sessionName).toBeInTheDocument();

    const createdAT = screen.getByText(/Created at/i);
    expect(createdAT).toBeInTheDocument();

    const targetLabel = screen.getByText(/Target/i);
    expect(targetLabel).toBeInTheDocument();

    const mlFlowLink = screen.getByText(translate("MLFLOW_LINK").toString());
    expect(mlFlowLink).toBeInTheDocument();

    const view = screen.getByText(translate("VIEW").toString());
    expect(view).toBeInTheDocument();
  });
});
