# Agent PR Brief Design

## Problem

AI coding agents can produce large, plausible pull requests quickly. Human reviewers still need to know where to look first. A model-generated summary is useful, but it can miss mechanical risk signals that are visible in the diff itself.

## Scope

`agent-pr-brief` is a local deterministic CLI. It parses unified git diffs, scores files with simple risk heuristics, and writes a review brief that tells a human where to start and what to ask.

It does not call an LLM, approve code, or replace tests.

## Commands

- `from-diff <file>`: read a unified diff file and write Markdown/JSON brief output.
- `from-git [base]`: run `git diff <base>...HEAD` in the current repository.
- `demo`: generate a sample agent-style diff and brief.

## Verification

The release gate is `npm run check`, demo generation, and `npm pack --dry-run --ignore-scripts`.
