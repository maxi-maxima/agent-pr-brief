import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { writeDemo } from "../src/runner.js";

describe("writeDemo", () => {
  it("writes a sample diff plus JSON and Markdown briefs", async () => {
    const out = await mkdtemp(path.join(os.tmpdir(), "agent-pr-brief-"));

    const brief = await writeDemo(out);

    expect(brief.totals.highRisk).toBeGreaterThan(0);
    await expect(readFile(path.join(out, "agent.diff"), "utf8")).resolves.toContain("SKIP_AUTH");
    await expect(readFile(path.join(out, "agent-pr-brief.json"), "utf8")).resolves.toContain("demo agent PR");
    await expect(readFile(path.join(out, "agent-pr-brief.md"), "utf8")).resolves.toContain("Review Order");
  });
});
