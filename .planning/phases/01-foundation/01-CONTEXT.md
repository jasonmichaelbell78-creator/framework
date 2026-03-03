# Phase 1: Foundation (CANON & Config) - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the standards foundation everything else builds on. Deliver `framework.config.json` with Zod validation, CANON directory with 10 standards, 2 schemas, and 8 templates, a dependency registry with auto-discovery, and an outside resource survey. This is a HARD gate — nothing proceeds until it passes.

</domain>

<decisions>
## Implementation Decisions

### CANON content depth

- Standards are guidelines with documented escape hatches — strong defaults, overrides must be justified
- Every standard gets machine-checkable enforcement (Zod schema, lint rule, or validation script)
- All 10 standards created in Phase 1 — complete foundation, no partial work
- Claude decides sizing per standard based on complexity (some naturally short, some need depth)

### Config file design

- Nested structure with metadata: `{ "project": {}, "systems": { "hooks": {}, "skills": {}, ... } }`
- Clean separation of project identity from system configuration
- Local override (`framework.config.local.json`): everything overridable via deep merge, but overrides trigger warnings and feed into the alerts system for later review
- Validation at two tiers: warn on session start, block on pre-commit
- Required minimal `project` section — `name` is required, `repo`/`environment`/`description` optional and enriched over time

### Dependency registry

- System-level edges hand-curated, file-level edges auto-discovered by script
- Auto-discovery script parses `require()`/`import`, skill references, agent spawns, hook configs
- Full 7 relationship types: `requires`, `invokes`, `references`, `triggers`, `generates`, `validates`, `extends`
- Registry populated via hybrid: auto-discover then review non-code deps conversationally
- Code dependencies (require/import) auto-accepted — high confidence, no review needed
- Non-code relationships (event triggers, CANON references, doc deps) go through interactive review
- Invocation: `/review-deps` skill wraps the auto-discovery script and guides review
- Reminder mechanism: session-end nudge (if structural changes detected) + GSD phase gate check (registry staleness at phase boundaries)
- Future: dependency staleness feeds into `/alerts` dashboard when it lands (Phase 9)

### Outside resource survey

- Scope: framework tooling only for Phase 1 — consumer recommendations deferred to Phase 9 or v2
- Documentation: JSONL source (`RESOURCE_SURVEY.jsonl`) + generated markdown view — dogfoods the JSONL→MD pattern
- Timeboxing: tiered — quick scan all candidates (~30 min), deep dive only adopt/maybe shortlist (~15-20 min each)
- Process: Claude proposes candidates per category + user adds specifics, Claude evaluates merged list, user approves final adopt/reject/defer decisions

### Claude's Discretion

- Sizing of each CANON standard document (concise vs comprehensive based on domain complexity)
- Choice of enforcement mechanism per standard (Zod schema vs lint rule vs validation script — whichever fits)
- Auto-discovery script implementation details (parsing strategy, confidence scoring thresholds)
- Specific categories for the resource survey (ESLint, MCP, CI, NPM — Claude determines what's relevant)

</decisions>

<specifics>
## Specific Ideas

- Local config overrides should create an audit trail, not just a one-time warning — feed into alerts system for visibility
- Dependency review reminders at two cadences: session-level (lightweight nudge) and phase-level (harder gate check)
- Resource survey uses the tiered evaluation pattern: quick scan filters, deep dive only on shortlisted candidates
- Auto-accepted code deps vs manually-reviewed non-code deps — respect user's time by only asking about genuinely ambiguous relationships

</specifics>

<deferred>
## Deferred Ideas

- Consumer project "recommended stack" survey — better informed after dogfooding the framework (Phase 9 or v2)
- `/alerts` dashboard integration for dependency staleness — Phase 9 when alerts infrastructure lands
- Dedicated `/review-deps` skill as interactive guided flow — can start conversational, formalize into skill if needed

</deferred>

---

_Phase: 01-foundation_
_Context gathered: 2026-03-02_
