import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import DataPartition from "../../dataPartition/dataPartition";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

describe("Data partition component", () => {
  test("texts, fields and submit button, should be rendered ", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;
    render(<DataPartition />);
    const dataset = screen.getAllByText(t("DATASET").toString())[0];
    expect(dataset).toBeInTheDocument();

    const submitButton = screen.getByText(t("SUBMIT").toString());
    expect(submitButton).toBeInTheDocument();

    const training = screen.getByText(t("TRAINING").toString());
    expect(training).toBeInTheDocument();

    const validation = screen.getByText(t("VALIDATION").toString());
    expect(validation).toBeInTheDocument();
  });
});
