# [JSONL Schema Name]

<!-- prettier-ignore-start -->
**Document Version:** 1.0
**Last Updated:** [TODO: YYYY-MM-DD]
**Status:** DRAFT
**Related:** CANON/schemas/base-record.schema.ts
<!-- prettier-ignore-end -->

[TODO: One-line description of what data this JSONL schema defines.]

---

## Overview

[TODO: Describe the purpose of this JSONL file, what data it stores, and how it fits into the system. All JSONL schemas extend the base record defined in `CANON/schemas/base-record.schema.ts`.]

---

## Fields

| Field     | Type   | Required | Description                                          |
| --------- | ------ | -------- | ---------------------------------------------------- |
| id        | string | Yes      | [TODO: ID format, e.g., UUID or prefixed identifier] |
| timestamp | string | Yes      | ISO 8601 datetime of record creation                 |
| version   | string | Yes      | Schema version (semver)                              |
| [TODO]    | [TODO] | [TODO]   | [TODO: Field description]                            |
| [TODO]    | [TODO] | [TODO]   | [TODO: Field description]                            |

---

## Example Record

```json
{
  "id": "[TODO: example-id]",
  "timestamp": "2026-01-01T00:00:00Z",
  "version": "1.0.0",
  "[TODO: field]": "[TODO: value]"
}
```

---

## Validation

[TODO: Describe how records are validated. Reference the Zod schema if one exists.]

- **Schema file:** [TODO: path to .schema.ts file, or "None yet"]
- **Validation script:** [TODO: path to validation script, or "None yet"]
- **Base record fields:** Inherited from `CANON/schemas/base-record.schema.ts`

---

## Related Schemas

- [base-record.schema.ts](../schemas/base-record.schema.ts) -- Universal base record all JSONL schemas extend
- [TODO: Related schema name](TODO: relative path) -- [TODO: relationship]

---

## Version History

| Version | Date   | Description            |
| ------- | ------ | ---------------------- |
| 1.0     | [TODO] | Initial implementation |
