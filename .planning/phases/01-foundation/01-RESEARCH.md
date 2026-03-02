# Phase 1: Foundation (CANON & Config) - Research

**Researched:** 2026-03-02
**Domain:** Framework standards infrastructure, configuration, and dependency tracking
**Confidence:** HIGH

## Summary

Phase 1 establishes the standards foundation that all subsequent phases build upon. The research focused on understanding what already exists in the codebase, what patterns are established that standards should formalize, what dependencies exist between deliverables, and what the realistic plan breakdown looks like.

The codebase already has significant implicit standards captured in CLAUDE.md, existing shared files (now migrated to `CANON/standards/SKILL_STANDARDS.md`, `CANON/templates/AUDIT_TEMPLATE.md`), ESLint rules, and patterns embedded in hooks and scripts. The CANON system's job is to formalize and centralize these scattered conventions into a single authoritative directory. The `framework.config.json` is entirely new -- nothing like it exists yet. The dependency registry builds on `scripts/trace-dependencies.js` which already handles require/import scanning.

**Primary recommendation:** Start with the config schema and CANON directory structure (parallel), then write standards (mostly formalizing existing patterns), then templates and schemas, then dependency registry (depends on CANON being in place to reference), and finally the outside resource survey (independent but timeboxed).

## Standard Stack

### Core

| Library           | Version        | Purpose                                     | Why Standard                                                                           |
| ----------------- | -------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| zod               | 4.x (via knip) | Schema validation for framework.config.json | Already in dependency tree via knip; project specifies Zod for validation (CONTEXT.md) |
| Node.js built-ins | ES2022 target  | File I/O, path handling                     | Already established; tsconfig targets ES2022                                           |

### Supporting

| Library    | Version | Purpose                            | When to Use                            |
| ---------- | ------- | ---------------------------------- | -------------------------------------- |
| typescript | 5.9.x   | Type checking for .ts schema files | Already installed as devDependency     |
| prettier   | 3.7.x   | Format all generated files         | Already configured (.prettierrc)       |
| eslint     | 9.x     | Lint any new JS/TS code            | Already configured (eslint.config.mjs) |

### Key Decision: Zod Dependency

Zod 4.x is already in the dependency tree as a transitive dependency of knip. For Phase 1, the schema files (`.ts`) need Zod as a direct dependency. **Install zod as a direct devDependency** since the project already has it transitively and the context decisions specify Zod for config validation.

```bash
npm install --save-dev zod
```

**Confidence: HIGH** -- Zod is already in the lock file, and CONTEXT.md explicitly specifies Zod schemas.

## Architecture Patterns

### CANON Directory Structure

```
CANON/
├── schemas/
│   ├── base-record.schema.ts       # Universal JSONL base fields
│   └── framework-config.schema.ts  # Config validation schema
├── standards/
│   ├── SKILL_STANDARDS.md          # Migrated from .claude/skills/_shared/
│   ├── AUDIT_STANDARD.md           # New standard defining audit methodology
│   ├── AGENT_STANDARD.md           # New
│   ├── HOOK_STANDARD.md            # New
│   ├── DOC_STANDARD.md             # New
│   ├── NAMING_CONVENTIONS.md       # New
│   ├── RECOVERY_STANDARD.md        # New
│   ├── JSONL_STANDARD.md           # New
│   ├── DEPENDENCY_STANDARD.md      # New
│   └── INTERACTION_STANDARD.md     # New
├── templates/
│   ├── CANONICAL.template.md       # For canonical reference docs
│   ├── FOUNDATION.template.md      # For foundation docs
│   ├── PLANNING.template.md        # For planning docs
│   ├── REFERENCE.template.md       # For reference/companion docs
│   ├── GUIDE.template.md           # For guides
│   ├── JSONL_SCHEMA.template.md    # For JSONL schema documentation
│   ├── PROJECT_GENESIS.template.md # For project genesis documents
│   └── AUDIT_TEMPLATE.md           # For audit output (migrated)
└── CANON_INDEX.md                  # Master index of all CANON content
```

### Config File Structure

Per CONTEXT.md decisions:

```json
{
  "$schema": "./CANON/schemas/framework-config.schema.json",
  "project": {
    "name": "framework",
    "description": "Reusable dev workflow framework",
    "repo": "jasonmichaelbell78-creator/framework"
  },
  "systems": {
    "hooks": {
      "sessionStart": { "enabled": true },
      "preCommit": { "preset": "standard" }
    },
    "skills": {
      "directory": ".claude/skills",
      "shared": ".claude/skills/_shared"
    },
    "agents": {
      "directory": ".claude/agents"
    },
    "scripts": {
      "configDir": "scripts/config"
    },
    "eslint": {
      "pluginDir": "eslint-plugin-framework"
    },
    "tdms": {
      "masterDebt": "docs/technical-debt/MASTER_DEBT.jsonl"
    }
  }
}
```

### Local Override Pattern

`framework.config.local.json` deep-merges over `framework.config.json`. Overrides trigger warnings at session start and feed into the alerts system. Validation at two tiers: warn on session start, block on pre-commit.

### Standard Document Pattern (for all 10 standards)

Every CANON standard MUST follow this structure:

```markdown
# STANDARD_NAME

**Document Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Status:** ACTIVE

## Purpose

[What this standard governs]

## Scope

[What systems/files this applies to]

## Requirements

[MUST/SHOULD/MAY rules with RFC 2119 keywords]

## Enforcement

[How this standard is machine-checked: Zod schema, ESLint rule, or validation script]

## Escape Hatches

[How to override with justification -- strong defaults with documented exceptions]

## Version History

| Version | Date | Description |
| ------- | ---- | ----------- |
```

## Don't Hand-Roll

| Problem                      | Don't Build                    | Use Instead                                    | Why                                                                    |
| ---------------------------- | ------------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------- |
| Config validation            | Custom JSON validator          | Zod schema + `z.parse()`                       | Zod gives typed errors, composable schemas, and JSON Schema generation |
| JSONL reading                | Custom parser                  | `scripts/lib/read-jsonl.js`                    | Already handles blank lines, malformed JSON, safe mode                 |
| Atomic file writes           | Direct `writeFileSync`         | `scripts/lib/safe-fs.js` `safeAtomicWriteSync` | Handles symlink guards, tmp+rename, EXDEV fallback                     |
| Dependency tracing (imports) | Manual grep for require/import | `scripts/trace-dependencies.js`                | Already scans hooks, skills, agents, scripts                           |
| Input sanitization           | Custom sanitizer               | `.claude/hooks/lib/sanitize-input.js`          | Already handles control chars, secret patterns, truncation             |
| JSONL rotation               | Custom rotation logic          | `.claude/hooks/lib/rotate-state.js`            | Already handles archive-on-rotation, locking                           |

**Key insight:** The codebase already has robust shared libraries for file I/O, JSONL handling, and dependency tracing. CANON standards should reference and require these, not reinvent them.

## Common Pitfalls

### Pitfall 1: Migrating vs. Duplicating Shared Files

**What goes wrong:** Creating CANON versions of SKILL_STANDARDS.md and AUDIT_TEMPLATE.md while leaving the originals in `.claude/skills/_shared/`, creating dual-source-of-truth.
**Why it happens:** Fear of breaking existing skill references.
**How to avoid:** Migrate files to CANON, then update all references. Use find-and-replace to update paths. Leave a one-line redirect file in the old location if needed for transition.
**Warning signs:** Two files with similar content in different locations.

### Pitfall 2: Over-Engineering Standards

**What goes wrong:** Writing 500+ line standards documents that nobody reads.
**Why it happens:** Trying to be comprehensive on the first pass.
**How to avoid:** Follow CONTEXT.md: "Claude decides sizing per standard based on complexity (some naturally short, some need depth)." NAMING_CONVENTIONS might be 80 lines. SKILL_STANDARDS (already exists at 280 lines) is near the upper limit.
**Warning signs:** Standards with more prose than rules.

### Pitfall 3: Circular Dependency Between Standards and Config

**What goes wrong:** Config schema references standards that reference the config schema.
**Why it happens:** Standards define the rules, config enables the systems, both need to refer to each other.
**How to avoid:** Config schema is independent (validates structure only). Standards reference config sections but don't depend on config existing. The config schema file does NOT import standards.

### Pitfall 4: Forgetting Cross-Platform Compatibility

**What goes wrong:** Scripts use forward slashes only, or assume Unix-style paths.
**Why it happens:** Developing on one platform.
**How to avoid:** Use `path.join()` and `path.resolve()` everywhere. The existing codebase handles this well (see `trace-dependencies.js` with its `normalise()` function). Standards should codify this pattern.
**Warning signs:** Hardcoded `/` in file paths within JS/TS code.

### Pitfall 5: Standards Without Enforcement

**What goes wrong:** Writing standards that are aspirational but never checked.
**Why it happens:** Enforcement mechanisms are harder to build than documents.
**How to avoid:** Per CONTEXT.md: "Every standard gets machine-checkable enforcement (Zod schema, lint rule, or validation script)." Plan enforcement alongside each standard, even if the enforcement itself ships in a later phase.
**Warning signs:** Standards with no `## Enforcement` section.

## Existing Codebase Inventory

### What Already Exists (migrate or formalize)

| Item                     | Location                                | Target CANON Asset                                    | Action                                                             |
| ------------------------ | --------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| SKILL_STANDARDS.md       | `CANON/standards/SKILL_STANDARDS.md`    | `CANON/standards/SKILL_STANDARDS.md`                  | Migrated (280 lines, well-structured)                              |
| AUDIT_TEMPLATE.md        | `CANON/templates/AUDIT_TEMPLATE.md`     | `CANON/templates/AUDIT_TEMPLATE.md`                   | Migrated (210 lines, well-structured)                              |
| CLAUDE.md conventions    | `CLAUDE.md`                             | Multiple standards                                    | Extract patterns into formal standards                             |
| audit-schema.json        | `scripts/config/audit-schema.json`      | Informs `JSONL_STANDARD.md` + `base-record.schema.ts` | Extract categories, severities, statuses, efforts, required fields |
| doc-header-config.json   | `scripts/config/doc-header-config.json` | Informs `DOC_STANDARD.md`                             | Extract required/recommended headers                               |
| skill-config.json        | `scripts/config/skill-config.json`      | Informs `SKILL_STANDARDS.md`                          | Extract required sections, deprecated patterns                     |
| trace-dependencies.js    | `scripts/trace-dependencies.js`         | Foundation for dependency registry auto-discovery     | Extend to support JSONL output and 7 relationship types            |
| validate-skills.js       | `scripts/validate-skills.js`            | Enforcement for SKILL_STANDARDS                       | Reference as enforcement mechanism                                 |
| ESLint plugin (23 rules) | `eslint-plugin-framework/`              | Referenced by multiple standards                      | Document which standards each rule enforces                        |
| Pre-commit hook          | `.husky/pre-commit`                     | Informs HOOK_STANDARD                                 | Document wave structure, skip mechanism                            |
| settings.json            | `.claude/settings.json`                 | Informs HOOK_STANDARD, INTERACTION_STANDARD           | Document hook registration patterns                                |

### What Must Be Created Fresh

| Item                         | Notes                                                                 |
| ---------------------------- | --------------------------------------------------------------------- |
| `framework.config.json`      | No equivalent exists; entirely new                                    |
| `framework-config.schema.ts` | New Zod schema                                                        |
| `base-record.schema.ts`      | New; extract universal fields from audit-schema.json                  |
| `AGENT_STANDARD.md`          | Agents exist (12 files) but no formal standard                        |
| `HOOK_STANDARD.md`           | Hooks exist (12 files + 6 libs) but no formal standard                |
| `DOC_STANDARD.md`            | Conventions exist in doc-header-config.json but no standard           |
| `NAMING_CONVENTIONS.md`      | Patterns exist in SKILL_STANDARDS.md and CLAUDE.md but no unified doc |
| `RECOVERY_STANDARD.md`       | Recovery patterns exist in skills but no formal standard              |
| `JSONL_STANDARD.md`          | JSONL patterns used extensively but not formally documented           |
| `DEPENDENCY_STANDARD.md`     | trace-dependencies.js exists but no standard for the registry         |
| `INTERACTION_STANDARD.md`    | UX patterns exist in SKILL_STANDARDS.md but not formalized            |
| 6 document templates         | Templates for different document types                                |
| `CANON_INDEX.md`             | Master index                                                          |
| `DEPENDENCY_GRAPH.jsonl`     | New file, with generated MD view                                      |
| `RESOURCE_SURVEY.jsonl`      | New file, with generated MD view                                      |

### Established Patterns to Codify

**From CLAUDE.md (direct extraction):**

- Atomic writes: tmp+rename pattern
- Symlink guard before writes
- Advisory locking via `withLock()`
- Secret redaction via sanitize-input.js
- JSONL as source of truth, MD as generated views
- Error handling: no `.message`/`.stack` without type check
- No eval, no hardcoded secrets, no TOCTOU
- RFC 2119 keywords (MUST/SHOULD/MAY)

**From existing hooks/scripts:**

- Session state pattern: `.session-state.json` with begin/end tracking
- Lockfile hash caching for dependency install skip
- JSONL rotation with archive (rotate-state.js)
- Skip mechanism: `SKIP_CHECKS` + `SKIP_REASON` with validation
- Dual-write pattern: MASTER_DEBT + deduped.jsonl

**From existing agent/skill patterns:**

- YAML frontmatter with name + description
- Agent return protocol: `COMPLETE: [agent-id] wrote N findings to [output-path]`
- Companion file extraction (REFERENCE.md, prompts.md)
- Size limits: <300 core, 300-499 warning, 500+ error

**From existing naming patterns:**

- Skills: lowercase-kebab-case directories
- Agents: lowercase-kebab-case `.md` files
- Hooks: lowercase-kebab-case `.js` files
- Hook libs: lowercase-kebab-case `.js` files
- Scripts: lowercase-kebab-case `.js` files
- Config files: lowercase-kebab-case `.json` files
- Standards: UPPERCASE_SNAKE_CASE `.md` files
- Templates: UPPERCASE with `.template.md` suffix

## Dependency Graph Between Deliverables

### Sequential Dependencies

```
framework-config.schema.ts ──> framework.config.json
                                    │
base-record.schema.ts ──────────────┤ (both schemas independent)
                                    │
CANON directory structure ──────────┤ (must exist before standards go in)
                                    │
10 CANON standards ─────────────────┤ (need directory + some standards
                                    │   reference the config file)
                                    │
8 CANON templates ──────────────────┤ (need standards to be defined first
                                    │   to know what templates look like)
                                    │
CANON_INDEX.md ─────────────────────┤ (depends on all content being created)
                                    │
DEPENDENCY_GRAPH.jsonl ─────────────┤ (needs standards to define format;
                                    │   needs all files to exist for scanning)
                                    │
RESOURCE_SURVEY.jsonl ──────────────┘ (independent of most others;
                                       dogfoods JSONL pattern)
```

### Parallelizable Work

These can proceed in parallel:

1. **Schema writing** (`base-record.schema.ts` + `framework-config.schema.ts`) -- independent of each other
2. **Standards writing** -- most are independent of each other (except DEPENDENCY_STANDARD informs the registry)
3. **Outside resource survey** -- fully independent of all other work
4. **Template creation** -- independent of each other (but depends on standard format being established)

### Critical Path

1. Create CANON directory structure (minutes)
2. Write `framework-config.schema.ts` + `base-record.schema.ts` (parallel)
3. Create `framework.config.json` (depends on schema)
4. Write 10 standards (mostly parallel, some inform others)
5. Create 8 templates (parallel, after standard format established)
6. Build `CANON_INDEX.md` (after all content exists)
7. Populate dependency registry (after all files exist)
8. Phase audit

## Realistic Plan Breakdown

### Task Group 1: Infrastructure (Sequential, ~15 min)

- Install zod as direct devDependency
- Create CANON directory structure (`schemas/`, `standards/`, `templates/`)
- Establish standard document format (header pattern, required sections)

### Task Group 2: Schemas (Parallel, ~30-45 min)

- `base-record.schema.ts` -- extract from audit-schema.json fields
- `framework-config.schema.ts` -- design from scratch per CONTEXT.md decisions

### Task Group 3: Config File (~15 min, depends on schema)

- Create `framework.config.json` with initial sections
- Validate against schema

### Task Group 4: Outside Resource Survey (Independent, timeboxed ~45-60 min)

- Can run in parallel with Task Groups 2-3
- JSONL source + generated MD view
- 5 categories: ESLint plugins, MCP servers, GitHub Actions, NPM packages, other tools

### Task Group 5: Standards Migration (2 items, ~20 min)

- Migrate SKILL_STANDARDS.md from `_shared/` to CANON
- Migrate AUDIT_TEMPLATE.md from `_shared/` to CANON templates
- Update all references in skills that point to old locations

### Task Group 6: New Standards (8 items, largely parallel, ~2-3 hours)

- Each standard: read existing code patterns, formalize into document
- Some standards are short (NAMING_CONVENTIONS: ~80-120 lines)
- Some need depth (HOOK_STANDARD: document 5 event types, registration, libs)
- Enforcement section for each (even if enforcement ships later)

### Task Group 7: Templates (6 new + 2 migrated, ~45 min)

- Create document templates based on established patterns
- Use doc-header-config.json conventions

### Task Group 8: CANON Index (~15 min, after all content)

- Generate CANON_INDEX.md listing all standards, schemas, templates

### Task Group 9: Dependency Registry (~45-60 min)

- Create DEPENDENCY_GRAPH.jsonl format per DEPENDENCY_STANDARD
- Run/extend trace-dependencies.js for auto-discovery
- Review non-code dependencies conversationally
- Generate markdown view

### Task Group 10: Phase Audit (~15-20 min)

- Verify all 5 requirements (FOUND-01 through FOUND-05)
- Validate framework.config.json against schema
- Confirm 10 standards, 2 schemas, 8 templates in CANON
- Confirm dependency registry populated
- Confirm resource survey documented

## State of the Art

| Old Approach                       | Current Approach                            | When Changed  | Impact                                     |
| ---------------------------------- | ------------------------------------------- | ------------- | ------------------------------------------ |
| Scattered conventions in CLAUDE.md | CANON directory with formal standards       | Phase 1 (now) | Single source of truth for all conventions |
| No config file                     | `framework.config.json` with Zod validation | Phase 1 (now) | Project-agnostic parameterization          |
| Implicit naming conventions        | NAMING_CONVENTIONS.md standard              | Phase 1 (now) | Machine-checkable naming rules             |
| Ad-hoc JSONL formats               | JSONL_STANDARD.md + base-record.schema.ts   | Phase 1 (now) | Universal base record, consistent fields   |
| No dependency tracking             | DEPENDENCY_GRAPH.jsonl with typed edges     | Phase 1 (now) | Cross-system relationship visibility       |

## Open Questions

1. **Zod version: 3.x vs 4.x?**
   - What we know: knip brings in zod@4.3.6 transitively. Zod 4 was recently released.
   - What's unclear: Whether to install zod@3 (stable, widely documented) or zod@4 (newer, already in tree).
   - Recommendation: Use zod@4 since it is already in the dependency tree via knip. This avoids version conflicts.

2. **How to handle the SKILL_STANDARDS.md migration?**
   - What we know: 18+ audit skills referenced the old shared paths (now migrated to CANON).
   - What's unclear: Whether to leave redirect files, update all references immediately, or use symlinks.
   - Recommendation: Move files to CANON, update all references in the same commit, leave no redirect. Clean migration prevents dual-source confusion.

3. **Config schema: generate JSON Schema from Zod?**
   - What we know: Zod can generate JSON Schema for `$schema` references in JSON files. This enables IDE validation.
   - What's unclear: Whether to include a build step for JSON Schema generation or just use runtime Zod validation.
   - Recommendation: Start with runtime Zod validation only. Add JSON Schema generation if IDE validation becomes important.

4. **Dependency registry: extend trace-dependencies.js or create new script?**
   - What we know: trace-dependencies.js already scans require/import across hooks, skills, agents, scripts. Outputs JSON to stdout.
   - What's unclear: Whether to extend it for JSONL output and 7 relationship types, or create a separate registry builder.
   - Recommendation: Create a new `scripts/build-dependency-registry.js` that uses trace-dependencies.js output as input for code deps, then adds non-code relationships. Keeps concerns separate.

## Sources

### Primary (HIGH confidence)

- Direct codebase analysis of all files listed in the inventory above
- `.planning/phases/01-foundation/01-CONTEXT.md` -- locked decisions from discuss phase
- `.planning/REQUIREMENTS.md` -- FOUND-01 through FOUND-05 requirements
- `.planning/PROJECT.md` -- project constraints and key decisions
- `CLAUDE.md` -- existing conventions to formalize

### Secondary (MEDIUM confidence)

- `scripts/config/audit-schema.json` -- existing JSONL field definitions (may need updates)
- `scripts/config/doc-header-config.json` -- existing doc header conventions (may evolve)

### Tertiary (LOW confidence)

- Zod 4.x API stability -- recently released, API may have minor changes from Zod 3 docs

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- using existing project dependencies, no new technology
- Architecture: HIGH -- formalizing existing patterns, decisions locked in CONTEXT.md
- Pitfalls: HIGH -- identified from direct codebase analysis of existing patterns
- Dependency ordering: HIGH -- determined from file reference analysis
- Plan breakdown: MEDIUM -- time estimates are approximate, complexity varies per standard

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (stable domain, 30-day validity)
