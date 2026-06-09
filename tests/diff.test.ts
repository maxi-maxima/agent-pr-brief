import { describe, expect, it } from "vitest";
import { parseUnifiedDiff } from "../src/diff.js";

const sampleDiff = `diff --git a/src/auth.ts b/src/auth.ts
index 1111111..2222222 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -1,4 +1,6 @@
 export function login(token: string) {
-  return verify(token);
+  if (process.env.SKIP_AUTH === "1") return true;
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
});
