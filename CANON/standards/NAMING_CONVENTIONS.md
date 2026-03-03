# Naming Conventions

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines naming patterns for all file types, directories, and identifiers in the
framework project. Consistent naming enables automation, discovery, and
predictable structure.

---

## Purpose

Provide a single reference for naming patterns across the entire framework.
Without consistent naming, automation scripts (validation, dependency tracing,
ecosystem audits) cannot reliably discover and process project artifacts.

---

## Scope

This standard applies to:

- All files and directories in the repository
- Environment variable names
- JSONL record field names
- Script and configuration file identifiers

This standard does NOT apply to:

- Third-party files in `node_modules/`
- Generated files in `dist/`, `coverage/`, `.next/`
- Git-internal files in `.git/`

---

## Requirements

### File Naming by Type

Every file MUST follow the naming pattern for its type:

| File Type      | Pattern                | Extension      | Examples                                      |
| -------------- | ---------------------- | -------------- | --------------------------------------------- |
| Skills         | `lowercase-kebab-case` | directory      | `code-review/`, `skill-creator/`              |
| Skill files    | `SKILL.md`             | `.md`          | `.claude/skills/code-review/SKILL.md`         |
| Agents         | `lowercase-kebab-case` | `.md`          | `code-reviewer.md`, `debugger.md`             |
| Hooks          | `lowercase-kebab-case` | `.js`          | `session-start.js`, `block-push-to-main.js`   |
| Hook libraries | `lowercase-kebab-case` | `.js`          | `git-utils.js`, `sanitize-input.js`           |
| Scripts        | `lowercase-kebab-case` | `.js`          | `trace-dependencies.js`, `validate-skills.js` |
| Config files   | `lowercase-kebab-case` | `.json`        | `doc-header-config.json`, `audit-schema.json` |
| Standards      | `UPPERCASE_SNAKE_CASE` | `.md`          | `SKILL_STANDARDS.md`, `HOOK_STANDARD.md`      |
| Templates      | `UPPERCASE`            | `.template.md` | `CANONICAL.template.md`, `GUIDE.template.md`  |
| JSONL data     | `UPPERCASE_SNAKE_CASE` | `.jsonl`       | `MASTER_DEBT.jsonl`, `DEPENDENCY_GRAPH.jsonl` |
| Zod schemas    | `lowercase-kebab-case` | `.schema.ts`   | `framework-config.schema.ts`                  |
| ESLint rules   | `lowercase-kebab-case` | `.js`          | `no-unsafe-error-access.js`                   |
| Workflows      | `lowercase-kebab-case` | `.yml`         | `ci.yml`, `dependency-check.yml`              |

1. Files MUST use the exact pattern specified for their type.
2. File extensions MUST match the specified extension for the type.
3. New file types SHOULD follow the closest existing pattern.

### Directory Naming

4. Directories MUST use `lowercase-kebab-case`.
5. Directory names MUST NOT contain dots (except hidden directories like
   `.claude/`, `.github/`, `.husky/`).
6. Special directories MAY use underscore prefix for sorting purposes
   (e.g., `_shared/`) but this pattern is DEPRECATED in favor of `CANON/`.

### Identifier Naming

7. Environment variables MUST use `UPPER_SNAKE_CASE`
   (e.g., `SKIP_CHECKS`, `CLAUDE_PROJECT_DIR`, `SKIP_REASON`).
8. JSONL record fields MUST use `camelCase`
   (e.g., `sessionId`, `createdAt`, `findingType`).
9. JavaScript/TypeScript variables and functions MUST use `camelCase`.
10. JavaScript/TypeScript classes and constructors MUST use `PascalCase`.
11. JavaScript/TypeScript constants MAY use `UPPER_SNAKE_CASE` for
    module-level immutable values.

### Compound Name Rules

12. Multi-word names MUST use the separator specified by their pattern
    (hyphens for kebab-case, underscores for snake_case).
13. Abbreviations in kebab-case names MUST be lowercase
    (e.g., `mcp-servers`, not `MCP-servers`).
14. Abbreviations in UPPER_SNAKE_CASE names MUST be uppercase
    (e.g., `MCP_SERVERS`, not `Mcp_Servers`).

### Consistency Rules

15. Related files SHOULD share a common prefix
    (e.g., `audit-schema.json`, `audit-report.jsonl`).
16. Paired files MUST use matching base names
    (e.g., `MASTER_DEBT.jsonl` and `MASTER_DEBT.md` for source and view).
17. Test files MUST mirror the source file name with `.test` or `.spec` suffix
    (e.g., `safe-fs.test.js` for `safe-fs.js`).

---

## Enforcement

| Mechanism            | Status  | Description                                    |
| -------------------- | ------- | ---------------------------------------------- |
| ESLint custom rule   | Planned | `framework/enforce-file-naming` in plugin      |
| Naming check script  | Phase 4 | `scripts/check-naming.js` validates file names |
| Ecosystem audit      | Current | `skill-ecosystem-audit` checks skill naming    |
| `validate-skills.js` | Current | Validates skill directory and file names       |

**Current enforcement:** Skill naming validated by `scripts/validate-skills.js`.
**Planned enforcement:** General naming validation script (Phase 4) and ESLint
rule for the plugin.

---

## Escape Hatches

- **Third-party conventions:** Files that must match external tool expectations
  (e.g., `.prettierrc`, `eslint.config.mjs`) MAY deviate from naming patterns.
  These are documented as known exceptions, not violations.
- **Legacy files:** Existing files that predate this standard MAY retain their
  current names until their next major modification. Track as technical debt.
- **Platform requirements:** Files required by platforms (e.g., `Dockerfile`,
  `Makefile`) follow platform conventions, not this standard.

---

## Version History

| Version | Date       | Description                                      |
| ------- | ---------- | ------------------------------------------------ |
| 1.0     | 2026-03-02 | Initial standard from existing codebase patterns |
