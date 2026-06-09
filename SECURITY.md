# Security

`agent-pr-brief` reads local git diffs and writes local reports. It does not send diffs to a remote service.

## Reporting Issues

Please report security issues privately if you find:

- arbitrary file writes outside the output directory
- command execution through crafted diff content
- unsafe handling of paths

Do not include real secrets in public issue reports.
