import { screen, cleanup, fireEvent, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import SetData from "../../trainModel/setData/setData";
import userEvent from "@testing-library/user-event";
import { useTranslation } from "react-i18next";

afterEach(() => {
  cleanup();
});

test("dataset, target and next button should be rendered ", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  render(<SetData />);
  const dataset = screen.getByLabelText(t("DATASET").toString());
  expect(dataset).toBeInTheDocument();

  const target = screen.getByLabelText(t("TARGET").toString());
  expect(target).toBeInTheDocument();

  const nextButton = screen.getByRole("button", {
    name: t("BUTTON_NEXT").toString(),
  });
  expect(nextButton).toBeInTheDocument();
});

test("should return a error when submit the form if the dataset is empty ", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  render(<SetData />);
  const dataset = screen.getByLabelText(t("DATASET").toString());
  const sessionName = screen.getByLabelText(t("SESSION_NAME").toString());

  const nextButton = screen.getByRole("button", {
    name: t("BUTTON_NEXT").toString(),
  });

  userEvent.type(dataset, " ");
  userEvent.type(sessionName, " ");

  userEvent.click(nextButton);

  const error = screen.getAllByText(t("ERROR_REQUIRED").toString(), {
    exact: false,
  })[0] as HTMLAnchorElement;
  expect(error).toBeInTheDocument();
});

test("should be able to submit the form", () => {
  const { result } = renderHook(() => useTranslation());
  const { t } = result.current;
  render(<SetData />);
  const dataset = screen.getByLabelText(t("DATASET").toString());
  const target = screen.getByLabelText(t("TARGET").toString());
  const sessionName = screen.getByLabelText(t("SESSION_NAME").toString());
  expect(sessionName).not.toBe("");
  const submitButton = screen.getByRole("button", {
    name: t("BUTTON_NEXT").toString(),
  });

  userEvent.type(dataset, "wash-data");
  userEvent.type(target, "Age");

  fireEvent.click(submitButton);
});
