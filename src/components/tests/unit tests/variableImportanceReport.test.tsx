import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import VariableImportanceReport from "../../variableImportanceReport/variableImportanceReport";

afterEach(() => {
  cleanup();
});
jest.mock("@progress/kendo-react-pdf", () => ({
  PDFExport: jest.fn(),
}));

describe("variable importance", () => {
  test("title,name,members,invit , edit randomSeed should be rendered ", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;
    render(<VariableImportanceReport />);
    const back = screen.getByText(t("GO_BACK").toString());
    expect(back).toBeInTheDocument();

    const featureSummary = screen.getByText(
      t("FEATURE_ENGINEERING_SUMMARY").toString()
    );
    expect(featureSummary).toBeInTheDocument();

    const hyperParamater = screen.getByText(
      t("HYPERPARAMETER_VALUES").toString()
    );
    expect(hyperParamater).toBeInTheDocument();

    const permutation = screen.getByText(
      t("PERMUTATION_IMPORTANCE").toString()
    );
    expect(permutation).toBeInTheDocument();
  });
});
