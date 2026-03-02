# JSONL Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines the canonical format, patterns, and tooling for all JSONL data files in
the framework. JSONL is the source of truth for append-only data; Markdown views
are always generated from JSONL and MUST NOT be edited directly.

---

## Purpose

Establish a single, consistent data format for all structured records persisted
by the framework. JSONL (JSON Lines) provides append-friendly, line-oriented
storage that supports streaming reads, safe concurrent writes, and
straightforward rotation.

---

## Scope

This standard applies to:

- All `.jsonl` files in the framework repository
- Any script or hook that reads or writes JSONL data
- Generated Markdown views derived from JSONL sources
- The TDMS debt tracking system, audit findings, dependency registry,
  resource survey, and any future append-only data stores

---

## Requirements

### Source of Truth Pattern

JSONL files are the **single canonical source** for their data domain.

- Markdown views MUST be generated from JSONL -- never maintained independently
- When JSONL and Markdown disagree, JSONL wins (the Markdown view is stale)
- Scripts that update data MUST write to JSONL first, then regenerate views
- This pattern is called **dual-source prevention** -- one source, many views

### Base Record Format

Every JSONL record MUST include the base fields defined in
`CANON/schemas/base-record.schema.ts`:

| Field       | Type   | Required | Description                         |
| ----------- | ------ | -------- | ----------------------------------- |
| `id`        | string | MUST     | UUID v4 unique identifier           |
| `timestamp` | string | MUST     | ISO 8601 UTC creation timestamp     |
| `version`   | string | MUST     | Semver schema version (e.g., 1.0.0) |
| `source`    | string | MAY      | Origin system or process            |
| `category`  | string | MAY      | Classification category             |
| `status`    | string | MAY      | Current lifecycle status            |

Domain-specific schemas SHOULD extend `baseRecordSchema` using Zod's `.extend()`
or `.merge()` to add additional fields while preserving base field validation.

### File Format Rules

1. Each line MUST be a complete, valid JSON object (no multi-line formatting)
2. Files MUST use UTF-8 encoding without BOM
3. Files MUST end with a trailing newline
4. Blank lines between records MUST be tolerated by readers (see safe reading)
5. Lines MUST NOT exceed 10,000 characters (prevents runaway serialization)
6. Field ordering within a record SHOULD be consistent but is not required

### Dual-Write Pattern

When data must exist in both a master file and a deduplicated view (e.g.,
`MASTER_DEBT.jsonl` and `deduped.jsonl`), the dual-write pattern applies:

1. Write the new record to the master (append) file first
2. Regenerate the deduplicated view from the master file
3. Both writes MUST be performed within the same operation
4. If the dedup write fails, the master append MUST still be preserved
5. Reference implementation: `scripts/lib/safe-fs.js` `writeMasterDebt()`

### Safe Reading

All JSONL readers MUST handle:

- **Blank lines:** Skip silently (common after rotation or manual editing)
- **Malformed JSON:** Skip the line and log a warning (do not abort the read)
- **Missing files:** Return empty array when `safe` mode is enabled
- **BOM markers:** Strip UTF-8 BOM before parsing

Reference implementation: `scripts/lib/read-jsonl.js`

```javascript
// Correct pattern
const items = readJsonl(filePath, { safe: true, quiet: false });

// Anti-pattern: raw fs.readFileSync + JSON.parse per line without error handling
```

### Safe Writing

All JSONL writers MUST use atomic write operations:

1. Write to a temporary file (`.tmp` suffix) in the same directory
2. Validate the temporary file is not a symlink (`safe-fs.js` symlink guard)
3. Rename the temporary file to the target path
4. Use advisory locking (`safe-fs.js` `withLock()`) when multiple processes may
   write concurrently

Reference implementation: `scripts/lib/safe-fs.js`

JSONL writers MUST NOT:

- Append directly to the target file without locking
- Write to symlinked paths (fail-closed on symlink detection)
- Use `fs.writeFileSync()` directly on the target path

### Rotation

JSONL files that grow unboundedly MUST implement rotation:

- **Trigger:** When line count exceeds a configured maximum (e.g., 500 lines)
- **Behavior:** Keep the newest N entries (default: 60% of max), discard oldest
- **Atomicity:** Rotation MUST use the tmp+rename pattern
- **Archive:** Rotated entries SHOULD be preserved in a dated archive file when
  the data has audit value

Reference implementation: `.claude/hooks/lib/rotate-state.js`

Rotation thresholds SHOULD be configurable via `framework.config.json` when the
config system supports it (Phase 3+).

---

## Enforcement

### Schema Validation

- All JSONL records MUST pass `baseRecordSchema` validation at read boundaries
- Domain-specific schemas MUST extend `baseRecordSchema` (defined in
  `CANON/schemas/base-record.schema.ts`)
- Validation SHOULD occur at ingestion time (when records are read), not at
  write time (to avoid blocking appends)

### Automated Checks

| Check                  | Mechanism                  | When           |
| ---------------------- | -------------------------- | -------------- |
| Base field presence    | Zod schema validation      | Read boundary  |
| File format compliance | `read-jsonl.js` warnings   | Every read     |
| Rotation enforcement   | `rotate-state.js` triggers | Post-write     |
| Dual-write integrity   | TDMS audit script          | Periodic audit |

---

## Examples

### Valid JSONL Record

```json
{
  "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "timestamp": "2026-03-02T12:00:00Z",
  "version": "1.0.0",
  "source": "audit-code",
  "category": "security",
  "status": "NEW",
  "title": "Missing input validation on /api/deploy"
}
```

### Extending Base Schema

```typescript
import { baseRecordSchema } from './base-record.schema';
import { z } from 'zod';

export const debtRecordSchema = baseRecordSchema.extend({
  title: z.string(),
  severity: z.enum(['S0', 'S1', 'S2', 'S3']),
  effort: z.enum(['E0', 'E1', 'E2', 'E3']),
});
```

---

## References

- `CANON/schemas/base-record.schema.ts` -- Zod schema for base record fields
- `scripts/lib/read-jsonl.js` -- Safe JSONL reader with blank line and error handling
- `scripts/lib/safe-fs.js` -- Atomic writes, symlink guards, advisory locking
- `.claude/hooks/lib/rotate-state.js` -- JSONL rotation implementation

---

## Version History

| Version | Date       | Changes               |
| ------- | ---------- | --------------------- |
| 1.0     | 2026-03-02 | Initial CANON version |
