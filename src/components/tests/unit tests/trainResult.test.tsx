import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import TrainResult from "../../trainModel/trainResult/TrainResult";
import { useTranslation } from "react-i18next";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
const initialState = {
  trainModel: {
    listTrainedModel: [],
    showVariableImportance: false,
    loaderTrainedModels: true,
  },
};

const mockStore = configureStore([thunk]);
const store = mockStore(initialState);

afterEach(() => {
  cleanup();
});

describe("train result", () => {
  test("renders correctly when loaderTrainedModels is true", () => {
    render(
      <Provider store={store}>
        <TrainResult />
      </Provider>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("renders correctly when loaderTrainedModels is false", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;

    const updatedState = {
      ...initialState,
      trainModel: {
        ...initialState.trainModel,
        listTrainedModel: [],
        loaderTrainedModels: false,
        showVariableImportance: false,
      },
    };
    const updatedStore = mockStore(updatedState);

    render(
      <Provider store={updatedStore}>
        <TrainResult />
      </Provider>
    );

    const text = screen.getByText(t("NO_TRAIN_RESULT").toString());
    expect(text).toBeInTheDocument();
  });
});
