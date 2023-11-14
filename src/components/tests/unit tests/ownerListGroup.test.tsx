import React from "react";
import { screen, cleanup, renderHook } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import { useTranslation } from "react-i18next";
import OwnerListGroup from "../../settings/group management/ownerListGroup";

afterEach(() => {
  cleanup();
});

describe("ownr list group", () => {
  test("title,name,members,invit , edit randomSeed should be rendered ", () => {
    const { result } = renderHook(() => useTranslation());
    const { t } = result.current;
    render(<OwnerListGroup />);
    const myGroup = screen.getByText(t("MY_GROUP").toString());
    expect(myGroup).toBeInTheDocument();
  });
});
