import type { ReviewBrief } from "./types.js";

export function toMarkdown(brief: ReviewBrief): string {
  const lines: string[] = [
    `# Agent PR Brief: ${brief.title}`,
    "",
    "## Assessment",
    "",
    `**${brief.assessment.status.toUpperCase()}**: ${brief.assessment.reason}`,
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
      `| ${file.risk} | \`${escapeMarkdownTableCell(file.path)}\` | +${file.added}/-${file.removed} | ${formatReasons(file.reasons)} |`
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

function formatReasons(reasons: string[]): string {
  if (reasons.length === 0) {
    return "routine diff";
  }

  return reasons.map(escapeMarkdownTableCell).join("<br>");
}

function escapeMarkdownTableCell(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(new RegExp(String.fromCharCode(13), "g"), " ").replace(new RegExp(String.fromCharCode(10), "g"), " ");
}
