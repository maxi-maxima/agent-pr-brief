# Research Notes

This project was selected after avoiding overlap with the user's existing public-launch repos:

- `mcp-fire-drill`: MCP and agent security drills
- `context-cal`: agent context budget auditing
- `screenlint`: rendered UI checking
- `mcp-flightcheck`: MCP server contract checks
- `webmcp-formkit`: WebMCP form metadata migration

The current opportunity is review load. AI coding agents increase implementation speed, but also produce larger patches that can look coherent while hiding risky mechanical changes. GitHub has been publishing guidance around reviewing agent-generated pull requests, and many teams are moving toward agent-assisted review workflows. A small deterministic tool can fit before model-based review: it tells the human where to look first.

The design bet is that boring diff facts are valuable:

- path sensitivity
- lifecycle scripts
- environment variables
- command execution
- schema and deployment changes
- unusually large files

This is intentionally not an AI reviewer. It is a pre-review brief.

Useful current references:

- https://github.blog/ai-and-ml/github-copilot/how-to-review-ai-generated-code-and-pull-requests/
- https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review
- https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request
