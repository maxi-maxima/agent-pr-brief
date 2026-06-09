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
  });
});
