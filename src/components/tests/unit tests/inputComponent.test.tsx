import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import InputComponent from "../../uploadDataset/inputComponent";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

test("input title,input label should be rendered ", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  render(
    <InputComponent
      name={t("STUDY_NAME")}
      label={t("STUDY_NAME")}
      changeHandler={""}
      state={{ errorMessage: t("ERROR_REQUIRED") }}
      title={t("STUDY_NAME")}
    />
  );
  const inputTitle = screen.getAllByText(t("STUDY_NAME").toString())[0];
  expect(inputTitle).toBeInTheDocument();

  const inputLabel = screen.getByTitle(t("STUDY_NAME").toString());
  expect(inputLabel).toBeInTheDocument();

  const error = screen.getByText(t("ERROR_REQUIRED").toString());
  expect(error).toBeInTheDocument();
});
