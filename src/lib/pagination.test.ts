import { describe, it, expect } from "vitest";
import { calculatePageNumbers, calculateTotalPages } from "./pagination";

describe("calculatePageNumbers", () => {
  it("shows all pages when total <= 5", () => {
    const result = calculatePageNumbers(1, 3);
    expect(result).toEqual([1, 2, 3]);
  });

  it("shows sliding window for middle pages", () => {
    const result = calculatePageNumbers(5, 10);
    expect(result).toEqual([3, 4, 5, 6, 7]);
  });

  it("shows first 5 pages when on page 1", () => {
    const result = calculatePageNumbers(1, 10);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("shows last 5 pages when on last page", () => {
    const result = calculatePageNumbers(10, 10);
    expect(result).toEqual([6, 7, 8, 9, 10]);
  });
});

describe("calculateTotalPages", () => {
  it("calculates pages correctly", () => {
    expect(calculateTotalPages(100, 10)).toBe(10);
    expect(calculateTotalPages(95, 10)).toBe(10);
    expect(calculateTotalPages(101, 10)).toBe(11);
  });

  it("returns at least 1 page for zero items", () => {
    expect(calculateTotalPages(0, 10)).toBe(1);
  });
});
