import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import BooleanVariable from "../../descriptiveStatistics/booleanVariable";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

test("boolean text, varibale name should be rendered ", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  const testVariableName = "age_scaled";

  render(
    <BooleanVariable
      variable={{
        n_distinct: 10,
        p_distinct: 20,
        is_unique: true,
        n_unique: 30,
        p_unique: 40,
        type: "boolean",
        hashable: true,
        ordering: true,
        n_missing: 10,
        n: 10,
        p_missing: 96,
        count: 70,
        memory_size: 30,
        plot: 0,
      }}
      variableName={testVariableName}
    />
  );
  const booleanText = screen.getByText(t("BOOLEAN").toString());
  expect(booleanText).toBeInTheDocument();

  const variableName = screen.getByText(testVariableName);
  expect(variableName).toBeInTheDocument();
});
