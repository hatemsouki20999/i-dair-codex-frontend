import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import CategoricalVariable from "../../descriptiveStatistics/categoricalVariable";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

test("categorical title, varibale name should be rendered ", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  const testVariableName = "watersource";
  render(
    <CategoricalVariable
      variable={{
        n_distinct: 10,
        p_distinct: 4,
        is_unique: true,
        n_unique: 3,
        p_unique: 30,
        type: "",
        hashable: true,
        ordering: true,
        n_missing: 10,
        n: 10,
        p_missing: 15,
        count: 10,
        memory_size: 10,
        first_rows: 5,
        chi_squared: 10,
        max_length: 20,
        mean_length: 10,
        median_length: 30,
        min_length: 3,
        word_counts: 10,
        plot: "",
      }}
      variableName={testVariableName}
    />
  );
  const categoricalText = screen.getByText(t("CATEGORICAL").toString());
  expect(categoricalText).toBeInTheDocument();

  const variableName = screen.getByText(testVariableName);
  expect(variableName).toBeInTheDocument();
});
