# Agent Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines the structure, naming, and behavioral requirements for all Claude Code
agent files in `.claude/agents/`.

---

## Purpose

Establish consistent structure and quality standards for agent definitions so
that agents are discoverable, predictable, and maintainable. Agents are
specialized AI personas invoked via the Task tool for focused workflows like
code review, debugging, and architecture decisions.

---

## Scope

This standard applies to:

- All agent files in `.claude/agents/`
- Companion files referenced by agents (REFERENCE.md, prompts.md)
- Agent invocation patterns and return protocols

This standard does NOT apply to:

- Skills (governed by `CANON/standards/SKILL_STANDARDS.md`)
- Hooks (governed by `CANON/standards/HOOK_STANDARD.md`)

---

## Requirements

### File Structure

1. Agent files MUST be placed in `.claude/agents/`.
2. Agent files MUST use lowercase-kebab-case naming with `.md` extension
   (e.g., `code-reviewer.md`, `backend-architect.md`).
3. Agent files MUST NOT be placed in subdirectories of `.claude/agents/`.

### YAML Frontmatter

Every agent file MUST begin with YAML frontmatter containing these fields:

```yaml
---
name: agent-name
description: >-
  Brief description of what this agent does and when to use it (1-3 sentences).
tools: Read, Write, Edit, Bash, Grep
model: sonnet
---
```

4. The `name` field MUST match the filename without extension.
5. The `description` field MUST be present and non-empty.
6. The `tools` field SHOULD list the tools the agent needs access to.
7. The `model` field SHOULD specify the model tier (e.g., `sonnet`, `opus`).

### Content Structure

8. After frontmatter, agents MUST include a role description paragraph
   explaining the agent's expertise and persona.
9. Agents MUST include an invocation section describing what happens when the
   agent is called (numbered steps).
10. Agents SHOULD include a checklist or criteria section defining the agent's
    evaluation framework.

### Size Limits

11. Agent core content MUST be under 300 lines (excluding companion files).
12. Agents between 300-499 lines SHOULD be refactored to extract content into
    companion files.
13. Agents at 500+ lines MUST be refactored -- this is an error condition.

### Companion Files

14. Agents MAY reference companion files for extended content (reference data,
    prompt libraries, examples).
15. Companion files SHOULD be named with the agent name as prefix
    (e.g., `code-reviewer-REFERENCE.md`).
16. Companion files MUST be placed in the same directory as the agent file.

### Return Protocol

17. Agents that produce structured output MUST end with a return statement
    following this format:

```
COMPLETE: [agent-id] wrote N findings to [output-path]
```

18. The return protocol SHOULD include a count of findings or artifacts
    produced.
19. Agents that do not produce file output MAY omit the return protocol.

### Behavioral Requirements

20. Agents MUST NOT modify files outside their declared scope without explicit
    instruction.
21. Agents SHOULD use the tools listed in their frontmatter and no others.
22. Agents MUST follow the project coding standards defined in `CLAUDE.md`.

---

## Enforcement

| Mechanism         | Phase   | Description                                      |
| ----------------- | ------- | ------------------------------------------------ |
| Validation script | Phase 4 | `scripts/validate-agents.js` checks frontmatter, |
|                   |         | naming, size limits, and required sections       |
| Pre-commit hook   | Phase 5 | Runs agent validation on changed agent files     |
| ESLint rule       | Future  | Optional: lint agent markdown structure          |
| Ecosystem audit   | Ongoing | `skill-ecosystem-audit` reviews agent compliance |

**Current enforcement:** Manual review during code review process.
**Planned enforcement:** Automated validation script (Phase 4) integrated into
pre-commit (Phase 5).

---

## Escape Hatches

- **Experimental agents:** Agents in active development MAY temporarily exceed
  size limits. Add a comment `<!-- OVERRIDE: size-limit -- [justification] -->`
  at the top of the file. Overrides MUST be resolved within 2 weeks.
- **Non-standard frontmatter:** Additional frontmatter fields MAY be added for
  specialized agents. The required fields (`name`, `description`) MUST still
  be present.

---

## Version History

| Version | Date       | Description                                       |
| ------- | ---------- | ------------------------------------------------- |
| 1.0     | 2026-03-02 | Initial standard based on 12 existing agent files |
