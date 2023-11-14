import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import NumericVariable from "../../descriptiveStatistics/numericVariable";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

test("real number text, varibale name should be rendered ", () => {
  const testVariableName = "age_scaled";
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  render(
    <NumericVariable
      variable={{
        n_distinct: 10,
        p_distinct: 5,
        is_unique: true,
        n_unique: 20,
        p_unique: 23,
        type: "",
        hashable: true,
        ordering: false,
        n_missing: 10,
        n: 20,
        p_missing: 15,
        count: 10,
        memory_size: 30,
        n_negative: 7,
        p_negative: 30,
        n_infinite: 10,
        n_zeros: 6,
        mean: 8,
        std: 10,
        variance: 4,
        min: 60,
        max: 10,
        kurtosis: 30,
        skewness: 6,
        sum: 10,
        mad: 10,
        range: 30,
        "5%": 10,
        "25%": 15,
        "50%": 6,
        "75%": 10,
        "95%": 30,
        iqr: 10,
        cv: 10,
        p_zeros: 4,
        p_infinite: 30,
        monotonic_increase: true,
        monotonic_decrease: false,
        monotonic_increase_strict: true,
        monotonic_decrease_strict: true,
        monotonic: 10,
        plot: 0,
      }}
      variableName={testVariableName}
    />
  );
  const realNumberText = screen.getByText(t("REAL_NUMBER").toString());
  expect(realNumberText).toBeInTheDocument();

  const variableName = screen.getByText(testVariableName);
  expect(variableName).toBeInTheDocument();
});
