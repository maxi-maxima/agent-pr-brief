import { describe, expect, it } from "vitest";
import { toMarkdown } from "../src/markdown.js";
import type { ReviewBrief } from "../src/types.js";

describe("toMarkdown", () => {
  it("renders a concise reviewer brief", () => {
    const brief: ReviewBrief = {
      title: "agent update",
      totals: {
        files: 1,
        added: 3,
        removed: 1,
        highRisk: 1,
        mediumRisk: 0,
        lowRisk: 0
      },
      assessment: {
        status: "block",
        reason: "1 high-risk file requires focused human review before merge."
      },
      files: [
        {
          path: "src/auth.ts",
          added: 3,
          removed: 1,
          hunks: 1,
          isDeleted: false,
          isRenamed: false,
          risk: "high",
          reasons: ["touches authentication-sensitive path"]
        }
      ],
      reviewOrder: [
        {
          path: "src/auth.ts",
          added: 3,
          removed: 1,
          hunks: 1,
          isDeleted: false,
          isRenamed: false,
          risk: "high",
          reasons: ["touches authentication-sensitive path"]
        }
      ],
      questions: ["Does the authentication behavior still fail closed?"]
    };

    const markdown = toMarkdown(brief);

    expect(markdown).toContain("# Agent PR Brief: agent update");
    expect(markdown).toContain("## Assessment");
    expect(markdown).toContain("**BLOCK**: 1 high-risk file requires focused human review before merge.");
    expect(markdown).toContain("| Files | Added | Removed | High | Medium | Low |");
    expect(markdown).toContain("src/auth.ts");
    expect(markdown).toContain("Does the authentication behavior still fail closed?");
  });
});
