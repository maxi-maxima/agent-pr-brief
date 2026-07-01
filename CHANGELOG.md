# Changelog

## 0.3.0

- Add `--fail-on never|review|block` for CI assessment gates.
- Keep report generation intact while returning exit code `1` when the selected risk threshold is reached.
- Refresh GitHub Actions pins to current runtime-compatible releases.
- Add `package:check` so local release checks match CI packaging validation.

## 0.2.0

- Add deterministic `assessment` output for CI and PR comment workflows.
- Classify briefs as `pass`, `review`, or `block` from the detected diff risk.
- Render the assessment status and reason in Markdown and CLI summaries.

## 0.1.0

- Initial public release.
- Parse unified git diffs.
- Score file-level review risk with deterministic heuristics.
- Generate JSON and Markdown review briefs.
- Include `from-diff`, `from-git`, and `demo` commands.
