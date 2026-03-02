# Audit Standard

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** ACTIVE
<!-- prettier-ignore-end -->

Defines the framework's audit methodology for system and ecosystem audits.
This standard governs how audits are conducted, what they must produce, and
how results are scored and persisted.

> **Note:** This standard defines audit _methodology_. For audit report
> _output format and boilerplate_, see `CANON/templates/AUDIT_TEMPLATE.md`.

---

## Purpose

Establish a consistent, repeatable methodology for all audits performed within
the framework. Audits are the primary mechanism for discovering technical debt,
security vulnerabilities, standards violations, and improvement opportunities.

---

## Scope

This standard applies to:

- All audits run by audit agents (e.g., `audit-code`, `audit-security`, `audit-performance`)
- All audits run by orchestrators (e.g., `skill-ecosystem-audit`)
- Both single-session and multi-session audit workflows
- Manual and automated audit processes

---

## Requirements

### Audit Taxonomy

All audits MUST be classified into one of the following categories:

| Category        | Description                                           | Example Skills          |
| --------------- | ----------------------------------------------------- | ----------------------- |
| **ecosystem**   | Structural health of a system (skills, scripts, etc.) | `skill-ecosystem-audit` |
| **security**    | Vulnerability and threat assessment                   | `audit-security`        |
| **compliance**  | Adherence to external regulations or internal policy  | `audit-process`         |
| **standards**   | Conformance to CANON standards                        | `audit-code`            |
| **performance** | Runtime efficiency and optimization opportunities     | `audit-performance`     |
| **engineering** | Developer productivity and workflow effectiveness     | `audit-engineering`     |

Audits MAY span multiple categories when the scope warrants it. In such cases,
each finding MUST be tagged with its primary category.

### Required Components

Every audit MUST produce the following components:

1. **Summary** -- A concise overview of scope, methodology, and key findings
2. **Findings List** -- Individual issues with structured metadata
3. **Severity Classification** -- Each finding classified using the severity scale below
4. **Recommendations** -- Actionable remediation guidance for each finding

Every audit SHOULD also produce:

5. **Scoring** -- An overall quality/health score for the audited system
6. **Trend Data** -- Comparison with prior audit results when available

### Severity Levels

All findings MUST use this severity scale:

| Level  | Name          | Definition                                                  |
| ------ | ------------- | ----------------------------------------------------------- |
| **S0** | Blocker       | Prevents correct operation; MUST fix before next release    |
| **S1** | High          | Significant risk or degradation; SHOULD fix within 1 sprint |
| **S2** | Medium        | Moderate impact; fix within normal backlog prioritization   |
| **S3** | Low           | Minor issue; fix when convenient                            |
| **S4** | Informational | Observation or suggestion; no action required               |

S0 and S1 findings MUST undergo dual-pass verification before reporting
(see `CANON/templates/AUDIT_TEMPLATE.md` for verification procedure).

### Scoring Methodology

Audits that produce a quality score MUST use this methodology:

1. **Base score**: Start at 100
2. **Deductions**: S0 = -25, S1 = -15, S2 = -5, S3 = -2, S4 = 0
3. **Floor**: Minimum score is 0
4. **Pass/fail threshold**: Score >= 60 = PASS, < 60 = FAIL
5. **Grade bands**: A (90-100), B (80-89), C (70-79), D (60-69), F (0-59)

Scores SHOULD be compared against prior audits to track trend direction.

### JSONL Output

Audit results MUST be persisted as JSONL records. Each record MUST include:

- `category` -- Audit category from the taxonomy above
- `fingerprint` -- Unique identifier: `<category>::<primary_file>::<identifier>`
- `severity` -- Severity level (S0-S4)
- `confidence` -- Numeric confidence score (0-100)
- `files` -- Array of affected file paths with line numbers
- `acceptance_tests` -- Non-empty array of verification steps

Records SHOULD follow the base-record schema defined in `JSONL_SCHEMA_STANDARD.md`.

### Markdown Report

Audit results SHOULD generate a human-readable markdown report using
`CANON/templates/AUDIT_TEMPLATE.md` as the output template. The report
provides structured presentation of findings for interactive review.

---

## Enforcement

The audit orchestrator validates output against this standard:

- JSONL records are checked for required fields before persistence
- Severity classifications are validated against the defined scale
- S0/S1 findings are rejected without dual-pass verification evidence
- `scripts/validate-audit.js` enforces schema compliance

---

## Escape Hatches

Partial audits are acceptable when scoped and documented:

- **Scoped audits**: An audit MAY cover a subset of the full system when the scope is declared upfront (e.g., "security audit of authentication module only")
- **Deferred components**: An audit MAY defer scoring or trend analysis when no prior baseline exists, noting "baseline audit -- no trend data available"
- **Emergency audits**: In incident response, an audit MAY skip interactive review and proceed directly to TDMS intake, noting "emergency audit -- review deferred"

All escape hatches MUST be documented in the audit report summary.

---

## Version History

| Version | Date       | Description                             |
| ------- | ---------- | --------------------------------------- |
| 1.0     | 2026-03-02 | Initial creation as 10th CANON standard |
