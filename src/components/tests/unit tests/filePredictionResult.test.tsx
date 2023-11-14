import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import FilePredictionResult from "../../predictModel/filePredictionResult";

afterEach(() => {
  cleanup();
});

describe("file prediction result component", () => {
  test("button should execute download", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;
    render(<FilePredictionResult />);

    const model = screen.getByText("Model");
    expect(model).toBeInTheDocument();
    const prediction = screen.getByText(t("PREDICTION").toString());
    expect(prediction).toBeInTheDocument();

   
  });
});