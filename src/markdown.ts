import type { ReviewBrief } from "./types.js";

export function toMarkdown(brief: ReviewBrief): string {
  const lines: string[] = [
    `# Agent PR Brief: ${brief.title}`,
    "",
    "| Files | Added | Removed | High | Medium | Low |",
    "| ---: | ---: | ---: | ---: | ---: | ---: |",
    `| ${brief.totals.files} | ${brief.totals.added} | ${brief.totals.removed} | ${brief.totals.highRisk} | ${brief.totals.mediumRisk} | ${brief.totals.lowRisk} |`,
    "",
    "## Review Order",
    "",
    "| Risk | File | +/- | Reasons |",
    "| --- | --- | ---: | --- |"
  ];

  for (const file of brief.reviewOrder) {
    lines.push(
      `| ${file.risk} | \`${file.path}\` | +${file.added}/-${file.removed} | ${file.reasons.length ? file.reasons.join("<br>") : "routine diff"} |`
    );
  }

  lines.push("");
  lines.push("## Reviewer Questions");
  lines.push("");

  for (const question of brief.questions) {
    lines.push(`- ${question}`);
  }

  lines.push("");
  lines.push("## Files");
  lines.push("");

  for (const file of brief.files) {
    lines.push(`### ${file.path}`);
    lines.push("");
    lines.push(`- Risk: ${file.risk}`);
    lines.push(`- Added: ${file.added}`);
    lines.push(`- Removed: ${file.removed}`);
    lines.push(`- Hunks: ${file.hunks}`);
    if (file.oldPath) {
      lines.push(`- Previous path: \`${file.oldPath}\``);
    }
    if (file.reasons.length > 0) {
      lines.push(`- Reasons: ${file.reasons.join("; ")}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
