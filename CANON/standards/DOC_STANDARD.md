# Doc Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines document header requirements, categorization, naming, and structural
conventions for all Markdown documents in the framework project.

---

## Purpose

Establish consistent document metadata and structure so that documents are
discoverable, datable, and machine-verifiable. Every document should declare
its version, status, and last update date so that readers can assess currency
and automation can enforce standards.

---

## Scope

This standard applies to:

- All Markdown files (`.md`) in the repository except exempted patterns
- Document headers validated by `scripts/check-doc-headers.js`
- Document templates in `CANON/templates/`

This standard does NOT apply to:

- `README.md`, `CHANGELOG.md`, `LICENSE.md` (exempted by convention)
- Files under `node_modules/`, `.next/`, `coverage/`, `dist/`, `.git/`
- `DOCUMENTATION_INDEX.md` (auto-generated)
- Files under `archive/` directories
- `package-lock.json`

The full exemption list is configured in
`scripts/config/doc-header-config.json`.

---

## Requirements

### Required Headers

Every non-exempt Markdown document MUST include these metadata headers within
the first 20 lines of the file:

1. **Document Version** -- MUST be present as
   `**Document Version:** X.Y` or `**Version:** X.Y`.
2. **Last Updated** -- MUST be present as
   `**Last Updated:** YYYY-MM-DD` or `**Updated:** YYYY-MM-DD`.
3. **Status** -- MUST be present as `**Status:** VALUE` where VALUE is one of:
   `ACTIVE`, `DRAFT`, `DEPRECATED`, `ARCHIVED`.

These headers MAY be wrapped in `<!-- prettier-ignore-start -->` /
`<!-- prettier-ignore-end -->` comments to prevent Prettier from reformatting
them.

### Recommended Headers

4. Documents SHOULD include a `**Related:**` or `**See Also:**` header linking
   to related documents.
5. Documents SHOULD include a `**Purpose:**` line or a Purpose heading section.

### Document Categories

Documents fall into these categories, each with naming conventions:

| Category   | Naming Pattern            | Examples                                  |
| ---------- | ------------------------- | ----------------------------------------- |
| Canonical  | `UPPERCASE_SNAKE_CASE.md` | `SKILL_STANDARDS.md`, `AUDIT_STANDARD.md` |
| Foundation | `UPPERCASE_SNAKE_CASE.md` | `CLAUDE.md`, `ROADMAP.md`                 |
| Planning   | `UPPERCASE_SNAKE_CASE.md` | `PROJECT.md`, `REQUIREMENTS.md`           |
| Reference  | `UPPERCASE_SNAKE_CASE.md` | `REFERENCE.md`, `ARCHITECTURE.md`         |
| Guide      | `lowercase-kebab-case.md` | `getting-started.md`, `setup.md`          |
| Template   | `UPPERCASE.template.md`   | `CANONICAL.template.md`                   |

6. Standard documents MUST use `UPPERCASE_SNAKE_CASE` naming.
7. Guide documents SHOULD use `lowercase-kebab-case` naming.
8. Template documents MUST use `UPPERCASE` naming with `.template.md` suffix.

### Structural Requirements

9. Every standard document MUST include these sections: Purpose, Scope,
   Requirements, Enforcement, Escape Hatches, Version History.
10. Every document with requirements MUST use RFC 2119 keywords (MUST, SHOULD,
    MAY) to distinguish mandatory from optional rules.
11. Every document MUST end with a Version History table.

### Version History Table

12. The Version History table MUST follow this format:

```markdown
## Version History

| Version | Date       | Description            |
| ------- | ---------- | ---------------------- |
| 1.0     | YYYY-MM-DD | Initial implementation |
```

13. Version numbers MUST use semantic versioning (MAJOR.MINOR).
14. Each version entry MUST include the date of the change.

### Content Guidelines

15. Documents SHOULD be concise -- prefer rules over prose.
16. Documents MUST NOT exceed 500 lines without compelling justification.
17. Documents SHOULD use tables for structured data rather than nested lists.
18. Code examples MUST use fenced code blocks with language identifiers.

---

## Enforcement

| Mechanism                               | Status  | Description                                     |
| --------------------------------------- | ------- | ----------------------------------------------- |
| `scripts/check-doc-headers.js`          | Current | Validates required headers on all .md files     |
| `scripts/config/doc-header-config.json` | Current | Configures exempt patterns and required headers |
| Pre-commit hook                         | Current | Runs header check on staged .md files           |
| ESLint rule                             | Future  | Optional: lint markdown structure               |

**Current enforcement:** `scripts/check-doc-headers.js` validates required
headers using patterns defined in `scripts/config/doc-header-config.json`.
Runs as part of the documentation validation pipeline.

---

## Escape Hatches

- **Exempt patterns:** Files matching patterns in
  `doc-header-config.json#exemptPatterns` are excluded from header validation.
  Add new exemptions with a comment in the config explaining why.
- **Draft documents:** Documents with `**Status:** DRAFT` are validated for
  header presence but MAY have incomplete sections. Drafts MUST be promoted
  to ACTIVE or removed within 30 days.
- **Generated documents:** Auto-generated files (e.g., `DOCUMENTATION_INDEX.md`)
  are exempt from manual header requirements.

---

## Version History

| Version | Date       | Description                                           |
| ------- | ---------- | ----------------------------------------------------- |
| 1.0     | 2026-03-02 | Initial standard from doc-header-config.json patterns |
