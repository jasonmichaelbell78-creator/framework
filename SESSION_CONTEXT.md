# Session Context

## Current Session

- **Session ID**: (auto-populated by session-start hook)
- **Started**: (auto-populated)
- **Branch**: feature/framework-skeleton
- **Focus**: Initial framework skeleton setup

## Active Work

- Porting dev workflow tooling from source repo
- Setting up quality gates and CI/CD
- Configuring Claude Code hooks, agents, and skills

## Recent Decisions

- All work on feature branch, not main
- Generic-first approach: port only non-project-specific tooling
- Sanitize all source-specific references during porting
- Dual-format ROADMAP (JSONL for AI, MD for human)

## Known Issues

- npm dependencies not yet installed (npm ci needed after initial commit)
- Some scripts reference other scripts that may not exist yet (ROADMAP deferred items)
- ESLint plugin needs testing after npm install

## Quick Reference

- **Pre-commit**: ESLint + tests (parallel), lint-staged, circular deps
- **Pre-push**: Circular deps, type check, security audit, code-reviewer gate
- **Skills**: 50+ in .claude/skills/ (invoke with /skill-name)
- **Agents**: 12 in .claude/agents/
