import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import DisplayDescriptiveStatistics from "../../listDataset/displayDescriptiveStatistics";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
const initialState = {
  descriptiveStatistics: {
    variables: {},
    loader: false,
    showToastDescriptiveStatistics: {
      open: false,
      type: "",
      message: "",
    },
    openModal: false,
    selectedDataset: 0,
    downloadPlots: false,
    downloadLoader: false,
    expandedList: [],
    roundDecimalNumber: "",
  },
  uploadDataset: {
    uploadedFileName: {
      value: "",
      errorMessage: "",
    },
    selectedFile: "any",
    idDataset: 0,
    loader: false,
    showToastDescriptiveStatistics: {
      open: false,
      type: "",
      message: "",
    },
    listDataSet: [],
    displayDescriptiveStatistics: false,
  },
};
const mockStore = configureStore([thunk]);
const store = mockStore(initialState);
afterEach(() => {
  cleanup();
});
jest.mock("@progress/kendo-react-pdf", () => ({
  PDFExport: jest.fn(),
}));
describe("file prediction result component", () => {
  test("button should execute download", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;
    render(
      <Provider store={store}>
        <DisplayDescriptiveStatistics />
      </Provider>
    );
    const back = screen.getByText(t("GO_BACK").toString());
    expect(back).toBeInTheDocument();
  });
});
