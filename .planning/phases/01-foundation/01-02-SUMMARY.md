---
phase: 01-foundation
plan: 02
subsystem: standards
tags: [canon, standards, audit, migration, skill-standards]

# Dependency graph
requires:
  - phase: none
    provides: existing _shared/ files to migrate
provides:
  - CANON/standards/SKILL_STANDARDS.md - canonical skill development standards
  - CANON/standards/AUDIT_STANDARD.md - audit methodology standard (10th CANON standard)
  - CANON/templates/AUDIT_TEMPLATE.md - audit report output template
  - Single source of truth for standards (no dual-source in _shared/)
affects: [01-03 through 01-10 plans that write new standards into CANON]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'CANON standard structure: Purpose, Scope, Requirements, Enforcement, Escape Hatches, Version History'
    - 'Standard header metadata: Document Version, Last Updated, Status'
    - 'RFC 2119 keywords (MUST/SHOULD/MAY) for requirement levels'

key-files:
  created:
    - CANON/standards/SKILL_STANDARDS.md
    - CANON/standards/AUDIT_STANDARD.md
    - CANON/templates/AUDIT_TEMPLATE.md
  modified:
    - .claude/skills/audit-ai-optimization/SKILL.md
    - .claude/skills/audit-code/SKILL.md
    - .claude/skills/audit-engineering-productivity/SKILL.md
    - .claude/skills/audit-enhancements/SKILL.md
    - .claude/skills/audit-performance/SKILL.md
    - .claude/skills/audit-process/SKILL.md
    - .claude/skills/audit-refactoring/SKILL.md
    - .claude/skills/audit-security/SKILL.md
    - .claude/skills/skill-creator/skill.md
    - docs/planning/DIAGNOSIS.md
    - .planning/phases/01-foundation/01-RESEARCH.md

key-decisions:
  - 'Migrated SKILL_STANDARDS.md as v1.0 in CANON (reset from v2.0 in _shared/) to mark fresh canonical location'
  - 'Created AUDIT_STANDARD.md as distinct from AUDIT_TEMPLATE.md: standard defines methodology, template provides report boilerplate'
  - 'Updated historical planning docs (DIAGNOSIS.md, 01-RESEARCH.md) to reflect migration -- avoids grep-based verification failures'
  - 'Added Enforcement and Escape Hatches sections to SKILL_STANDARDS.md per CANON standard structure'

patterns-established:
  - 'CANON standard canonical sections: Purpose, Scope, Requirements, Enforcement, Escape Hatches, Version History'
  - 'Audit severity scale: S0 (Blocker) through S4 (Informational) with scoring methodology'
  - 'Standards migration pattern: copy to CANON, update all references, delete originals, verify zero orphaned refs'

# Metrics
duration: 11min
completed: 2026-03-02
---

# Phase 1 Plan 2: Standards Migration Summary

**Migrated SKILL_STANDARDS and AUDIT_TEMPLATE to CANON, created AUDIT_STANDARD as 10th standard defining audit methodology with severity scale and scoring**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-02T23:18:53Z
- **Completed:** 2026-03-02T23:30:10Z
- **Tasks:** 2/2
- **Files modified:** 14 (3 created, 9 skill files updated, 2 planning docs updated, 2 originals deleted)

## Accomplishments

- Migrated SKILL_STANDARDS.md to CANON/standards/ with Enforcement and Escape Hatches sections added
- Migrated AUDIT_TEMPLATE.md to CANON/templates/ with updated self-reference path
- Created AUDIT_STANDARD.md (144 lines) as a proper methodology standard distinct from the template
- Updated 9 audit/skill files and 2 planning docs to reference CANON paths
- Deleted originals and removed empty \_shared/ directory
- Zero orphaned references remain in codebase

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Standards Files to CANON and Create AUDIT_STANDARD** - `ffbb665` (feat)
2. **Task 2: Update All References and Remove Originals** - `dc86d1b` (refactor)

## Files Created/Modified

- `CANON/standards/SKILL_STANDARDS.md` - Canonical skill development standards (315 lines, migrated from \_shared/)
- `CANON/standards/AUDIT_STANDARD.md` - Audit methodology standard: taxonomy, severity, scoring, JSONL output requirements (144 lines, new)
- `CANON/templates/AUDIT_TEMPLATE.md` - Audit report output template (209 lines, migrated from \_shared/)
- `.claude/skills/audit-*/SKILL.md` (7 files) - Updated AUDIT_TEMPLATE references to CANON path
- `.claude/skills/audit-ai-optimization/SKILL.md` - Updated both inline reference and Standard Audit Procedures block
- `.claude/skills/skill-creator/skill.md` - Updated SKILL_STANDARDS reference to CANON path
- `docs/planning/DIAGNOSIS.md` - Updated gap catalog to reflect completed migration
- `.planning/phases/01-foundation/01-RESEARCH.md` - Updated inventory table and open questions

## Decisions Made

1. **SKILL_STANDARDS version reset to 1.0** - The \_shared/ copy was v2.0, but the CANON copy starts at v1.0 to mark it as the first canonical version. Content is preserved.
2. **AUDIT_STANDARD vs AUDIT_TEMPLATE separation** - The standard defines audit methodology (taxonomy, severity levels, scoring, required components). The template provides report output boilerplate (evidence requirements, JSONL format, review procedures). This follows the pattern of separating "what must be done" from "how to format the output".
3. **Historical doc updates** - Updated DIAGNOSIS.md and 01-RESEARCH.md to reflect the migration, since the verification criteria requires zero \_shared/ references across all .md files.
4. **Shared Templates section updated** - In the migrated SKILL_STANDARDS.md, updated the "Shared Templates" section to reference CANON/templates/ instead of the old \_shared/ path, and removed the self-referencing row from the table.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

1. **Prettier formatting required** - All new and modified files needed Prettier formatting before the pre-commit hook would pass. Resolved by running `npx prettier --write` on all affected files before committing.
2. **lint-staged git backup failure** - The pre-commit hook's lint-staged step fails with "fatal: Needed a single revision" (a known issue on branches without merge-base). The fallback path in the hook checks if files pass Prettier directly, which they did after formatting.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- CANON directory structure is established with standards/ and templates/ subdirectories
- All subsequent plans that create new standards can place them directly in CANON/
- The AUDIT_STANDARD.md establishes the canonical standard structure (Purpose, Scope, Requirements, Enforcement, Escape Hatches, Version History) that other standards should follow
- No blockers for subsequent plans

---

_Phase: 01-foundation_
_Completed: 2026-03-02_
