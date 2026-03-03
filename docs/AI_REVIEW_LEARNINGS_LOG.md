# AI Review Learnings Log

Structured learning capture from AI-assisted code reviews.

---

## Review #1 - PR feature/framework-skeleton R1 (Qodo)

**Date:** 2026-03-02
**Source:** Qodo Code Review Bot
**Total Items:** 7 (6 review + 1 CI failure)
**Fixed:** 4 | **Rejected:** 3 | **Deferred:** 0

### Patterns Learned

1. **Deterministic IDs for committed JSONL**: When JSONL files are tracked in
   git, never use `crypto.randomUUID()` or current timestamps. Use deterministic
   hashes (e.g., SHA-256 of the edge key) to prevent noisy diffs on
   regeneration.

2. **No insecure fallbacks for security primitives**: If `safe-fs.js` provides
   symlink guarding and advisory locking, do NOT provide a fallback that skips
   these protections. Fail hard instead of falling back to insecure operations.

3. **Config paths must track migrations**: When shared resources migrate
   (e.g., `.claude/skills/_shared` to `CANON/`), update ALL config defaults and
   schema defaults in the same PR. Grep for the old path to ensure no stale
   references remain.

### Rejected Items

- **writeJsonl() uses existsSync()**: FALSE POSITIVE - writeJsonl() uses
  `mkdirSync({ recursive: true })`, not existsSync. Reviewer analyzed stale
  code.
- **Long regex line (schema)**: FALSE POSITIVE - No regex exists in the schema
  file. Reviewer likely confused files.
- **Unsafe xargs prettier check**: The `tr '\n' '\0' | xargs -0` pattern in
  pre-commit is correct POSIX-safe handling for filenames with spaces. Not a
  real issue.

### Severity Breakdown

- Critical: 0
- Major: 3 (stale config path, unsafe fallback, JSONL churn)
- Minor: 3 (rejected false positives)
- Trivial: 1 (prettier formatting)
