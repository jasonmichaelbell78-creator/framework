/**
 * Base Record Schema
 *
 * Defines universal JSONL base fields that all framework record types
 * must include. Extracted from scripts/config/audit-schema.json patterns.
 *
 * @module CANON/schemas/base-record
 */

import { z } from 'zod';

/**
 * Universal base fields for all JSONL records in the framework.
 *
 * Required: id, timestamp, version
 * Optional: source, category, status
 */
export const baseRecordSchema = z.object({
  /** Unique identifier (UUID v4 format) */
  id: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      'Must be a valid UUID v4',
    ),

  /** ISO 8601 timestamp of record creation */
  timestamp: z.string().datetime({ message: 'Must be an ISO 8601 UTC timestamp' }),

  /** Semantic version of the record schema */
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be a valid semver string (e.g., 1.0.0)'),

  /** Origin system or process that created this record */
  source: z.string().optional(),

  /** Classification category for the record */
  category: z.string().optional(),

  /** Current lifecycle status of the record */
  status: z.string().optional(),
});

/** TypeScript type inferred from the base record schema */
export type BaseRecord = z.infer<typeof baseRecordSchema>;
