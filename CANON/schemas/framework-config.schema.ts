/**
 * Framework Config Schema
 *
 * Zod schema for framework.config.json validation. Defines the nested
 * structure for project identity and system configuration.
 *
 * NOTE: validateConfig() is created here for schema completeness but is
 * NOT wired into any runtime lifecycle yet. Runtime integration is
 * deferred to Phase 3 (Core Systems) or Phase 5 (Quality Gates).
 *
 * @module CANON/schemas/framework-config
 */

import { z } from 'zod';

// --- Sub-schemas ---

const projectSchema = z.object({
  /** Project name (required, non-empty) */
  name: z.string().min(1, 'Project name is required'),

  /** Repository identifier (e.g., "owner/repo") */
  repo: z.string().optional(),

  /** Runtime environment hint */
  environment: z.string().optional(),

  /** Human-readable project description */
  description: z.string().optional(),
});

const hooksPreCommitSchema = z.object({
  /** Pre-commit check preset level */
  preset: z.enum(['starter', 'standard', 'full']).default('standard'),
});

const hooksSessionStartSchema = z.object({
  /** Whether session-start hook is enabled */
  enabled: z.boolean().default(true),
});

const hooksSystemSchema = z.object({
  /** Session start hook configuration */
  sessionStart: hooksSessionStartSchema.default({ enabled: true }),

  /** Pre-commit hook configuration */
  preCommit: hooksPreCommitSchema.default({ preset: 'standard' }),
});

const skillsSystemSchema = z.object({
  /** Skills directory path */
  directory: z.string().default('.claude/skills'),

  /** Shared skills resources path */
  shared: z.string().default('.claude/skills/_shared'),
});

const agentsSystemSchema = z.object({
  /** Agents directory path */
  directory: z.string().default('.claude/agents'),
});

const scriptsSystemSchema = z.object({
  /** Scripts config directory path */
  configDir: z.string().default('scripts/config'),
});

const eslintSystemSchema = z.object({
  /** Custom ESLint plugin directory path */
  pluginDir: z.string().default('eslint-plugin-framework'),
});

const tdmsSystemSchema = z.object({
  /** Path to the master debt JSONL file */
  masterDebt: z.string().default('docs/technical-debt/MASTER_DEBT.jsonl'),
});

const systemsSchema = z.object({
  /** Git hooks configuration */
  hooks: hooksSystemSchema.default({
    sessionStart: { enabled: true },
    preCommit: { preset: 'standard' },
  }),

  /** Skills system configuration */
  skills: skillsSystemSchema.default({
    directory: '.claude/skills',
    shared: '.claude/skills/_shared',
  }),

  /** Agents system configuration */
  agents: agentsSystemSchema.default({
    directory: '.claude/agents',
  }),

  /** Scripts system configuration */
  scripts: scriptsSystemSchema.default({
    configDir: 'scripts/config',
  }),

  /** ESLint plugin configuration */
  eslint: eslintSystemSchema.default({
    pluginDir: 'eslint-plugin-framework',
  }),

  /** TDMS (Technical Debt Management System) configuration */
  tdms: tdmsSystemSchema.default({
    masterDebt: 'docs/technical-debt/MASTER_DEBT.jsonl',
  }),
});

// --- Main schema ---

/**
 * Framework configuration schema.
 *
 * Structure:
 * ```
 * {
 *   "project": { name, repo?, environment?, description? },
 *   "systems": { hooks, skills, agents, scripts, eslint, tdms }
 * }
 * ```
 */
export const frameworkConfigSchema = z.object({
  /** Project identity and metadata */
  project: projectSchema,

  /** System-level configuration */
  systems: systemsSchema.default({
    hooks: {
      sessionStart: { enabled: true },
      preCommit: { preset: 'standard' },
    },
    skills: {
      directory: '.claude/skills',
      shared: '.claude/skills/_shared',
    },
    agents: { directory: '.claude/agents' },
    scripts: { configDir: 'scripts/config' },
    eslint: { pluginDir: 'eslint-plugin-framework' },
    tdms: { masterDebt: 'docs/technical-debt/MASTER_DEBT.jsonl' },
  }),
});

/** TypeScript type inferred from the framework config schema */
export type FrameworkConfig = z.infer<typeof frameworkConfigSchema>;

/**
 * Validate unknown input against the framework config schema.
 *
 * NOTE: This function is defined for schema completeness. It is NOT
 * wired into any runtime lifecycle yet (session-start, pre-commit, etc.).
 * Runtime integration is deferred to Phase 3 or Phase 5.
 *
 * @param input - Unknown data to validate
 * @returns Validation result with parsed data or error messages
 */
export function validateConfig(input: unknown): {
  success: boolean;
  data?: FrameworkConfig;
  errors?: string[];
} {
  const result = frameworkConfigSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

  return { success: false, errors };
}
