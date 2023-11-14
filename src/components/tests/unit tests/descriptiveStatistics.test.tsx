import { screen, cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { translate } from "../../../utils/utils";
import DescriptiveStatistics from "../../descriptiveStatistics/descriptiveStatistics";

afterEach(() => {
  cleanup();
});
describe("discriptive static", () => {
  test("enders form when selectedDataFormat is 'form ", () => {
    const props = {
      variables: [],
    };
    render(<DescriptiveStatistics {...props} />);
    const variabled = screen.getByText(translate("VARIABLES"));
    expect(variabled).toBeInTheDocument();

    const roundDecimal = screen.getByText(/Number of decimals/i);
    expect(roundDecimal).toBeInTheDocument();
  });
});
