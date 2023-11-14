import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import CreateGroup from "../../settings/group management/createGroup";

afterEach(() => {
  cleanup();
});

describe("create group", () => {
  test("training, validation, shuffle, randomSeed should be rendered ", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;
    const props = {
      handleClose: () => {},
      display: true,
    };

    render(<CreateGroup {...props} />);
    const createGroup = screen.getByText(t("CREATE_GROUP").toString());
    expect(createGroup).toBeInTheDocument();

    const groupName = screen.getByText(t("GROUP_NAME").toString());
    expect(groupName).toBeInTheDocument();

    const inviteMembers = screen.getByText(t("INVITE_MEMBERS").toString());
    expect(inviteMembers).toBeInTheDocument();

    const cancel = screen.getByRole("button", { name: t("CANCEL").toString() });
    expect(cancel).toBeInTheDocument();

    const submit = screen.getByRole("button", { name: t("SUBMIT").toString() });
    expect(submit).toBeInTheDocument();
  });
});
