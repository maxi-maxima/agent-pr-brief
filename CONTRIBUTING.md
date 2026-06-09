# Contributing

Thanks for improving Agent PR Brief.

## Local Setup

```bash
npm install
npm run check
```

## Development Rules

- Keep the scoring deterministic.
- Do not add LLM calls to core analysis.
- Add tests when changing risk rules or Markdown output.
- Prefer simple, explainable rules over hidden scoring.

## Pull Requests

Please include:

- the risk signal being added or changed
- sample diff input
- verification output from `npm run check`
