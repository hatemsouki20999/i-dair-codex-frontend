import React from "react";
import { screen, cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import Toast from "../../toast/toast";

afterEach(() => {
  cleanup();
});

describe("Toast component", () => {
  test("success alert, should be rendered ", () => {
    let message = "success";
    render(
      <Toast
        handleClose={""}
        showToast={{ open: true, type: "success", message }}
      />
    );
    const successMessage = screen.getByText(message);
    expect(successMessage).toBeInTheDocument();

    const successIcon = screen.getByTestId("SuccessOutlinedIcon");
    expect(successIcon).toBeInTheDocument();

    const closeIcon = screen.getByTestId("CloseIcon");
    expect(closeIcon).toBeInTheDocument();
  });

  test("error alert, should be rendered ", () => {
    let message = "error";
    render(
      <Toast
        handleClose={""}
        showToast={{ open: true, type: "error", message }}
      />
    );
    const successMessage = screen.getByText(message);
    expect(successMessage).toBeInTheDocument();

    const successIcon = screen.getByTestId("ErrorOutlineIcon");
    expect(successIcon).toBeInTheDocument();
  });
});
