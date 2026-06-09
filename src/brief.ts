import type { ReviewBrief } from "./types.js";
import { parseUnifiedDiff } from "./diff.js";

export function createBrief(title: string, diff: string): ReviewBrief {
  const files = parseUnifiedDiff(diff);
  const reviewOrder = [...files].sort((a, b) => {
    const riskDelta = riskWeight(b.risk) - riskWeight(a.risk);
    if (riskDelta !== 0) {
      return riskDelta;
    }
    return b.added + b.removed - (a.added + a.removed);
  });

  return {
    title,
    files,
    totals: {
      files: files.length,
      added: files.reduce((sum, file) => sum + file.added, 0),
      removed: files.reduce((sum, file) => sum + file.removed, 0),
      highRisk: files.filter((file) => file.risk === "high").length,
      mediumRisk: files.filter((file) => file.risk === "medium").length,
      lowRisk: files.filter((file) => file.risk === "low").length
    },
    reviewOrder,
    questions: buildQuestions(files)
  };
}

function riskWeight(risk: string): number {
  if (risk === "high") {
    return 3;
  }
  if (risk === "medium") {
    return 2;
  }
  return 1;
}

function buildQuestions(files: ReturnType<typeof parseUnifiedDiff>): string[] {
  const reasons = new Set(files.flatMap((file) => file.reasons));
  const questions: string[] = [];

  if (reasons.has("touches authentication-sensitive path")) {
    questions.push("Does the authentication or authorization behavior still fail closed?");
  }

  if (reasons.has("changes environment-variable behavior")) {
    questions.push("Are the new environment-variable defaults safe in production and CI?");
  }

  if (reasons.has("adds package lifecycle script")) {
    questions.push("Do the package lifecycle scripts run only code that reviewers expect?");
  }

  if (reasons.has("adds command execution surface")) {
    questions.push("Can any user-controlled input reach the new command execution surface?");
  }

  if (reasons.has("changes dependency or package metadata")) {
    questions.push("Are dependency and package-script changes necessary for this PR?");
  }

  if (reasons.has("touches database or schema path")) {
    questions.push("Is there a rollback path for database or schema changes?");
  }

  if (questions.length === 0 && files.length > 0) {
    questions.push("Do the tests cover the changed behavior, not just the generated implementation?");
  }

  return questions;
}
