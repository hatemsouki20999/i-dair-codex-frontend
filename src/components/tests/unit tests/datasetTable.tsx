import React from "react";
import { cleanup, screen } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import DatasetTable from "../../listDataset/datasetTable";

afterEach(() => {
  cleanup();
});

test("loader, should be rendered", () => {
  render(<DatasetTable />);
  const loader = screen.getByTestId("loader");
  expect(loader).toBeInTheDocument();
});
