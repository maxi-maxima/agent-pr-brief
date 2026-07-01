import type { AssessmentStatus } from "./types.js";

export type FailOnMode = "never" | "review" | "block";

export function parseFailOn(value: string | undefined): FailOnMode {
  if (value === undefined || value === "never") {
    return "never";
  }
  if (value === "review" || value === "block") {
    return value;
  }
  throw new Error(`Unsupported --fail-on mode: ${value}. Use never, review, or block.`);
}

export function shouldFailAssessment(status: AssessmentStatus, mode: FailOnMode): boolean {
  if (mode === "never") {
    return false;
  }
  if (mode === "block") {
    return status === "block";
  }
  return status === "review" || status === "block";
}
