import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import GroupManagementModal from "../../settings/group management/groupManagementModal";

afterEach(() => {
  cleanup();
});

describe("train result", () => {
  test("training, validation, shuffle, randomSeed should be rendered ", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;
    const props = {
      handleClose: () => {},
      open: true,
    };

    render(<GroupManagementModal {...props} />);
    const groupManagaement = screen.getByText(t("GROUP_MANAGEMENT").toString());
    expect(groupManagaement).toBeInTheDocument();
  });
});
