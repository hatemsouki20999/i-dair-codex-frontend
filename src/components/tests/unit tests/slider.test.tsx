import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import DataSlider from "../../dataPartition/dataSlider";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

test("training, validation, shuffle, randomSeed should be rendered ", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  render(<DataSlider />);
  const training = screen.getByText(t("TRAINING").toString());
  expect(training).toBeInTheDocument();

  const validation = screen.getByText(t("VALIDATION").toString());
  expect(validation).toBeInTheDocument();

  const shuffle = screen.getByLabelText(t("SHUFFLE").toString());
  expect(shuffle).toBeInTheDocument();

  const withoutShuffle = screen.getByLabelText(t("NO_SHUFFLE").toString());
  expect(withoutShuffle).toBeInTheDocument();

  const randomSeed = screen.getByLabelText(t("RANDOM_SEED").toString());
  expect(randomSeed).toBeInTheDocument();
});
