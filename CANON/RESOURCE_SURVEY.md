# Resource Survey

**Evaluated:** 2026-03-02
**Scope:** Framework tooling only (consumer project recommendations deferred to Phase 9/v2)
**Source:** `CANON/RESOURCE_SURVEY.jsonl` (canonical)

> This file is generated from RESOURCE_SURVEY.jsonl. Do not edit directly.

## Summary

| Decision  | Count  |
| --------- | ------ |
| Adopt     | 3      |
| Defer     | 9      |
| Reject    | 8      |
| **Total** | **20** |

### By Category

| Category       | Adopt | Defer | Reject | Total |
| -------------- | ----- | ----- | ------ | ----- |
| ESLint Plugins | 1     | 3     | 0      | 4     |
| MCP Servers    | 0     | 1     | 3      | 4     |
| GitHub Actions | 2     | 2     | 0      | 4     |
| NPM Packages   | 0     | 2     | 2      | 4     |
| Other Tools    | 0     | 1     | 3      | 4     |

## ESLint Plugins

| Name                   | Decision  | Priority | Rationale                                                                                                                                  |
| ---------------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| eslint-plugin-security | **adopt** | high     | Already installed and configured. Complements custom framework rules with security-focused detection.                                      |
| eslint-plugin-n        | defer     | low      | Low marginal value -- typescript-eslint and custom rules cover most Node.js concerns. Reconsider when targeting multiple Node.js versions. |
| eslint-plugin-jsonc    | defer     | low      | Redundant with Prettier (formatting) + Zod (validation). Reconsider if JSON issues slip through.                                           |
| eslint-plugin-import-x | defer     | low      | Redundant with madge (circular deps) + knip (unused exports). Import ordering is cosmetic.                                                 |

## MCP Servers

| Name                | Decision | Priority | Rationale                                                                                                 |
| ------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------- |
| filesystem-mcp      | reject   | low      | Claude Code has native filesystem tools. MCP server would be redundant.                                   |
| git-mcp             | reject   | low      | Claude Code has native git access via Bash. Would add indirection.                                        |
| context7            | defer    | medium   | Could help with library docs beyond training cutoff. Reconsider when dependencies move to newer versions. |
| sequential-thinking | reject   | low      | Claude Opus has strong built-in reasoning. GSD provides structured workflow.                              |

## GitHub Actions

| Name                    | Decision  | Priority | Rationale                                                                                                    |
| ----------------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| actions/cache           | **adopt** | high     | Cache node_modules between CI runs. Standard practice, significant time savings with 9 workflows.            |
| dependabot              | **adopt** | high     | Automated dependency update PRs. Essential for long-lived projects with 10+ dependencies.                    |
| github/codeql-action    | defer     | medium   | Deep semantic security analysis. Deferred due to CI time overhead (5-15 min) and existing security coverage. |
| reviewdog/action-eslint | defer     | low      | Inline PR comments are incremental UX. Useful when multiple contributors exist.                              |

## NPM Packages

| Name              | Decision | Priority | Rationale                                                                         |
| ----------------- | -------- | -------- | --------------------------------------------------------------------------------- |
| syncpack          | reject   | low      | Single-package repo, not a monorepo. Syncpack solves cross-package version drift. |
| depcheck          | reject   | low      | Knip already provides more comprehensive unused dependency detection.             |
| license-checker   | defer    | low      | Important for compliance when distributed. Framework is currently private.        |
| npm-check-updates | defer    | low      | Redundant with dependabot for automated updates.                                  |

## Other Tools

| Name       | Decision | Priority | Rationale                                                                                       |
| ---------- | -------- | -------- | ----------------------------------------------------------------------------------------------- |
| commitlint | defer    | medium   | Framework already follows conventional commits via GSD. Formalize when human contributors join. |
| lefthook   | reject   | low      | Husky is already integrated. Switching adds migration cost with no functional benefit.          |
| changesets | reject   | low      | For published packages/monorepos. Framework is private, single-package. TDMS tracks changes.    |
| turbo      | reject   | low      | For monorepo task orchestration. Framework is single-package with adequate npm scripts.         |

## Adopt Plan

Resources marked for adoption and their implementation timeline:

### 1. eslint-plugin-security (already installed)

- **Status:** Already installed and configured in eslint.config.mjs
- **Action:** No further action needed. Verify coverage is maintained.

### 2. actions/cache

- **When:** Phase 5 (Quality Gates) or when CI optimization is addressed
- **Action:** Add cache step to CI workflows using `actions/cache@v4`
- **Config:** Cache `node_modules` with `hashFiles('**/package-lock.json')` as key

### 3. dependabot

- **When:** Phase 5 (Quality Gates) or Phase 7 (CI/CD)
- **Action:** Create `.github/dependabot.yml` with npm ecosystem, weekly schedule
- **Config:** Target `package.json` dependencies, group minor/patch updates

## Defer Triggers

Resources that may be reconsidered when conditions change:

| Resource                | Trigger for Reconsideration                              |
| ----------------------- | -------------------------------------------------------- |
| eslint-plugin-n         | Framework targets multiple Node.js LTS versions          |
| eslint-plugin-jsonc     | JSON/JSONL formatting issues escape Prettier + Zod       |
| eslint-plugin-import-x  | Import resolution bugs escape madge detection            |
| context7                | Dependencies move beyond Claude's training cutoff        |
| github/codeql-action    | Framework used in production with sensitive data         |
| reviewdog/action-eslint | 3+ regular contributors to the framework                 |
| license-checker         | Framework published as npm package or used in enterprise |
| npm-check-updates       | Dependabot removed or insufficient                       |
| commitlint              | Multiple human contributors making direct commits        |

---

_Generated from: CANON/RESOURCE_SURVEY.jsonl_
_Phase: 01-foundation_
_Evaluated: 2026-03-02_
