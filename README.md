<div align="center">

# Agent PR Brief

**Generate deterministic review briefs for AI-agent pull requests.**

[简体中文](README.zh-CN.md)

</div>

AI coding agents can produce a large, plausible pull request in minutes. That changes the review problem. The question is no longer "can someone write the code?" It is "where should the human reviewer look first?"

`agent-pr-brief` turns a git diff into a concise review route map:

- high-risk files first
- mechanical reasons for risk
- reviewer questions tied to the diff
- a deterministic `pass` / `review` / `block` assessment for CI gates
- JSON and Markdown output for CI or PR comments

No API keys. No LLM call. No telemetry.

## Why This Exists

Model-written summaries are useful, but they are not enough. They can miss boring mechanical facts:

- a `postinstall` script appeared in `package.json`
- auth code now reads a new environment variable
- a migration changed schema behavior
- a workflow or deploy file changed
- a large generated diff hides one sensitive file

Those signals are visible in the diff. They should be checked before a reviewer starts reading line by line.

## 30 Second Demo

```bash
npx github:maxi-maxima/agent-pr-brief demo
```

The demo writes:

```text
reports/demo/agent.diff
reports/demo/agent-pr-brief.json
reports/demo/agent-pr-brief.md
```

## Use With A Diff File

```bash
git diff origin/main...HEAD > /tmp/pr.diff
npx github:maxi-maxima/agent-pr-brief from-diff /tmp/pr.diff --title "agent update" --out reports/pr-brief
```

## Use In A Git Repo

```bash
npx github:maxi-maxima/agent-pr-brief from-git origin/main --title "agent update" --out reports/pr-brief
```

## Example Output

```text
Agent PR Brief HIGH
Files: 3
Added: 5
Removed: 1
High risk: 2
Medium risk: 0
Assessment: BLOCK - 2 high-risk files require focused human review before merge.
Reports: reports/demo
```

Markdown includes:

- assessment status and reason
- totals
- sorted review order
- file-level risk reasons
- reviewer questions

## Assessment Gate

Every JSON and Markdown brief includes an assessment that automation can consume:

| Status | Meaning |
| --- | --- |
| `block` | At least one high-risk file was detected. Review before merge. |
| `review` | Medium-risk files or a very large routine diff were detected. Review before merge. |
| `pass` | No high-risk or medium-risk diff signals were detected. |

The assessment is deterministic and conservative. It does not approve a PR; it tells CI, bots, and reviewers how much attention the diff should receive.

## Risk Signals

| Signal | Risk |
| --- | --- |
| Authentication, session, permission, OAuth, JWT, token paths | high |
| Environment-variable behavior | high |
| Package lifecycle scripts such as `postinstall` | high |
| Command execution surfaces | high |
| Risky bypass wording | high |
| Environment files such as `.env.example` | medium |
| Container runtime config such as `Dockerfile` and `docker-compose.yml` | medium |
| Dependency/package metadata | medium |
| Database/schema paths | medium |
| CI/deploy/workflow paths | medium |
| Deleted files or very large file diffs | medium |

## Commands

```bash
agent-pr-brief demo [--out reports/demo]
agent-pr-brief from-diff <file> [--title "agent PR"] [--out reports/agent-pr-brief]
agent-pr-brief from-git [base] [--title "agent PR"] [--out reports/agent-pr-brief]
```

## What It Is Not

This tool does not approve code, replace tests, or tell you whether a PR is correct. It gives reviewers a deterministic starting point before they read the patch.

## Development

```bash
npm install
npm run check
node dist/cli.js demo --out reports/demo
npm pack --dry-run --ignore-scripts
```

## License

MIT
