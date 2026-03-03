# Dependency Graph

<!-- prettier-ignore-start -->
**Generated:** 2026-03-03
**Total Edges:** 176
**Source:** `scripts/build-dependency-registry.js`
<!-- prettier-ignore-end -->

> This file is auto-generated from `CANON/DEPENDENCY_GRAPH.jsonl`.
> Do NOT edit directly. Run `node scripts/build-dependency-registry.js` to regenerate.

---

## Summary

### Edges by Relationship Type

| Type | Count |
| ---- | ----- |
| `requires` | 163 |
| `invokes` | 2 |
| `references` | 2 |
| `triggers` | 2 |
| `generates` | 2 |
| `validates` | 4 |
| `extends` | 1 |

### Edges by Confidence

| Confidence | Count |
| ---------- | ----- |
| high | 176 |

### Edges by Discovery Method

| Method | Count |
| ------ | ----- |
| auto | 161 |
| curated | 15 |

---

## Dependency Edges

### Hooks

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `.claude/hooks` | `.claude/hooks/lib` | requires | high |
| `.claude/hooks` | `.claude/settings.json` | references | high |
| `.claude/hooks/check-mcp-servers.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/check-remote-session-context.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/check-remote-session-context.js` | `.claude/hooks/lib/sanitize-input.js` | requires | high |
| `.claude/hooks/check-remote-session-context.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |
| `.claude/hooks/commit-tracker.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/commit-tracker.js` | `.claude/hooks/lib/rotate-state.js` | requires | high |
| `.claude/hooks/commit-tracker.js` | `.claude/hooks/lib/sanitize-input.js` | requires | high |
| `.claude/hooks/commit-tracker.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |
| `.claude/hooks/compact-restore.js` | `.claude/hooks/lib/sanitize-input.js` | requires | high |
| `.claude/hooks/post-read-handler.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/post-read-handler.js` | `.claude/hooks/lib/state-utils.js` | requires | high |
| `.claude/hooks/post-write-validator.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/post-write-validator.js` | `.claude/hooks/lib/inline-patterns.js` | requires | high |
| `.claude/hooks/post-write-validator.js` | `.claude/hooks/lib/sanitize-input.js` | requires | high |
| `.claude/hooks/post-write-validator.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |
| `.claude/hooks/post-write-validator.js` | `scripts/config/load-config.js` | requires | high |
| `.claude/hooks/post-write-validator.js` | `scripts/lib/validate-paths.js` | requires | high |
| `.claude/hooks/pre-compaction-save.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/pre-compaction-save.js` | `.claude/hooks/lib/state-utils.js` | requires | high |
| `.claude/hooks/session-start.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/session-start.js` | `.claude/hooks/lib/rotate-state.js` | requires | high |
| `.claude/hooks/session-start.js` | `.claude/hooks/lib/sanitize-input.js` | requires | high |
| `.claude/hooks/session-start.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |
| `.claude/hooks/track-agent-invocation.js` | `.claude/hooks/lib/git-utils.js` | requires | high |
| `.claude/hooks/track-agent-invocation.js` | `.claude/hooks/lib/rotate-state.js` | requires | high |
| `.claude/hooks/track-agent-invocation.js` | `.claude/hooks/lib/sanitize-input.js` | requires | high |
| `.claude/hooks/track-agent-invocation.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |
| `.claude/hooks/user-prompt-handler.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |

### Hook Libraries

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `.claude/hooks/lib/rotate-state.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |
| `.claude/hooks/lib/state-utils.js` | `.claude/hooks/lib/symlink-guard.js` | requires | high |

### Skills

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `.claude/skills` | `.claude/agents` | invokes | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/checkers/content-quality.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/checkers/coverage-completeness.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/checkers/generation-pipeline.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/checkers/index-registry-health.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/checkers/link-reference-integrity.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/lib/benchmarks.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/lib/patch-generator.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/lib/scoring.js` | requires | high |
| `.claude/skills/doc-ecosystem-audit/scripts/run-doc-ecosystem-audit.js` | `.claude/skills/doc-ecosystem-audit/scripts/lib/state-manager.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/checkers/cicd-pipeline.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/checkers/code-quality-security.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/checkers/config-health.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/checkers/functional-correctness.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/checkers/precommit-pipeline.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/checkers/state-integration.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/lib/benchmarks.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/lib/patch-generator.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/lib/scoring.js` | requires | high |
| `.claude/skills/hook-ecosystem-audit/scripts/run-hook-ecosystem-audit.js` | `.claude/skills/hook-ecosystem-audit/scripts/lib/state-manager.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/checkers/data-state-health.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/checkers/effectiveness-metrics.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/checkers/feedback-integration.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/checkers/pattern-lifecycle.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/checkers/process-compliance.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/lib/benchmarks.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/lib/patch-generator.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/lib/scoring.js` | requires | high |
| `.claude/skills/pr-ecosystem-audit/scripts/run-pr-ecosystem-audit.js` | `.claude/skills/pr-ecosystem-audit/scripts/lib/state-manager.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/checkers/code-quality.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/checkers/module-consistency.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/checkers/registration-reachability.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/checkers/safety-error-handling.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/checkers/testing-reliability.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/lib/benchmarks.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/lib/patch-generator.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/lib/scoring.js` | requires | high |
| `.claude/skills/script-ecosystem-audit/scripts/run-script-ecosystem-audit.js` | `.claude/skills/script-ecosystem-audit/scripts/lib/state-manager.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/checkers/compaction-resilience.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/checkers/cross-session-safety.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/checkers/integration-config.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/checkers/lifecycle-management.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/checkers/state-persistence.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/lib/benchmarks.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/lib/patch-generator.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/lib/scoring.js` | requires | high |
| `.claude/skills/session-ecosystem-audit/scripts/run-session-ecosystem-audit.js` | `.claude/skills/session-ecosystem-audit/scripts/lib/state-manager.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/checkers/agent-orchestration.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/checkers/coverage-consistency.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/checkers/cross-reference-integrity.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/checkers/staleness-drift.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/checkers/structural-compliance.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/lib/benchmarks.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/lib/patch-generator.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/lib/scoring.js` | requires | high |
| `.claude/skills/skill-ecosystem-audit/scripts/run-skill-ecosystem-audit.js` | `.claude/skills/skill-ecosystem-audit/scripts/lib/state-manager.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/checkers/data-quality-dedup.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/checkers/file-io-safety.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/checkers/metrics-reporting.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/checkers/pipeline-correctness.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/checkers/roadmap-integration.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/lib/benchmarks.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/lib/patch-generator.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/lib/scoring.js` | requires | high |
| `.claude/skills/tdms-ecosystem-audit/scripts/run-tdms-ecosystem-audit.js` | `.claude/skills/tdms-ecosystem-audit/scripts/lib/state-manager.js` | requires | high |

### Scripts

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `scripts` | `scripts/config` | references | high |
| `scripts` | `scripts/lib` | requires | high |
| `scripts/build-dependency-registry.js` | `CANON/DEPENDENCY_GRAPH.jsonl` | generates | high |
| `scripts/check-cross-doc-deps.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/check-cross-doc-deps.js` | `scripts/lib/validate-skip-reason.js` | requires | high |
| `scripts/check-doc-headers.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/check-doc-headers.js` | `scripts/lib/validate-skip-reason.js` | requires | high |
| `scripts/generate-documentation-index.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/trace-dependencies.js` | `CANON/DEPENDENCY_GRAPH.jsonl` | generates | high |

### Scripts (lib)

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `scripts/lib/ai-pattern-checks.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/lib/generate-content-hash.js` | `scripts/lib/normalize-file-path.js` | requires | high |

### Scripts (debt)

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `scripts/debt/assign-roadmap-refs.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/backfill-hashes.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/backfill-hashes.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/categorize-and-assign.js` | `scripts/lib/read-jsonl.js` | requires | high |
| `scripts/debt/categorize-and-assign.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/categorize-and-assign.js` | `scripts/lib/sanitize-error.js` | requires | high |
| `scripts/debt/check-phase-status.js` | `scripts/lib/sanitize-error.js` | requires | high |
| `scripts/debt/clean-intake.js` | `scripts/lib/read-jsonl.js` | requires | high |
| `scripts/debt/clean-intake.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/dedup-multi-pass.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/extract-audit-reports.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/extract-audit-reports.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/extract-audits.js` | `scripts/lib/normalize-category.js` | requires | high |
| `scripts/debt/extract-audits.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/extract-context-debt.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/extract-context-debt.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/extract-reviews.js` | `scripts/lib/normalize-category.js` | requires | high |
| `scripts/debt/extract-reviews.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/extract-roadmap-debt.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/extract-roadmap-debt.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/extract-scattered-debt.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/extract-scattered-debt.js` | `scripts/lib/normalize-file-path.js` | requires | high |
| `scripts/debt/extract-scattered-debt.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/generate-grand-plan.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/generate-metrics.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/generate-views.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/ingest-cleaned-intake.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/intake-audit.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/debt/intake-audit.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/intake-audit.js` | `scripts/lib/normalize-file-path.js` | requires | high |
| `scripts/debt/intake-audit.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/intake-manual.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/debt/intake-manual.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/intake-manual.js` | `scripts/lib/normalize-file-path.js` | requires | high |
| `scripts/debt/intake-manual.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/intake-manual.js` | `scripts/lib/security-helpers.js` | requires | high |
| `scripts/debt/intake-pr-deferred.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/debt/intake-pr-deferred.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/intake-pr-deferred.js` | `scripts/lib/normalize-file-path.js` | requires | high |
| `scripts/debt/intake-pr-deferred.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/normalize-all.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/debt/normalize-all.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/normalize-all.js` | `scripts/lib/normalize-file-path.js` | requires | high |
| `scripts/debt/normalize-all.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/process-review-needed.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/reconcile-roadmap.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/resolve-bulk.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/resolve-bulk.js` | `scripts/lib/security-helpers.js` | requires | high |
| `scripts/debt/resolve-item.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/reverify-resolved.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/sprint-complete.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/sprint-intake.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/sprint-status.js` | `scripts/lib/read-jsonl.js` | requires | high |
| `scripts/debt/sprint-status.js` | `scripts/lib/sanitize-error.js` | requires | high |
| `scripts/debt/sync-deduped.js` | `scripts/lib/security-helpers.js` | requires | high |
| `scripts/debt/sync-sonarcloud.js` | `scripts/lib/generate-content-hash.js` | requires | high |
| `scripts/debt/sync-sonarcloud.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/validate-schema.js` | `scripts/config/load-config.js` | requires | high |
| `scripts/debt/verify-resolutions.js` | `scripts/lib/safe-fs.js` | requires | high |
| `scripts/debt/verify-resolutions.js` | `scripts/lib/sanitize-error.js` | requires | high |

### CI Workflows

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `.github/workflows` | `scripts` | invokes | high |
| `.github/workflows/ci.yml` | `eslint-plugin-framework` | validates | high |

### CANON

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `CANON/schemas` | `CANON/standards` | extends | high |
| `CANON/standards` | `eslint-plugin-framework` | validates | high |
| `CANON/standards` | `scripts` | validates | high |

### Git Events

| Source | Target | Type | Confidence |
| ------ | ------ | ---- | ---------- |
| `.husky/pre-commit` | `eslint-plugin-framework` | validates | high |
| `git:commit` | `.husky/pre-commit` | triggers | high |
| `git:push` | `.husky/pre-push` | triggers | high |

---

*Auto-generated by `scripts/build-dependency-registry.js`*
