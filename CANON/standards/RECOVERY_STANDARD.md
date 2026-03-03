# Recovery Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines patterns for state persistence, compaction resilience, error recovery,
and concurrent access safety within the framework's hook and script systems.

---

## Purpose

Ensure that framework automation (hooks, scripts, skills) can survive
interruptions, context compaction, and concurrent access without data loss or
corruption. Claude Code sessions can be compacted at any time, and hooks must
be resilient to this reality.

---

## Scope

This standard applies to:

- All hooks in `.claude/hooks/` that persist state
- Shared libraries in `.claude/hooks/lib/` and `scripts/lib/`
- Scripts that write to JSONL or JSON state files
- Skills that manage session or task state

This standard does NOT apply to:

- Ephemeral output (stdout/stderr messages)
- Git operations (governed by git conventions)
- CI/CD workflows (governed by workflow conventions)

---

## Requirements

### Atomic Write Pattern

All file writes that persist state MUST use the atomic write pattern:

```javascript
// Write to temp file, then rename (atomic on same filesystem)
const tmpPath = `${targetPath}.tmp`;
fs.writeFileSync(tmpPath, data, 'utf-8');
fs.rmSync(targetPath, { force: true }); // Windows: pre-remove target
fs.renameSync(tmpPath, targetPath);
```

1. State writes MUST use the tmp+rename pattern via
   `scripts/lib/safe-fs.js#safeAtomicWriteSync`.
2. Writers MUST handle `EXDEV` errors (cross-device rename) by falling back
   to copy+delete.
3. On Windows, writers MUST pre-remove the target file before rename
   (`fs.rmSync` with `{ force: true }`).
4. Writers MUST validate paths with `symlink-guard.js#isSafeToWrite` before
   any write operation.

### Compaction Resilience

Context compaction can occur at any time during a Claude Code session. State
must survive compaction intact.

5. Hooks MUST save critical state before compaction using the `PreCompact`
   event hook.
6. The pre-compaction save MUST capture: session counter, task states, recent
   commits, git state, and active plan.
7. Post-compaction restoration MUST use the `SessionStart` hook with the
   `"compact"` matcher.
8. The restoration output MUST be structured so Claude can resume work
   seamlessly.

**Reference implementation:**

- Save: `.claude/hooks/pre-compaction-save.js` writes to
  `.claude/state/handoff.json`
- Restore: `.claude/hooks/compact-restore.js` reads handoff and outputs
  structured context

### State Persistence Patterns

9. Append-only data (audit logs, commit tracking) MUST use JSONL format.
10. Session state (counters, flags) SHOULD use JSON format with atomic writes.
11. State files MUST be placed in `.claude/state/` (gitignored) for ephemeral
    state or in tracked locations for persistent state.
12. State SHOULD be saved after each logical batch of work, not just at
    session end.

### State Rotation

Large state files degrade performance. Rotation keeps files manageable.

13. JSONL state files MUST be rotated when they exceed their configured
    maximum entry count.
14. Rotation MUST keep the most recent entries (default: 60% of max).
15. Rotation MUST use atomic writes (tmp+rename) via
    `.claude/hooks/lib/rotate-state.js#rotateJsonl`.
16. JSON array state files SHOULD be pruned using
    `rotate-state.js#pruneJsonArray` when they exceed configured limits.

### Concurrent Access Safety

17. Scripts that write to shared state files MUST use advisory file locking
    via `scripts/lib/safe-fs.js#withLock`.
18. Lock files MUST use `.lock` extension appended to the target file path.
19. Lock acquisition MUST have a timeout (default: 5 seconds) to prevent
    deadlocks.
20. Lock holders MUST release locks in a `finally` block.

### Orphaned State Detection

21. Ephemeral state files (in `.claude/state/`) SHOULD include a timestamp
    field for staleness detection.
22. State files older than 24 hours without updates SHOULD be considered
    orphaned.
23. The `SessionStart` hook SHOULD clean up orphaned ephemeral state files.
24. Lock files older than 60 seconds SHOULD be considered stale and MAY be
    forcibly removed.

### Error Recovery

25. Hooks MUST NOT crash Claude sessions on state read/write failures. Use
    try/catch with graceful degradation.
26. If state cannot be read, hooks SHOULD continue with default values and
    log a warning.
27. If state cannot be written, hooks SHOULD log an error but MUST NOT block
    the user's workflow.
28. Recovery skills SHOULD be idempotent -- running them multiple times MUST
    produce the same result.

---

## Enforcement

| Mechanism             | Status  | Description                                   |
| --------------------- | ------- | --------------------------------------------- |
| Code review checklist | Current | Review state operations for atomic writes     |
| ESLint rule           | Current | `framework/require-symlink-guard` (planned)   |
| Recovery skill        | Current | Skills validate their own state on invocation |
| Integration tests     | Phase 5 | Test compaction save/restore cycle            |

**Current enforcement:** Code review and existing ESLint rules for error
handling patterns.
**Planned enforcement:** Dedicated ESLint rule for symlink guard usage and
integration tests for compaction resilience (Phase 5).

---

## Escape Hatches

- **Ephemeral writes:** Temporary files with lifespan under 1 minute
  (e.g., hook output captures) MAY skip atomic write patterns. They MUST
  still use symlink guards.
- **Read-only state:** Hooks that only read state files are exempt from
  locking requirements. They SHOULD handle missing or corrupt files
  gracefully.
- **Emergency state reset:** When state files are corrupted beyond recovery,
  delete `.claude/state/` contents and restart the session. The `SessionStart`
  hook will reinitialize defaults.

---

## Version History

| Version | Date       | Description                                         |
| ------- | ---------- | --------------------------------------------------- |
| 1.0     | 2026-03-02 | Initial standard from existing hook/script patterns |
