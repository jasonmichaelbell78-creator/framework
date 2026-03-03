---
phase: 01-foundation
plan: 03
subsystem: standards
tags: [canon, standards, agent, hook, doc, naming, recovery]

# Dependency graph
requires:
  - phase: 01-01
    provides: CANON directory structure and config schema
  - phase: 01-02
    provides: standard document structure pattern (SKILL_STANDARDS, AUDIT_STANDARD)
provides:
  - CANON/standards/AGENT_STANDARD.md - agent file structure, naming, return protocol
  - CANON/standards/HOOK_STANDARD.md - hook events, registration, shared libs, error handling
  - CANON/standards/DOC_STANDARD.md - document headers, categories, structural requirements
  - CANON/standards/NAMING_CONVENTIONS.md - naming patterns for 14 file types
  - CANON/standards/RECOVERY_STANDARD.md - atomic writes, compaction resilience, state rotation
affects: [01-04 remaining standards, 01-05 templates, 01-06 CANON index]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'RFC 2119 requirement levels across all 5 standards'
    - 'Enforcement mechanisms documented for future phases (Phase 4-5)'
    - 'Real codebase file references in all standards (not aspirational)'

key-files:
  created:
    - CANON/standards/AGENT_STANDARD.md
    - CANON/standards/HOOK_STANDARD.md
    - CANON/standards/DOC_STANDARD.md
    - CANON/standards/NAMING_CONVENTIONS.md
    - CANON/standards/RECOVERY_STANDARD.md
  modified: []

# Decisions
decisions:
  - id: agent-size-limits
    decision: 'Agent size limits: <300 core (OK), 300-499 (warning), 500+ (error)'
    rationale: Matches existing agent patterns (all 12 agents under 100 lines)
  - id: hook-exit-codes
    decision: 'Hook exit codes: 0=allow, 1=error(continue), 2=block(PreToolUse only)'
    rationale: Matches existing hook implementations (block-push-to-main uses exit 2)
  - id: doc-status-values
    decision: 'Document status values: ACTIVE, DRAFT, DEPRECATED, ARCHIVED'
    rationale: Covers full document lifecycle without over-categorization

# Metrics
metrics:
  duration: 9min
  tasks_completed: 2
  tasks_total: 2
  completed: 2026-03-02
---

# Phase 01 Plan 03: New CANON Standards (Wave 1) Summary

**One-liner:** 5 CANON standards formalizing agent, hook, doc, naming, and recovery patterns from existing codebase into canonical structure with RFC 2119 requirements and enforcement mechanisms.

## What Was Done

### Task 1: AGENT_STANDARD and HOOK_STANDARD

Wrote two standards covering the agent and hook systems:

- **AGENT_STANDARD.md** (~143 lines): Frontmatter requirements (name, description, tools, model), file naming (lowercase-kebab-case.md), size limits (<300/300-499/500+), return protocol (`COMPLETE: [agent-id] wrote N findings to [output-path]`), companion file patterns.
- **HOOK_STANDARD.md** (~205 lines): All 5 event types documented with use cases, registration patterns in settings.json, matcher conventions, exit code semantics (0/1/2), 6 shared libraries cataloged, skip mechanism (SKIP_CHECKS + SKIP_REASON), error handling requirements, security requirements.

### Task 2: DOC_STANDARD, NAMING_CONVENTIONS, and RECOVERY_STANDARD

Wrote three standards covering documentation, naming, and recovery:

- **DOC_STANDARD.md** (~149 lines): Required headers (Document Version, Last Updated, Status) from doc-header-config.json, recommended headers, 6 document categories with naming patterns, structural requirements, version history table format.
- **NAMING_CONVENTIONS.md** (~136 lines): 14 file type naming patterns (skills, agents, hooks, hook libs, scripts, configs, standards, templates, JSONL, schemas, ESLint rules, workflows, skill files, directories), identifier naming (env vars, JSONL fields, JS/TS variables/classes), compound name rules.
- **RECOVERY_STANDARD.md** (~171 lines): Atomic write pattern (tmp+rename via safe-fs.js), compaction resilience (PreCompact save + SessionStart compact restore), state persistence patterns, JSONL rotation (rotate-state.js), concurrent access safety (advisory locking via withLock), orphaned state detection, error recovery requirements.

## Decisions Made

| Decision                                     | Rationale                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| Agent size limits: <300/300-499/500+         | All 12 existing agents are under 100 lines; limits provide growth room |
| Hook exit codes: 0/1/2                       | Matches block-push-to-main.js exit 2 pattern and Node conventions      |
| Doc status: ACTIVE/DRAFT/DEPRECATED/ARCHIVED | Full lifecycle coverage without over-categorization                    |
| Enforcement deferred to Phase 4-5            | Standards document enforcement mechanisms but scripts ship later       |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Lint-staged git error during commits**

- **Found during:** Task 1 commit
- **Issue:** lint-staged "Needed a single revision" error causing pre-commit hook failures. Lint-staged's git stash backup mechanism failed, and its fallback prettier check failed on unformatted files.
- **Fix:** Pre-formatted files with `npx prettier --write` before staging. Also discovered lint-staged was pulling in untracked files from a parallel session into commits.
- **Files affected:** All 5 standard files (formatted before staging)

**2. [Rule 3 - Blocking] Parallel session artifacts in git index**

- **Found during:** Task 1 commit
- **Issue:** Untracked files from a parallel session (RESOURCE_SURVEY.jsonl/md, DEPENDENCY_STANDARD.md, JSONL_STANDARD.md) were being pulled into commits by lint-staged's formatting pass.
- **Fix:** Used `git reset HEAD` and `git rm --cached` to clean the index. The parallel session's commit (4c85929) had already committed AGENT_STANDARD and HOOK_STANDARD, so Task 1 files were already tracked.

## Commit Log

| Task                                                         | Commit  | Files                                                |
| ------------------------------------------------------------ | ------- | ---------------------------------------------------- |
| Task 1 (AGENT_STANDARD, HOOK_STANDARD)                       | 4c85929 | Committed by parallel session via lint-staged pickup |
| Task 2 (DOC_STANDARD, NAMING_CONVENTIONS, RECOVERY_STANDARD) | 0cfd758 | 3 new files                                          |

## Verification Results

- 10 total standard files in CANON/standards/ (5 new + 2 migrated + 3 from parallel sessions)
- All 5 new standards have all 6 required sections
- RFC 2119 keyword counts: AGENT(27), HOOK(37), DOC(22), NAMING(20), RECOVERY(31)
- All standards reference real existing codebase files and patterns
- Content reflects actual codebase patterns (not aspirational)

## Next Phase Readiness

All 5 standards from this plan are complete. The remaining 3 standards (JSONL_STANDARD, DEPENDENCY_STANDARD, INTERACTION_STANDARD) were written by parallel sessions. The CANON standards directory now has 10 standards ready for template and index creation in subsequent plans.
