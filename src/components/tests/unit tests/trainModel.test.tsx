import { screen, cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import TrainModel from "../../trainModel/train/trainModel";
import { translate } from "../../../utils/utils";

afterEach(() => {
  cleanup();
});

test("next button,should be rendered ", () => {
  render(<TrainModel />);

  const buttonNext = screen.getByRole("button", {
    name: translate("BUTTON_NEXT"),
  });
  expect(buttonNext).toBeInTheDocument();
});
