# CANON Index

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Master index of all CANON content -- standards, schemas, and templates that
define the framework's conventions and contracts.

---

## Summary

| Category  | Count  | Description                         |
| --------- | ------ | ----------------------------------- |
| Standards | 10     | Convention and rule documents       |
| Schemas   | 2      | TypeScript validation schemas (Zod) |
| Templates | 8      | Reusable document scaffolds         |
| **Total** | **20** | **CANON assets**                    |

---

## Standards

| #   | File                                                         | Description                                                | Status | Enforcement                    |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------- | ------ | ------------------------------ |
| 1   | [SKILL_STANDARDS.md](standards/SKILL_STANDARDS.md)           | Structural and quality standards for all `.claude/skills/` | ACTIVE | Pre-commit checks              |
| 2   | [AUDIT_STANDARD.md](standards/AUDIT_STANDARD.md)             | Audit methodology, taxonomy, severity scoring              | ACTIVE | Audit validation script        |
| 3   | [AGENT_STANDARD.md](standards/AGENT_STANDARD.md)             | Agent file structure, naming, return protocol              | ACTIVE | Code review                    |
| 4   | [HOOK_STANDARD.md](standards/HOOK_STANDARD.md)               | Hook events, registration, error handling                  | ACTIVE | settings.json registration     |
| 5   | [DOC_STANDARD.md](standards/DOC_STANDARD.md)                 | Document headers, categories, naming conventions           | ACTIVE | `scripts/check-doc-headers.js` |
| 6   | [NAMING_CONVENTIONS.md](standards/NAMING_CONVENTIONS.md)     | File and directory naming patterns                         | ACTIVE | ESLint rules, code review      |
| 7   | [RECOVERY_STANDARD.md](standards/RECOVERY_STANDARD.md)       | State persistence, compaction resilience, error recovery   | ACTIVE | Code review                    |
| 8   | [JSONL_STANDARD.md](standards/JSONL_STANDARD.md)             | JSONL format, base record, dual-write pattern              | ACTIVE | Schema validation              |
| 9   | [DEPENDENCY_STANDARD.md](standards/DEPENDENCY_STANDARD.md)   | Dependency registry, relationship types, auto-discovery    | ACTIVE | Registry validation            |
| 10  | [INTERACTION_STANDARD.md](standards/INTERACTION_STANDARD.md) | UX patterns, confirmation flows, interactive workflows     | ACTIVE | Code review                    |

---

## Schemas

| #   | File                                                             | Validates                                                 | Key Exports                                |
| --- | ---------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------ |
| 1   | [base-record.schema.ts](schemas/base-record.schema.ts)           | Universal base record for all JSONL files                 | `BaseRecordSchema`, `BaseRecord`           |
| 2   | [framework-config.schema.ts](schemas/framework-config.schema.ts) | Framework configuration (`settings.json`, project config) | `FrameworkConfigSchema`, `FrameworkConfig` |

---

## Templates

| #   | File                                                                 | Use When                                                | Category   |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| 1   | [AUDIT_TEMPLATE.md](templates/AUDIT_TEMPLATE.md)                     | Creating audit skill procedures                         | Canonical  |
| 2   | [CANONICAL.template.md](templates/CANONICAL.template.md)             | Creating canonical reference documents (like CLAUDE.md) | Canonical  |
| 3   | [FOUNDATION.template.md](templates/FOUNDATION.template.md)           | Creating standards or foundation documents              | Foundation |
| 4   | [PLANNING.template.md](templates/PLANNING.template.md)               | Creating roadmaps or phase plans                        | Planning   |
| 5   | [REFERENCE.template.md](templates/REFERENCE.template.md)             | Creating lookup-oriented reference documents            | Reference  |
| 6   | [GUIDE.template.md](templates/GUIDE.template.md)                     | Creating step-by-step how-to guides                     | Guide      |
| 7   | [JSONL_SCHEMA.template.md](templates/JSONL_SCHEMA.template.md)       | Documenting JSONL file schemas                          | Reference  |
| 8   | [PROJECT_GENESIS.template.md](templates/PROJECT_GENESIS.template.md) | Capturing project identity and foundational decisions   | Foundation |

---

## Version History

| Version | Date       | Description                                             |
| ------- | ---------- | ------------------------------------------------------- |
| 1.0     | 2026-03-02 | Initial index with 10 standards, 2 schemas, 8 templates |
