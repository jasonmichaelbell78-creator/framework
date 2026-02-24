# Framework Implementation Plan

## Overview

A CLI-based project scaffolding framework that uses a **subtractive model**: the framework ships all templates and the init script removes what doesn't apply. Developers can browse the full `templates/` directory before running init to understand what they'll get.

---

## Phase 1: CLI (Foundation — Must Complete First)

Three core files that must work before anything else:

### `init.mjs` — Entry Point
- Main CLI entry point invoked via `npx` or direct execution
- Orchestrates the scaffolding workflow
- Uses only Node.js built-in APIs (zero dependencies — runs immediately after fork)

### `cli/prompts.mjs` — User Interaction
- Collects project configuration from the user
- Project name, stack selection, feature toggles
- Uses Node.js built-in `readline` (no inquirer/prompts dependency)

### `cli/scaffolder.mjs` — File Operations
- Reads the full template directory
- Applies the subtractive model: copies everything, then removes files/directories that don't match the selected stack and features
- Performs template variable substitution across all files

### Design Constraints
- **Zero dependencies** — only Node.js built-in APIs
- Script runs immediately after fork with no install step
- All template processing happens at scaffold time, not runtime

---

## Phase 2: Next.js Template (Can Run in Parallel with Phase 3)

The Next.js template is the **first and reference implementation**. It establishes the pattern-implementation standard that all subsequent stack templates must follow:

### Standard Patterns (Required in Every Stack Template)
- **Database interface** — abstracted data access layer
- **Security wrapper** — authentication and authorization patterns
- **Error handling** — consistent error boundary and reporting
- **Logger** — structured logging utility

### Purpose
- Proves out the scaffolder with a real, working template
- Defines the contract that future stack templates (e.g., Remix, Astro, SvelteKit) must satisfy
- Ensures patterns are stack-agnostic at the interface level

---

## Phase 3: AI Workflow System (Can Run in Parallel with Phase 2)

The AI system is the **key differentiator** — it makes 25+ agents and 50+ skills from sonash-v0 reusable across any stack.

### Tag-Based Catalog System
- Each template directory contains `_catalog.json` files
- Catalogs define metadata, tags, and applicability rules for agents and skills
- Tags determine which agents/skills are included for a given stack and feature set

### Template Variable Substitution
Every agent and skill markdown file uses template variables to adapt to the chosen stack:
- `<%= projectName %>` — the user's project name
- `<%= stackDisplayName %>` — human-readable stack name (e.g., "Next.js", "Remix")
- Conditional blocks — sections that render only for specific stacks or features

### Architecture
- Agent definitions as markdown files with embedded instructions
- Skill definitions as markdown files with task-specific guidance
- All AI content is static and browsable — no runtime generation
- The subtractive model removes agents/skills that don't apply to the selected stack

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Subtractive model** (ship everything, remove what doesn't apply) | Easier to debug and maintain than generative scaffolding; developers can browse full templates before running init |
| **Zero dependencies** | Immediate usability after fork; no `npm install` required for the CLI itself |
| **Tag-based catalogs** | Flexible inclusion/exclusion of AI content without complex conditional logic |
| **Template variables in markdown** | Simple, auditable customization; no code generation or AST manipulation |
| **Pattern-implementation standard** | Each stack template implements the same interfaces, making agents/skills portable |

---

## Execution Order

```
Phase 1 (CLI)
    ├── Must complete first
    │
    ├──> Phase 2 (Next.js Template)  ── can run in parallel
    │
    └──> Phase 3 (AI Workflow System) ── can run in parallel
```

Phase 2 and Phase 3 are independent workstreams that both plug into Phase 1's scaffolder.
