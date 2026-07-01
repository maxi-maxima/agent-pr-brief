#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { parseFailOn, shouldFailAssessment, type FailOnMode } from "./gate.js";
import { briefFromDiffFile, briefFromGit, writeDemo } from "./runner.js";
import type { ReviewBrief } from "./types.js";

const program = new Command();

program
  .name("agent-pr-brief")
  .description("Generate deterministic review briefs for AI-agent pull requests.")
  .version("0.3.0");

program
  .command("from-diff")
  .argument("<file>", "unified diff file")
  .option("--title <title>", "brief title", "agent PR")
  .option("--out <dir>", "output directory", "reports/agent-pr-brief")
  .option("--fail-on <mode>", "exit with code 1 for assessment threshold: never, review, or block", "never")
  .action(async (file: string, options: { title: string; out: string; failOn: string }) => {
    const failOn = parseFailOn(options.failOn);
    const brief = await briefFromDiffFile(file, { title: options.title, outDir: options.out });
    printSummary(brief);
    console.log(`Reports: ${options.out}`);
    applyGate(brief, failOn);
  });

program
  .command("from-git")
  .argument("[base]", "base branch or revision", "origin/main")
  .option("--title <title>", "brief title", "agent PR")
  .option("--out <dir>", "output directory", "reports/agent-pr-brief")
  .option("--fail-on <mode>", "exit with code 1 for assessment threshold: never, review, or block", "never")
  .action(async (base: string, options: { title: string; out: string; failOn: string }) => {
    const failOn = parseFailOn(options.failOn);
    const brief = await briefFromGit(base, { title: options.title, outDir: options.out });
    printSummary(brief);
    console.log(`Reports: ${options.out}`);
    applyGate(brief, failOn);
  });

program
  .command("demo")
  .option("--out <dir>", "output directory", "reports/demo")
  .option("--fail-on <mode>", "exit with code 1 for assessment threshold: never, review, or block", "never")
  .action(async (options: { out: string; failOn: string }) => {
    const failOn = parseFailOn(options.failOn);
    const brief = await writeDemo(options.out);
    printSummary(brief);
    console.log(`Demo diff: ${options.out}/agent.diff`);
    console.log(`Reports: ${options.out}`);
    applyGate(brief, failOn);
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
  console.log(`Assessment: ${brief.assessment.status.toUpperCase()} - ${brief.assessment.reason}`);
}

function applyGate(brief: ReviewBrief, failOn: FailOnMode): void {
  if (!shouldFailAssessment(brief.assessment.status, failOn)) {
    return;
  }
  console.error(`Failing because assessment is ${brief.assessment.status} and --fail-on is ${failOn}.`);
  process.exitCode = 1;
}
