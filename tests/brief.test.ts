import { describe, expect, it } from "vitest";
import { createBrief } from "../src/brief.js";

const diff = `diff --git a/package.json b/package.json
index 1111111..2222222 100644
--- a/package.json
+++ b/package.json
@@ -5,6 +5,7 @@
   "scripts": {
+    "postinstall": "node scripts/install.js",
     "test": "vitest run"
   }
diff --git a/src/app.ts b/src/app.ts
index 3333333..4444444 100644
--- a/src/app.ts
+++ b/src/app.ts
@@ -1,3 +1,4 @@
+console.log("boot");
 export const ok = true;
`;

describe("createBrief", () => {
  it("sorts review order by risk and generates reviewer questions", () => {
    const brief = createBrief("agent update", diff);

    expect(brief.totals).toMatchObject({
      files: 2,
      highRisk: 1,
      lowRisk: 1
    });
    expect(brief.reviewOrder[0].path).toBe("package.json");
    expect(brief.reviewOrder[0].reasons).toContain("adds package lifecycle script");
    expect(brief.questions).toContain("Do the package lifecycle scripts run only code that reviewers expect?");
    expect(brief.assessment).toEqual({
      status: "block",
      reason: "1 high-risk file requires focused human review before merge."
    });
  });

  it("marks medium-risk changes for review", () => {
    const brief = createBrief(
      "workflow update",
      `diff --git a/.github/workflows/test.yml b/.github/workflows/test.yml
index 1111111..2222222 100644
--- a/.github/workflows/test.yml
+++ b/.github/workflows/test.yml
@@ -1,2 +1,3 @@
 name: test
+permissions: read-all
`
    );

    expect(brief.assessment).toEqual({
      status: "review",
      reason: "1 medium-risk file should be reviewed before merge."
    });
  });

  it("uses plural grammar for multiple high-risk files", () => {
    const brief = createBrief(
      "security update",
      `diff --git a/package.json b/package.json
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
@@ -1,2 +1,3 @@
+const skip = process.env.SKIP_AUTH;
 export const ok = true;
`
    );

    expect(brief.assessment).toEqual({
      status: "block",
      reason: "2 high-risk files require focused human review before merge."
    });
  });

  it("passes routine low-risk changes", () => {
    const brief = createBrief(
      "docs update",
      `diff --git a/README.md b/README.md
index 1111111..2222222 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,3 @@
 # Demo
+More usage notes.
`
    );

    expect(brief.assessment).toEqual({
      status: "pass",
      reason: "No high-risk or medium-risk diff signals were detected."
    });
  });

  it("adds targeted questions for environment and container runtime changes", () => {
    const brief = createBrief(
      "runtime update",
      `diff --git a/.env.example b/.env.example
index 1111111..2222222 100644
--- a/.env.example
+++ b/.env.example
@@ -1,2 +1,3 @@
 API_URL=https://example.com
+FEATURE_FLAG=true
diff --git a/Dockerfile b/Dockerfile
index 3333333..4444444 100644
--- a/Dockerfile
+++ b/Dockerfile
@@ -1,2 +1,3 @@
 FROM node:20
+USER node
`
    );

    expect(brief.assessment).toEqual({
      status: "review",
      reason: "2 medium-risk files should be reviewed before merge."
    });
    expect(brief.questions).toContain("Do environment-file changes avoid committing secrets and preserve safe defaults?");
    expect(brief.questions).toContain(
      "Do container runtime changes preserve least privilege, health checks, and safe network exposure?"
    );
  });
});
