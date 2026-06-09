import type { FileChange } from "./types.js";

export function parseUnifiedDiff(diff: string): FileChange[] {
  const files: MutableFileChange[] = [];
  let current: MutableFileChange | undefined;

  for (const line of diff.split(/\r?\n/)) {
    const fileMatch = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
    if (fileMatch) {
      current = {
        path: fileMatch[2],
        oldPath: fileMatch[1] === fileMatch[2] ? undefined : fileMatch[1],
        added: 0,
        removed: 0,
        hunks: 0,
        isDeleted: false,
        isRenamed: fileMatch[1] !== fileMatch[2],
        risk: "low",
        reasons: [],
        addedLines: []
      };
      files.push(current);
      continue;
    }

    if (!current) {
      continue;
    }

    if (line.startsWith("deleted file mode")) {
      current.isDeleted = true;
      current.reasons.push("deletes a file");
      continue;
    }

    if (line.startsWith("rename from ")) {
      current.oldPath = line.slice("rename from ".length).trim();
      current.isRenamed = true;
      continue;
    }

    if (line.startsWith("rename to ")) {
      current.path = line.slice("rename to ".length).trim();
      current.isRenamed = true;
      continue;
    }

    if (line.startsWith("@@")) {
      current.hunks += 1;
      continue;
    }

    if (line.startsWith("+++") || line.startsWith("---")) {
      continue;
    }

    if (line.startsWith("+")) {
      current.added += 1;
      current.addedLines.push(line.slice(1));
      continue;
    }

    if (line.startsWith("-")) {
      current.removed += 1;
    }
  }

  return files.map(finalizeRisk);
}

interface MutableFileChange extends FileChange {
  addedLines: string[];
}

function finalizeRisk(file: MutableFileChange): FileChange {
  const reasons = new Set(file.reasons);
  const path = file.path.toLowerCase();
  const addedText = file.addedLines.join("\n").toLowerCase();

  if (/(^|\/)(auth|login|session|permission|acl|rbac|oauth|jwt|token|security)(\/|\.|-|_)/.test(path)) {
    reasons.add("touches authentication-sensitive path");
  }

  if (/(package\.json|pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$/.test(path)) {
    reasons.add("changes dependency or package metadata");
  }

  if (path.includes("migration") || path.includes("schema") || path.includes("database")) {
    reasons.add("touches database or schema path");
  }

  if (path.includes(".github/workflows") || path.includes("ci") || path.includes("deploy")) {
    reasons.add("touches automation or deployment path");
  }

  if (/process\.env|import\.meta\.env|\benv\b/.test(addedText)) {
    reasons.add("changes environment-variable behavior");
  }

  if (/"(preinstall|install|postinstall|prepare|prepublish|prepack)"\s*:/.test(addedText)) {
    reasons.add("adds package lifecycle script");
  }

  if (/child_process|exec\(|spawn\(|eval\(|new function|curl |wget |powershell|bash -c/.test(addedText)) {
    reasons.add("adds command execution surface");
  }

  if (/skip_auth|disable_auth|bypass|allowall|allow_all|dangerously|insecure|verify\s*=\s*false/.test(addedText)) {
    reasons.add("contains risky bypass wording");
  }

  if (file.added + file.removed >= 200) {
    reasons.add("large file-level diff");
  }

  const reasonList = [...reasons];
  const highSignals = reasonList.filter((reason) =>
    [
      "touches authentication-sensitive path",
      "changes environment-variable behavior",
      "adds package lifecycle script",
      "adds command execution surface",
      "contains risky bypass wording"
    ].includes(reason)
  );
  const mediumSignals = reasonList.filter((reason) =>
    [
      "changes dependency or package metadata",
      "touches database or schema path",
      "touches automation or deployment path",
      "deletes a file",
      "large file-level diff"
    ].includes(reason)
  );

  const risk = highSignals.length > 0 ? "high" : mediumSignals.length > 0 ? "medium" : "low";

  return {
    path: file.path,
    oldPath: file.oldPath,
    added: file.added,
    removed: file.removed,
    hunks: file.hunks,
    isDeleted: file.isDeleted,
    isRenamed: file.isRenamed,
    risk,
    reasons: reasonList
  };
}
