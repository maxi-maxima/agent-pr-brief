#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { briefFromDiffFile, briefFromGit, writeDemo } from "./runner.js";
import type { ReviewBrief } from "./types.js";

const program = new Command();

program
  .name("agent-pr-brief")
  .description("Generate deterministic review briefs for AI-agent pull requests.")
  .version("0.1.0");

program
  .command("from-diff")
  .argument("<file>", "unified diff file")
  .option("--title <title>", "brief title", "agent PR")
  .option("--out <dir>", "output directory", "reports/agent-pr-brief")
  .action(async (file: string, options: { title: string; out: string }) => {
    const brief = await briefFromDiffFile(file, { title: options.title, outDir: options.out });
    printSummary(brief);
    console.log(`Reports: ${options.out}`);
  });

program
  .command("from-git")
  .argument("[base]", "base branch or revision", "origin/main")
  .option("--title <title>", "brief title", "agent PR")
  .option("--out <dir>", "output directory", "reports/agent-pr-brief")
  .action(async (base: string, options: { title: string; out: string }) => {
    const brief = await briefFromGit(base, { title: options.title, outDir: options.out });
    printSummary(brief);
    console.log(`Reports: ${options.out}`);
  });

program.command("demo").option("--out <dir>", "output directory", "reports/demo").action(async (options: { out: string }) => {
  const brief = await writeDemo(options.out);
  printSummary(brief);
  console.log(`Demo diff: ${options.out}/agent.diff`);
  console.log(`Reports: ${options.out}`);
});

program.parse();

function printSummary(brief: ReviewBrief): void {
  const status = brief.totals.highRisk > 0 ? pc.red("HIGH") : brief.totals.mediumRisk > 0 ? pc.yellow("MEDIUM") : pc.green("LOW");
  console.log(`Agent PR Brief ${status}`);
  console.log(`Files: ${brief.totals.files}`);
  console.log(`Added: ${brief.totals.added}`);
  console.log(`Removed: ${brief.totals.removed}`);
  console.log(`High risk: ${brief.totals.highRisk}`);
  console.log(`Medium risk: ${brief.totals.mediumRisk}`);
}
