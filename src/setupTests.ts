
import "@testing-library/jest-dom";
import "jest-canvas-mock";

if (typeof window.URL.createObjectURL === "undefined") {
  window.URL.createObjectURL = jest.fn();
}
