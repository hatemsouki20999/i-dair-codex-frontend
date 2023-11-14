import React from "react";
import { cleanup } from "@testing-library/react";
import { render } from "../testUtils";
import "@testing-library/jest-dom";
import Plot from "../../descriptiveStatistics/variablePlot";

afterEach(() => {
  cleanup();
});

test("no plot, should be rendered", () => {
  render(<Plot plotData={{}} width="650" height="410" />);

  // Find the SVG element with the ID
  const svgElement = document.querySelector("#js-plotly-tester");
  // Assert that the element exists
  expect(svgElement).not.toBeInTheDocument();
});

test("a plot , should be rendered", () => {
  const data = [{ x: [1, 2, 3], y: [2, 1, 3], type: "scatter" }];
  const layout = { width: 500, height: 500, title: "My Chart" };

  render(<Plot plotData={{ data, layout }} width="650" height="410" />);

  const svgElement = document.querySelector("#js-plotly-tester");
  expect(svgElement).toBeInTheDocument();
});
