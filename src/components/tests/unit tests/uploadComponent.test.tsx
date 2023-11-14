import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import UploadComponent from "../../uploadDataset/uploadComponent";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

test("should be display upload button when the file is empty ", () => {
  render(
    <UploadComponent
      name={"DATASET_LABEL"}
      changeHandler={""}
      state={{ value: "", errorMessage: "" }}
      closeFile={""}
    />
  );
  const uploadButton = screen.getByText("Select dataset");
  expect(uploadButton).toBeInTheDocument();
});

test("should be display the file", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  let fileName = "data.csv";
  render(
    <UploadComponent
      name={t("DATASET_LABEL")}
      changeHandler={""}
      state={{ value: fileName, errorMessage: "" }}
      closeFile={""}
    />
  );
  const fileNameText = screen.getByText(fileName);
  expect(fileNameText).toBeInTheDocument();
});
