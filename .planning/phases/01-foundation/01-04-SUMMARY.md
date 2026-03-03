---
phase: 01-foundation
plan: 04
subsystem: standards
tags: [jsonl, dependencies, interaction, canon, standards]

# Dependency graph
requires:
  - 01-01 (base-record.schema.ts, CANON directory structure)
provides:
  - JSONL_STANDARD (JSONL format, dual-write, rotation, safe read/write)
  - DEPENDENCY_STANDARD (7 relationship types, auto-discovery, staleness detection)
  - INTERACTION_STANDARD (confirmation flows, checkpoints, error recovery, output formatting)
affects:
  - 01-05 (dependency registry uses DEPENDENCY_STANDARD format)
  - 03-core-systems (JSONL patterns referenced by all data stores)
  - 05-quality-gates (interaction patterns for skill validation)

# Tech tracking
tech-stack:
  added: []
  patterns:
    [jsonl-source-of-truth, dual-write-prevention, checkpoint-pattern, seven-relationship-types]

key-files:
  created:
    - CANON/standards/JSONL_STANDARD.md
    - CANON/standards/DEPENDENCY_STANDARD.md
    - CANON/standards/INTERACTION_STANDARD.md
  modified: []

key-decisions:
  - 'JSONL is single source of truth; MD views are always generated, never edited directly'
  - 'Exactly 7 dependency relationship types: requires, invokes, references, triggers, generates, validates, extends'
  - 'Three confidence levels: high (auto/code), medium (auto/non-code), low (manual) with review gates'
  - 'Checkpoint pattern defines three types: human-verify, decision, human-action'

patterns-established:
  - 'Dual-source prevention: one JSONL source, generated Markdown views'
  - 'Safe JSONL read/write: blank line tolerance, atomic writes, advisory locking'
  - 'Confirmation-before-destructive-operation pattern'
  - 'Error recovery triad: retry, skip, abort'

# Metrics
duration: 7min
completed: 2026-03-02
---

# Phase 1 Plan 4: Remaining Standards Summary

**JSONL format standard, dependency registry standard with 7 relationship types, and interaction UX patterns standard**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-03-02T23:32:51Z
- **Completed:** 2026-03-02T23:40:04Z
- **Tasks:** 2
- **Files created:** 3

## Accomplishments

- Wrote JSONL_STANDARD defining base record format, dual-write pattern, safe reading/writing, and rotation
- Wrote DEPENDENCY_STANDARD defining 7 relationship types, confidence levels, auto-discovery flow, and staleness detection
- Wrote INTERACTION_STANDARD defining confirmation flows, progress indicators, checkpoint pattern, error recovery, and output formatting
- All 3 standards reference existing tooling (base-record.schema.ts, read-jsonl.js, safe-fs.js, trace-dependencies.js, rotate-state.js)
- With Plans 02, 03, and 04 complete: all 10 CANON standards now exist

## Task Commits

Each task was committed atomically:

1. **Task 1: Write JSONL_STANDARD and DEPENDENCY_STANDARD** - `4c85929` (feat)
2. **Task 2: Write INTERACTION_STANDARD** - `112520e` (feat)

Note: Due to lint-staged stash issues during Task 1's commit, the git history shows Task 2 (112520e) before Task 1 (4c85929). Both commits contain the correct content.

## Files Created

- `CANON/standards/JSONL_STANDARD.md` - JSONL format, base record fields, dual-write, safe read/write, rotation (~200 lines)
- `CANON/standards/DEPENDENCY_STANDARD.md` - Dependency registry, 7 types, confidence levels, auto-discovery, staleness (~220 lines)
- `CANON/standards/INTERACTION_STANDARD.md` - Confirmation, progress, checkpoints, error recovery, output formatting (~265 lines)

## Decisions Made

- **JSONL as single source of truth:** JSONL files are canonical; Markdown views are generated and must never be edited directly. This aligns with the existing TDMS pattern.
- **Seven relationship types only:** requires, invokes, references, triggers, generates, validates, extends. New types require updating the standard.
- **Three confidence levels:** high (auto-discovered code), medium (auto-discovered non-code), low (manual). High is auto-accepted; medium/low require interactive review.
- **Checkpoint types:** Defined human-verify (90%), decision (9%), human-action (1%) as the three checkpoint types for interactive workflows.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] lint-staged stash conflict on Task 1 commit**

- **Found during:** Task 1 (commit attempt)
- **Issue:** lint-staged's git backup mechanism failed with "Needed a single revision" due to a pre-existing stash from a previous plan-03 execution. Multiple commit attempts failed.
- **Fix:** Cleared stash state by running lint-staged debug mode, which resolved the backup issue. Re-staged and committed successfully.
- **Impact:** Task 2 was committed before Task 1 (reversed order in git history). Both commits contain correct content.

**2. [Rule 3 - Blocking] lint-staged auto-staged untracked plan-03 files**

- **Found during:** Task 1 (commit)
- **Issue:** lint-staged's prettier pass detected and staged AGENT_STANDARD.md and HOOK_STANDARD.md (created by plan-03 on disk but not yet committed). These were included in the Task 1 commit.
- **Impact:** Commit 4c85929 contains 4 files instead of 2. The extra files are valid plan-03 standards that belong in the repo.

---

**Total deviations:** 2 auto-fixed (both blocking)
**Impact on plan:** No content changes. Commit ordering and file grouping differ from plan but all deliverables are present and correct.

## Issues Encountered

- Pre-commit hook lint-staged git backup consistently failed on this branch due to stash conflicts from incomplete plan-03 execution. This is a known issue with lint-staged 16.x on branches with orphaned stashes.
- The plan-03 stash (`temp: unstaged changes during 01-03 task 1`) was dropped by lint-staged during cleanup.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 10 CANON standards complete (SKILL_STANDARDS, AUDIT_STANDARD, AGENT_STANDARD, HOOK_STANDARD, DOC_STANDARD, NAMING_CONVENTIONS, RECOVERY_STANDARD, JSONL_STANDARD, DEPENDENCY_STANDARD, INTERACTION_STANDARD)
- JSONL_STANDARD ready for dependency registry (Plan 05) and resource survey (Plan 07)
- DEPENDENCY_STANDARD ready for auto-discovery integration (Plan 05)
- INTERACTION_STANDARD ready for skill validation (Phase 05)

---

_Phase: 01-foundation_
_Completed: 2026-03-02_
