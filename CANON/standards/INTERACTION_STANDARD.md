# Interaction Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines UX patterns for interactive workflows, skills, and agent interactions in
the framework. Covers confirmation flows, progress reporting, output formatting,
and error recovery.

---

## Purpose

Establish consistent interaction patterns across all skills, agents, and
interactive workflows. Users MUST be able to predict how the framework will
behave during interactive operations, including when confirmation is required,
how progress is reported, and what output format to expect.

---

## Scope

This standard applies to:

- All skills in `.claude/skills/`
- All agents in `.claude/agents/`
- Interactive hooks that produce user-visible output
- Any workflow that involves multi-step execution with user interaction
- GSD plan execution, checkpoints, and continuation flows

---

## Requirements

### Confirmation Flows

**Destructive operations MUST require explicit confirmation before execution.**

Destructive operations include:

- Deleting files, directories, or data records
- Overwriting existing content without backup
- Resetting state (git reset, clearing caches, rotating logs)
- Deploying to production environments
- Running commands with side effects on external systems

Confirmation pattern:

1. **Present:** Describe what will happen, including scope and impact
2. **Confirm:** Request explicit approval (yes/no or approve/reject)
3. **Execute:** Proceed only after affirmative confirmation
4. **Report:** Show results after execution completes

Non-destructive operations (reads, analyses, reports) SHOULD NOT require
confirmation unless they are long-running (> 30 seconds estimated).

### Progress Indicators

Long-running operations SHOULD provide progress feedback:

- **Phase indicators:** Name the current phase of a multi-phase operation
  (e.g., "Scanning files...", "Analyzing dependencies...", "Generating report...")
- **Count progress:** Show item counts when processing collections
  (e.g., "Processing file 12/47...")
- **Elapsed time:** For operations exceeding 30 seconds, indicate elapsed time
- **Completion signal:** Always indicate when the operation finishes

Progress indicators MUST NOT produce excessive output. Limit updates to
meaningful phase transitions, not per-item noise.

### Checkpoint Pattern

Multi-step workflows MUST use the checkpoint pattern for operations that
require intermediate verification or decisions:

1. **Present:** Show completed work and next steps
2. **Verify:** Allow the user to inspect results before continuing
3. **Decide:** If a decision is needed, present options with tradeoffs
4. **Continue:** Resume execution after verification or decision

Checkpoint types:

| Type           | Purpose                          | User Action              |
| -------------- | -------------------------------- | ------------------------ |
| `human-verify` | Visual/functional verification   | Approve or report issues |
| `decision`     | Implementation choice needed     | Select from options      |
| `human-action` | Manual step required (auth, 2FA) | Complete and confirm     |

Checkpoints MUST include:

- Summary of completed work (tasks, commits, files modified)
- Current task status and what is blocked
- Clear instructions for what the user needs to do
- How to signal completion (what to type or click)

### Error Recovery

When an operation fails, the framework MUST offer recovery options:

- **Retry:** Attempt the same operation again (for transient failures)
- **Skip:** Skip the failed step and continue with the next (when safe)
- **Abort:** Cancel the entire workflow and roll back if possible

Error messages MUST include:

1. **What failed:** Specific operation that did not succeed
2. **Why it failed:** Root cause or error details (sanitized, no secrets)
3. **What to do:** Actionable next steps the user can take
4. **Recovery options:** Which of retry/skip/abort are available

Error messages MUST NOT:

- Expose raw stack traces to users (log them, do not display them)
- Include secrets, tokens, or credentials in error output
- Present technical jargon without explanation
- Leave the user without a clear next action

---

## Output Formatting

### Structure

All skill and agent output MUST follow this structure:

1. **Summary first:** Lead with a concise summary of results (1-3 lines)
2. **Details below:** Expand with specifics, tables, or code blocks as needed
3. **Actions last:** End with recommended next steps or follow-up commands

### File Paths

- File paths MUST be absolute or repo-relative (from the repository root)
- Paths MUST NOT use user-specific home directory prefixes in persisted output
- Paths SHOULD use forward slashes for consistency across platforms

### Tables

Use Markdown tables for multi-item comparisons or structured data:

- Tables MUST have a header row with column names
- Tables SHOULD be sorted by the most relevant column (severity, name, date)
- Tables with more than 20 rows SHOULD include a count summary above the table

### Code Blocks

- Code blocks MUST specify the language for syntax highlighting
- Code blocks SHOULD be kept concise (relevant excerpt, not full files)
- Long code blocks (> 30 lines) SHOULD include a summary comment at the top

---

## Skill Invocation Patterns

### Invocation Syntax

Skills are invoked using the `/skill-name` syntax:

- Skill names MUST use kebab-case (e.g., `/review-deps`, `/audit-code`)
- Parameters are passed as natural language after the skill name
- Skills MUST NOT require positional argument ordering

### Return Values

Skills MUST return one of:

- **Success message:** Clear confirmation of what was accomplished
- **Error with next steps:** What went wrong and what the user should do
- **Partial result:** What succeeded and what remains, with a path to completion

Skills MUST NOT return raw data dumps without context or explanation.

---

## Agent Interaction Patterns

### Spawn Protocol

When spawning an agent from a skill or workflow:

1. Provide clear input context (what the agent needs to know)
2. Specify the expected output format
3. Set scope boundaries (what the agent should and should not do)

### Return Protocol

Agents MUST return structured results as defined in the AGENT_STANDARD
(`CANON/standards/AGENT_STANDARD.md`):

- Frontmatter with status, confidence, and metadata
- Structured body with findings, recommendations, or deliverables
- Clear completion signal

### Error Propagation

When an agent encounters an error:

- The error MUST be propagated to the calling skill or workflow
- The calling context MUST apply the error recovery pattern (retry/skip/abort)
- Agent errors MUST NOT silently fail

---

## Enforcement

### Automated Checks

| Check                   | Mechanism                 | When             |
| ----------------------- | ------------------------- | ---------------- |
| Confirmation in skills  | Skill validation script   | Ecosystem audit  |
| Output structure        | Skill template compliance | Ecosystem audit  |
| Error handling presence | Static analysis           | Pre-commit       |
| Return value format     | Agent return schema check | Agent invocation |

### Manual Review

- New skills MUST be reviewed for interaction pattern compliance
- Skills that modify files or state MUST demonstrate confirmation flow
- Agent spawn patterns MUST include error propagation

---

## Examples

### Confirmation Flow

```
This will delete 3 stale JSONL files (247 records total):
  - .claude/state/agent-log.jsonl (89 records, last entry 45 days ago)
  - .claude/state/commit-log.jsonl (112 records, last entry 30 days ago)
  - .claude/state/hook-timing.jsonl (46 records, last entry 60 days ago)

Proceed? (yes/no)
```

### Error with Recovery

```
Failed to run dependency scan.

Error: trace-dependencies.js exited with code 1
Cause: Cannot resolve './lib/missing-module' from scripts/audit.js

Options:
  - Fix the import path and retry: /review-deps
  - Skip dependency scan and continue: /continue --skip-deps
  - Abort the current workflow: /abort
```

---

## Escape Hatches

- **Skipping confirmation:** For automated batch operations where the user has
  pre-approved the scope (e.g., GSD plan execution with `autonomous: true`),
  destructive operations MAY skip per-item confirmation while still logging each
  action.
- **Minimal progress output:** For operations that complete in under 5 seconds,
  progress indicators MAY be omitted entirely. A completion message is still
  REQUIRED.
- **Raw output mode:** Skills invoked with a `--raw` or `--json` flag MAY return
  unformatted output for programmatic consumption. This overrides the standard
  output structure requirements.

---

## References

- `CANON/standards/SKILL_STANDARDS.md` -- Skill structural requirements
- `CANON/standards/AGENT_STANDARD.md` -- Agent return format and protocols
- `CANON/standards/RECOVERY_STANDARD.md` -- Error recovery and resilience patterns

---

## Version History

| Version | Date       | Changes               |
| ------- | ---------- | --------------------- |
| 1.0     | 2026-03-02 | Initial CANON version |
