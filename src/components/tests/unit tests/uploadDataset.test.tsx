import { screen, cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import UploadDataset from "../../uploadDataset/uploadDataset";
import { translate } from "../../../utils/utils";

afterEach(() => {
  cleanup();
});

test("title, fileds and submit button should be rendered", () => {
  render(<UploadDataset />);
  const studyName = screen.getAllByText(translate("STUDY_NAME"))[0];
  expect(studyName).toBeInTheDocument();

  const country = screen.getAllByText(translate("COUNTRY"))[0];
  expect(country).toBeInTheDocument();

  const uploadButton = screen.getByText(translate("DATASET"));
  expect(uploadButton).toBeInTheDocument();

  const submitButton = screen.getByRole("button", {
    name: translate("UPLOAD_DATASET"),
  });
  expect(submitButton).toBeInTheDocument();
});
