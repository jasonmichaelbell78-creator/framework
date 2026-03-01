# Diagnosis: Framework Migration & Sync System

**Date:** 2026-03-01
**Task:** Complete migration of reusable development infrastructure from sonash-v0 into a standalone, sanitized framework repo. Establish upstream sync mechanism. Lay foundation for future interactive project scaffolding.

## ROADMAP Alignment

**Aligned** — This task directly encompasses ROADMAP Phases 1-5 and adds the critical "complete migration" work that the roadmap assumes already happened (but only partially did). The roadmap's Phase 3 (Upstream Sync) is explicitly called out by the user as a core requirement.

The roadmap currently lists the initial skeleton as "completed," but comparison reveals significant gaps between what exists here and what exists in sonash. The roadmap understates the remaining migration work.

## Relevant Existing Systems

| System                                      | Relationship                                    | Pattern to Follow                                                 |
| ------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| **Sonash .claude/skills/** (59+)            | Source — 48 migrated, ~11 missing or outdated   | Skill structure: SKILL.md + optional REFERENCE.md, scripts/, lib/ |
| **Sonash .claude/agents/** (25+)            | Source — 12 migrated, 13+ missing               | Agent structure: single .md file per agent                        |
| **Sonash .claude/hooks/** (14+)             | Source — 12 migrated, 2+ missing                | Hook structure: JS file + lib/ shared modules                     |
| **Sonash eslint-plugin-sonash/** (24 rules) | Source — 23 migrated as eslint-plugin-framework | One rule may be missing; need diff                                |
| **Sonash .husky/**                          | Source — 3 waves migrated, 11 waves exist       | Shell scripts with wave-based architecture                        |
| **Sonash scripts/** (120+)                  | Source — ~50 migrated, 70+ remaining            | scripts/lib/, scripts/config/, scripts/debt/, scripts/reviews/    |
| **Sonash .github/workflows/** (16)          | Source — 9 migrated, 7 missing                  | YAML workflow files                                               |
| **Sonash scripts/reviews/**                 | Source — TypeScript ecosystem with Zod schemas  | Already partially ported                                          |
| **TDMS ecosystem**                          | Partially ported                                | JSONL source of truth, MD generated views                         |
| **Ecosystem audit pattern**                 | 7 audits exist in both, need sync verification  | checkers/ + lib/ + runner architecture                            |
| **GSD system**                              | Global (not in repo, loaded via plugins)        | 11 agents, separate planning infrastructure                       |

## Delta Analysis: What's Missing

### Agents (13 missing from framework)

- `markdown-syntax-formatter`, `mcp-expert`, `nextjs-architecture-expert`, `penetration-tester`, `performance-engineer`, `prompt-engineer`, `react-performance-optimization`, `security-auditor`, `security-engineer`, `technical-writer`, `test-engineer`, `ui-ux-designer`
- Note: Some are app-agnostic (penetration-tester, security-auditor, technical-writer, test-engineer) and should be migrated. Others (nextjs-architecture-expert, react-performance-optimization) are tech-stack-specific — decision needed.

### Skills (~11 missing or significantly different)

- `task-next`, `quick-fix`, `sonarcloud`, `market-research-reports`, `excel-analysis`, `developer-growth-analysis`, `artifacts-builder`, `decrypt-secrets`, `using-superpowers`
- Note: Some were intentionally excluded per ROADMAP "Deferred Items." Others may have been missed.

### Hooks (2 missing)

- `stop-serena-dashboard.js` (sonash-specific, probably exclude)
- `gsd-check-update.js` and `statusline.js` (global hooks, may not apply)

### Pre-commit/Pre-push Waves (8 missing from pre-commit, 3 from pre-push)

- Pre-commit waves 4-11: CANON schema, skill validation, cross-doc deps, doc index auto-update, doc headers, agent compliance, debt schema
- Pre-push: pattern compliance diff, propagation check, trigger checker

### GitHub Workflows (7 missing)

- `cleanup-branches.yml`, `pattern-compliance-audit.yml`, `resolve-debt.yml`, `review-check.yml`, `sync-readme.yml`, `validate-plan.yml`, `deploy-firebase.yml` (app-specific, exclude)

### Scripts (~70 potentially missing)

- Audit scripts (10), multi-AI scripts (6), MCP server, metrics, velocity tracking, secrets management, and ~40 standalone scripts
- Many may contain sonash-specific references that need sanitization

### Config/Supporting Files

- `.markdownlint.json`, `.qodo/pr-agent.toml` (expanded), `knip.json`, `.mcp.json.example`
- `.claude/` documentation: `COMMAND_REFERENCE.md`, `CROSS_PLATFORM_SETUP.md`, `HOOKS.md`, `REQUIRED_PLUGINS.md`, `STATE_SCHEMA.md`
- Skill shared utilities: `_shared/AUDIT_TEMPLATE.md`, `_shared/SKILL_STANDARDS.md`

## Sanitization Complexity

The user explicitly warned: "this takes more than a semantic search." Confirmed — sonash-specific content includes:

1. **Explicit references**: "sonash", "SoNash", "Sober Nashville", app-specific URLs, Firebase project IDs
2. **Implicit references**: Next.js/React/Firebase-specific patterns baked into generic tools, doc paths referencing app structure (`components/`, `app/`, `lib/`)
3. **Content assumptions**: Audit checkers that look for app-specific directories, config files with app-specific paths, test protocols tied to app UI
4. **Domain terminology**: Recovery journal concepts embedded in examples, test data, or documentation
5. **Cross-references**: Skills referencing other skills by sonash-specific configurations, doc dependencies mapped to app structure

Sanitization requires reading each file, understanding its purpose, identifying both explicit AND implicit app-specific content, and either removing it, replacing with generic placeholders, or making it configurable.

## Reframe Check

**The task is bigger than it appears.** The user framed this as "migration + sync," but it's actually four distinct problem domains:

1. **Gap Analysis & Migration** — What's missing, what needs porting, what's intentionally excluded
2. **Deep Sanitization** — Not just find/replace; requires understanding context to identify implicit app-specific content
3. **Upstream Sync Mechanism** — Ongoing process to pull improvements from sonash (which is "constantly being improved")
4. **Framework Parameterization** — Making migrated tools configurable so they work for ANY project, not just sonash patterns hardcoded as defaults

Additionally, the user mentioned a future "interactive app/repo creation layer" — this means the framework needs to be designed for extensibility from the start, not just as a static collection of files.

**Recommendation:** Proceed as stated, but scope this deep-plan to cover the FULL framework strategy (all 4 domains above). The plan will likely produce multiple execution phases that feed into GSD. This is not a single sprint — it's a project roadmap in itself.
