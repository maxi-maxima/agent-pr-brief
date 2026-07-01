import { describe, expect, it } from "vitest";
import { parseUnifiedDiff } from "../src/diff.js";

const sampleDiff = `diff --git a/src/auth.ts b/src/auth.ts
index 1111111..2222222 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -1,4 +1,6 @@
 export function login(token: string) {
-  return verify(token);
+  if (process.env.SKIP_AUTH=*** "1") return true;
+  return verify(token) && token.length > 10;
 }
diff --git a/README.md b/README.md
index 3333333..4444444 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,3 @@
 # App
+More docs.
`;

function diffFor(path: string, addedLines: string[]): string {
  return [
    `diff --git a/${path} b/${path}`,
    "index 0000000..1111111 100644",
    `--- a/${path}`,
    `+++ b/${path}`,
    "@@ -1,1 +1,3 @@",
    " context",
    ...addedLines.map((line) => `+${line}`)
  ].join("\n");
}

describe("parseUnifiedDiff", () => {
  it("extracts file stats and risk reasons from a unified diff", () => {
    const files = parseUnifiedDiff(sampleDiff);

    expect(files).toHaveLength(2);
    expect(files[0]).toMatchObject({
      path: "src/auth.ts",
      added: 2,
      removed: 1,
      hunks: 1,
      risk: "high"
    });
    expect(files[0].reasons).toContain("touches authentication-sensitive path");
    expect(files[0].reasons).toContain("changes environment-variable behavior");
    expect(files[1]).toMatchObject({
      path: "README.md",
      risk: "low"
    });
  });

  it("marks environment and container runtime files as medium risk", () => {
    const files = parseUnifiedDiff(`diff --git a/.env.example b/.env.example
index 1111111..2222222 100644
--- a/.env.example
+++ b/.env.example
@@ -1,2 +1,3 @@
 API_URL=https://example.com
+FEATURE_FLAG=true
diff --git a/docker-compose.yml b/docker-compose.yml
index 3333333..4444444 100644
--- a/docker-compose.yml
+++ b/docker-compose.yml
@@ -1,2 +1,3 @@
 services:
+  api:
`);

    expect(files[0]).toMatchObject({
      path: ".env.example",
      risk: "medium"
    });
    expect(files[0].reasons).toContain("touches environment file");
    expect(files[1]).toMatchObject({
      path: "docker-compose.yml",
      risk: "medium"
    });
    expect(files[1].reasons).toContain("touches container runtime config");
  });

  it("flags package lifecycle scripts even when JSON spacing differs", () => {
    const files = parseUnifiedDiff(
      diffFor("package.json", [
        "  {",
        "    \"scripts\": {",
        "      \"postinstall\" : \"node ./scripts/setup.js\"",
        "    }",
        "  }"
      ])
    );

    expect(files[0]?.risk).toBe("high");
    expect(files[0]?.reasons).toContain("adds package lifecycle script");
  });

  it("flags command execution aliases and node child-process imports", () => {
    const files = parseUnifiedDiff(
      diffFor("src/runner.ts", [
        "import { execFile as runCommand } from 'node:child_process';",
        "export function runTool(input: string) {",
        "  return runCommand(input, []);",
        "}"
      ])
    );

    expect(files[0]?.risk).toBe("high");
    expect(files[0]?.reasons).toContain("adds command execution surface");
  });
});
