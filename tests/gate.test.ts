import { describe, expect, it } from "vitest";
import { parseFailOn, shouldFailAssessment } from "../src/gate.js";
import type { AssessmentStatus } from "../src/types.js";

describe("assessment gate", () => {
  it("parses fail-on modes for CI thresholds", () => {
    expect(parseFailOn(undefined)).toBe("never");
    expect(parseFailOn("never")).toBe("never");
    expect(parseFailOn("review")).toBe("review");
    expect(parseFailOn("block")).toBe("block");
    expect(() => parseFailOn("medium")).toThrow("Unsupported --fail-on mode");
  });

  it.each([
    ["never", "block", false],
    ["block", "review", false],
    ["block", "block", true],
    ["review", "pass", false],
    ["review", "review", true],
    ["review", "block", true]
  ] as const)("with --fail-on %s and %s assessment returns %s", (mode, status, expected) => {
    expect(shouldFailAssessment(status as AssessmentStatus, mode)).toBe(expected);
  });
});
