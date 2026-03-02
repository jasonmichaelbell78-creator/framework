# Hook Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines the structure, registration, and behavioral requirements for all Claude
Code hooks in `.claude/hooks/` and their shared libraries in `.claude/hooks/lib/`.

---

## Purpose

Establish consistent patterns for hook development so that hooks are reliable,
safe, and maintainable. Hooks are event-driven automation that fires at specific
points in the Claude Code session lifecycle. A misbehaving hook can crash or
block an entire Claude session, making reliability the primary concern.

---

## Scope

This standard applies to:

- All hook scripts in `.claude/hooks/`
- Shared hook libraries in `.claude/hooks/lib/`
- Hook registration entries in `.claude/settings.json`

This standard does NOT apply to:

- Git hooks in `.husky/` (governed by Husky conventions)
- CI/CD workflows in `.github/workflows/`
- Build scripts in `scripts/`

---

## Requirements

### Event Types

Claude Code supports 5 hook event types. Each hook MUST be registered under the
correct event type in `.claude/settings.json`:

| Event Type         | Fires When                              | Use Cases                                  |
| ------------------ | --------------------------------------- | ------------------------------------------ |
| `SessionStart`     | Session begins or resumes after compact | State init, dependency checks, restoration |
| `PreToolUse`       | Before a tool executes                  | Block dangerous commands, validate inputs  |
| `PostToolUse`      | After a tool completes                  | Track commits, validate writes, log reads  |
| `PreCompact`       | Before context compaction               | Save state snapshots for recovery          |
| `UserPromptSubmit` | When user submits a prompt              | Prompt processing, context injection       |

1. Hooks MUST only register for event types where they have a clear purpose.
2. Hooks MUST NOT register for multiple unrelated event types in a single script.

### File Structure

3. Hook scripts MUST be placed in `.claude/hooks/`.
4. Hook scripts MUST use lowercase-kebab-case naming with `.js` extension
   (e.g., `session-start.js`, `block-push-to-main.js`).
5. Hook scripts MUST begin with a shebang line: `#!/usr/bin/env node`.
6. Hook scripts MUST include a JSDoc comment block describing the hook's
   purpose, event type, and behavior.

### Registration in settings.json

Each hook MUST be registered in `.claude/settings.json` under the appropriate
event type:

```json
{
  "hooks": {
    "EventType": [
      {
        "matcher": "^(?i)bash$",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/hook-name.js",
            "statusMessage": "Description of what hook is doing..."
          }
        ]
      }
    ]
  }
}
```

7. The `type` field MUST be `"command"`.
8. The `command` field MUST use `node .claude/hooks/` prefix for hook scripts.
9. The `statusMessage` field SHOULD describe the hook's action in present
   participle form (e.g., "Checking push target...").
10. Hooks that accept tool input MUST use `$ARGUMENTS` placeholder in the
    command string.
11. The `matcher` field SHOULD use case-insensitive regex (`(?i)`) when matching
    tool names.

### Matchers

12. `SessionStart` hooks MAY use the `"compact"` matcher to fire only on
    post-compaction restoration.
13. `PreToolUse` and `PostToolUse` hooks MUST specify a `matcher` to target
    specific tools.
14. Hooks without a matcher fire for all events of that type and SHOULD be used
    sparingly.

### Error Handling

15. Hooks MUST NOT crash Claude sessions. All top-level code MUST be wrapped in
    try/catch with a safe exit.
16. Hooks MUST exit with code 0 on success and code 2 to block an action
    (PreToolUse only).
17. Hooks SHOULD use `continueOnError: true` in registration when the hook is
    non-critical.
18. Hooks MUST handle stdin read errors gracefully (fail-open for non-blocking
    hooks).
19. Hooks MUST guard against unexpectedly large stdin payloads (cap at 1 MB).

### Exit Codes

| Code | Meaning                          | Used By         |
| ---- | -------------------------------- | --------------- |
| 0    | Success / allow action           | All hooks       |
| 2    | Block action with stderr message | PreToolUse only |
| 1    | Error (logged, action continues) | All hooks       |

### Shared Libraries

The `.claude/hooks/lib/` directory contains 6 shared modules:

| Module               | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `git-utils.js`       | Git operations, project directory resolution |
| `inline-patterns.js` | Inline pattern matching for code analysis    |
| `rotate-state.js`    | JSONL/JSON rotation with atomic writes       |
| `sanitize-input.js`  | Input sanitization, secret redaction         |
| `state-utils.js`     | JSON state file load/save helpers            |
| `symlink-guard.js`   | Path validation against symlink attacks      |

20. Hooks SHOULD use shared libraries from `.claude/hooks/lib/` instead of
    reimplementing common patterns.
21. Shared libraries MUST use lowercase-kebab-case naming with `.js` extension.
22. Shared libraries MUST NOT have side effects on import (no auto-execution).
23. Shared libraries MUST export functions via `module.exports`.

### Skip Mechanism

24. Hooks that perform validation checks SHOULD respect the `SKIP_CHECKS`
    environment variable.
25. When `SKIP_CHECKS` is set, `SKIP_REASON` MUST also be provided to document
    why checks were skipped.
26. The skip mechanism SHOULD be logged so that skipped checks are auditable.

### Performance

27. Hooks MUST complete within their registered timeout (default: 10 seconds
    for most hooks).
28. Hooks SHOULD minimize filesystem reads and avoid network calls where
    possible.
29. Hooks MUST NOT install dependencies or run build processes (use
    `SessionStart` for setup tasks).

### Security

30. Hooks MUST use `sanitize-input.js` when logging or persisting user-provided
    data.
31. Hooks MUST use `symlink-guard.js` (`isSafeToWrite`) before any file write
    operation.
32. Hooks MUST NOT execute arbitrary user input as shell commands.

---

## Enforcement

| Mechanism          | Phase   | Description                                        |
| ------------------ | ------- | -------------------------------------------------- |
| ESLint rules       | Current | `framework/no-unsafe-error-access`,                |
|                    |         | `framework/require-symlink-guard` (planned)        |
| Validation script  | Phase 4 | `scripts/validate-hooks.js` checks structure,      |
|                    |         | registration, and shared library usage             |
| Pre-commit hook    | Phase 5 | Runs hook validation on changed hook files         |
| settings.json lint | Phase 4 | Validate registration entries match existing files |

**Current enforcement:** ESLint rules for error handling and security patterns.
**Planned enforcement:** Dedicated validation script (Phase 4) and pre-commit
integration (Phase 5).

---

## Escape Hatches

- **Emergency hooks:** During incident response, hooks MAY be added without
  full documentation. Add a comment `// EMERGENCY: [incident-id] -- formalize
within 1 week` at the top of the file.
- **Timeout override:** Hooks MAY specify custom timeouts in their registration
  entry when the default is insufficient. Document the reason in a comment.
- **Skip mechanism bypass:** The `SKIP_CHECKS` variable allows temporarily
  disabling validation hooks. MUST include `SKIP_REASON` for auditability.

---

## Version History

| Version | Date       | Description                                          |
| ------- | ---------- | ---------------------------------------------------- |
| 1.0     | 2026-03-02 | Initial standard based on 12 hooks and 6 shared libs |
