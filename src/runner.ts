import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { createBrief } from "./brief.js";
import { toMarkdown } from "./markdown.js";
import type { ReviewBrief } from "./types.js";

const execFileAsync = promisify(execFile);

export interface WriteOptions {
  title: string;
  outDir: string;
}

export async function briefFromDiffFile(diffPath: string, options: WriteOptions): Promise<ReviewBrief> {
  const diff = await readFile(diffPath, "utf8");
  const brief = createBrief(options.title, diff);
  await writeBrief(brief, options.outDir);
  return brief;
}

export async function briefFromGit(base: string, options: WriteOptions): Promise<ReviewBrief> {
  const { stdout } = await execFileAsync("git", ["diff", `${base}...HEAD`], {
    maxBuffer: 20 * 1024 * 1024
  });
  const brief = createBrief(options.title, stdout);
  await writeBrief(brief, options.outDir);
  return brief;
}

export async function writeBrief(brief: ReviewBrief, outDir: string): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "agent-pr-brief.json"), `${JSON.stringify(brief, null, 2)}\n`, "utf8");
  await writeFile(path.join(outDir, "agent-pr-brief.md"), toMarkdown(brief), "utf8");
}

export async function writeDemo(outDir: string): Promise<ReviewBrief> {
  await mkdir(outDir, { recursive: true });
  const diffPath = path.join(outDir, "agent.diff");
  const diff = `diff --git a/package.json b/package.json
index 1111111..2222222 100644
--- a/package.json
+++ b/package.json
@@ -5,6 +5,7 @@
   "scripts": {
+    "postinstall": "node scripts/install.js",
     "test": "vitest run"
   }
diff --git a/src/auth/session.ts b/src/auth/session.ts
index 3333333..4444444 100644
--- a/src/auth/session.ts
+++ b/src/auth/session.ts
@@ -1,4 +1,6 @@
 export function canUseSession(token: string) {
-  return verify(token);
+  if (process.env.SKIP_AUTH === "1") return true;
+  return verify(token) && token.length > 10;
 }
diff --git a/README.md b/README.md
index 5555555..6666666 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,3 @@
 # Demo
+Documented the new agent behavior.
`;
  await writeFile(diffPath, diff, "utf8");
  const brief = createBrief("demo agent PR", diff);
  await writeBrief(brief, outDir);
  return brief;
}
