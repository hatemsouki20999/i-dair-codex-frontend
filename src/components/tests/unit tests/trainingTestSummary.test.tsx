import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import TrainingTestSummary from "../../dataPartition/TrainingTestSummary";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});


test("summary, number of cases, variables should be rendered ", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  render(<TrainingTestSummary />);
  const summary = screen.getByText(t("SUMMARY").toString());
  expect(summary).toBeInTheDocument();

  const numberOfCasesForTest = screen.getByText(
    t("TEST_NUMBER_CASES").toString(),
    {
      exact: false,
    }
  );
  expect(numberOfCasesForTest).toBeInTheDocument();

  const numberOfCasesForValidation = screen.getByText(
    t("VALIDATION_NUMBER_CASES").toString(),
    { exact: false }
  );
  expect(numberOfCasesForValidation).toBeInTheDocument();

  const variables = screen.getByText(t("VARIABLES").toString(), {
    exact: false,
  });
  expect(variables).toBeInTheDocument();
});
