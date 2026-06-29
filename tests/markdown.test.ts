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
  it("escapes table delimiters in review order cells", () => {
    const brief: ReviewBrief = {
      title: "pipe path",
      totals: {
        files: 1,
        added: 1,
        removed: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 1
      },
      assessment: {
        status: "pass",
        reason: "No high-risk or medium-risk diff signals were detected."
      },
      files: [
        {
          path: "docs/agent|notes.md",
          added: 1,
          removed: 0,
          hunks: 1,
          isDeleted: false,
          isRenamed: false,
          risk: "low",
          reasons: []
        }
      ],
      reviewOrder: [
        {
          path: "docs/agent|notes.md",
          added: 1,
          removed: 0,
          hunks: 1,
          isDeleted: false,
          isRenamed: false,
          risk: "low",
          reasons: ["contains | in path"]
        }
      ],
      questions: []
    };

    const markdown = toMarkdown(brief);

    expect(markdown).toContain("| low | `docs/agent\\|notes.md` | +1/-0 | contains \\| in path |");
  });
});
