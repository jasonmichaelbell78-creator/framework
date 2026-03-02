# Dependency Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines the dependency registry format, relationship types, auto-discovery
process, and maintenance cadence for tracking inter-system dependencies in the
framework.

---

## Purpose

Provide a machine-readable, auditable record of how framework systems relate to
each other. The dependency registry enables impact analysis (what breaks if I
change X?), migration planning (what order do I port things?), and staleness
detection (are recorded dependencies still accurate?).

---

## Scope

This standard applies to:

- The `DEPENDENCY_GRAPH.jsonl` registry file
- The `scripts/trace-dependencies.js` auto-discovery tool
- The `/review-deps` skill for interactive dependency review
- Any script or workflow that reads or writes dependency records
- Both system-level (hand-curated) and file-level (auto-discovered) edges

---

## Requirements

### Registry Format

The dependency registry is stored as `DEPENDENCY_GRAPH.jsonl` and follows the
JSONL Standard (`CANON/standards/JSONL_STANDARD.md`).

Each record MUST include the base record fields (`id`, `timestamp`, `version`)
plus the following dependency-specific fields:

| Field        | Type   | Required | Description                                    |
| ------------ | ------ | -------- | ---------------------------------------------- |
| `source`     | string | MUST     | The system, file, or module that depends       |
| `target`     | string | MUST     | The system, file, or module being depended on  |
| `type`       | string | MUST     | Relationship type (one of the 7 defined below) |
| `confidence` | string | MUST     | Discovery confidence level                     |
| `metadata`   | object | MAY      | Additional context (description, evidence)     |

### Relationship Types

The framework recognizes exactly 7 relationship types:

| Type         | Definition                                             | Example                                    |
| ------------ | ------------------------------------------------------ | ------------------------------------------ |
| `requires`   | Hard dependency; source cannot function without target | Hook requires `safe-fs.js` library         |
| `invokes`    | Source calls or spawns target at runtime               | Skill invokes `trace-dependencies.js`      |
| `references` | Source mentions or links to target (soft dependency)   | Standard references a schema file          |
| `triggers`   | Source causes target to execute via event or hook      | Git commit triggers `pre-commit` hook      |
| `generates`  | Source produces target as output                       | Audit script generates `MASTER_DEBT.jsonl` |
| `validates`  | Source checks or enforces rules on target              | ESLint rule validates source files         |
| `extends`    | Source builds upon or inherits from target             | Debt schema extends `baseRecordSchema`     |

All dependency records MUST use one of these 7 types. New types MUST NOT be
introduced without updating this standard.

### Confidence Levels

Every dependency record MUST declare a confidence level:

| Level    | Definition                                             | Review Required |
| -------- | ------------------------------------------------------ | --------------- |
| `high`   | Auto-discovered from code (require/import statements)  | No              |
| `medium` | Auto-discovered from non-code (config refs, doc links) | Yes             |
| `low`    | Manually entered or inferred from context              | Yes             |

- `high` confidence edges are auto-accepted without human review
- `medium` and `low` confidence edges MUST be reviewed via `/review-deps`
  before they are considered authoritative

### Granularity

Dependencies operate at two levels of granularity:

**System-level edges** (coarse-grained):

- Describe relationships between framework subsystems (hooks, skills, scripts)
- Hand-curated by developers during dependency review sessions
- SHOULD capture architectural intent, not just code-level connections
- Example: "Hook system requires scripts/lib for shared utilities"

**File-level edges** (fine-grained):

- Describe relationships between individual files
- Auto-discovered by `scripts/trace-dependencies.js`
- Generated from `require()`, `import`, and `export` analysis
- Example: "session-start.js requires rotate-state.js"

System-level edges MAY be derived from file-level edges by aggregation, but
MUST be explicitly reviewed and approved.

### Auto-Discovery

The `scripts/trace-dependencies.js` script performs automated dependency
discovery:

1. **Scan scope:** All JS/TS files in hooks, skills, scripts, and agents
2. **Extraction:** Parse `require()`, `import`, `export...from` statements
3. **Classification:** Categorize each specifier as builtin, npm, or relative
4. **Resolution:** Resolve relative paths to absolute file paths
5. **Output:** JSON dependency graph with per-file edges and metadata

Auto-discovery MUST be run:

- Before any dependency review session (`/review-deps`)
- At the start of each GSD phase (phase gate check)
- After significant structural changes (new files, moved files, renamed imports)

### Registry Population Flow

The registry is populated through a hybrid process:

1. **Auto-discover:** Run `trace-dependencies.js` to find code dependencies
2. **Review non-code:** Use `/review-deps` to review non-code relationships
3. **Persist:** Write approved edges to `DEPENDENCY_GRAPH.jsonl`
4. **Regenerate views:** Update any Markdown views from the JSONL source

Code dependencies (require/import) with `high` confidence are auto-accepted.
Non-code relationships (`medium`/`low` confidence) go through interactive review.

### Staleness Detection

The dependency registry MUST be checked for staleness:

**Two-tier reminder system:**

1. **Session-end nudge:** If structural changes were detected during the session
   (new files, moved files, deleted files), the session-end hook SHOULD remind
   the developer to run `/review-deps`
2. **Phase gate check:** At each GSD phase boundary, the registry MUST be
   validated for staleness. Stale registries block phase advancement.

**Staleness indicators:**

- Files referenced in the registry that no longer exist
- Files in the project not represented in the registry
- Dependency edges that no longer match code analysis
- Registry age exceeding the configured maximum (default: 30 days)

---

## Enforcement

### Automated Checks

| Check                    | Mechanism                   | When              |
| ------------------------ | --------------------------- | ----------------- |
| Record format validation | Zod schema + base record    | Read boundary     |
| Relationship type check  | Enum validation (7 types)   | Write boundary    |
| Staleness detection      | Phase gate script           | Phase boundary    |
| Confidence review gate   | `/review-deps` skill        | Before persisting |
| Circular dependency scan | `trace-dependencies.js` DFS | Auto-discovery    |

### Validation Rules

- Every record MUST have a valid `type` from the 7 defined relationship types
- Every record MUST have a valid `confidence` level (high, medium, low)
- `source` and `target` MUST be non-empty strings
- Duplicate edges (same source + target + type) SHOULD be deduplicated
- Self-referential edges (source === target) MUST NOT be recorded

---

## Examples

### DEPENDENCY_GRAPH.jsonl Record

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "timestamp": "2026-03-02T12:00:00Z",
  "version": "1.0.0",
  "source": ".claude/hooks/session-start.js",
  "target": ".claude/hooks/lib/rotate-state.js",
  "type": "requires",
  "confidence": "high",
  "metadata": { "evidence": "require('./lib/rotate-state')" }
}
```

### Auto-Discovery Output (trace-dependencies.js)

```json
{
  "meta": { "sourceRoot": "/project", "generatedAt": "2026-03-02T12:00:00Z" },
  "portFiles": [
    { "file": ".claude/hooks/session-start.js", "requires": [".claude/hooks/lib/rotate-state.js"] }
  ]
}
```

---

## References

- `CANON/standards/JSONL_STANDARD.md` -- Base JSONL format and patterns
- `CANON/schemas/base-record.schema.ts` -- Base record Zod schema
- `scripts/trace-dependencies.js` -- Auto-discovery implementation
- `/review-deps` skill -- Interactive dependency review workflow

---

## Version History

| Version | Date       | Changes               |
| ------- | ---------- | --------------------- |
| 1.0     | 2026-03-02 | Initial CANON version |
