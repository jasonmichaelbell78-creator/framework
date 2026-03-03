#!/usr/bin/env node
/**
 * build-dependency-registry.js
 *
 * Builds the dependency registry (DEPENDENCY_GRAPH.jsonl + DEPENDENCY_GRAPH.md)
 * from two sources:
 *   1. Auto-discovered code dependencies via trace-dependencies.js
 *   2. Curated system-level edges hardcoded in this script
 *
 * Output:
 *   - CANON/DEPENDENCY_GRAPH.jsonl  (machine-readable registry)
 *   - CANON/DEPENDENCY_GRAPH.md     (human-readable view)
 *
 * Usage: node scripts/build-dependency-registry.js [--source <path>]
 *
 * Exit Codes:
 *   0 - Success
 *   1 - Error during execution
 */

'use strict';

const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const sourceIdx = args.indexOf('--source');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = (() => {
  if (sourceIdx === -1 || !args[sourceIdx + 1]) return PROJECT_ROOT;
  const resolved = path.resolve(args[sourceIdx + 1]);
  const rel = path.relative(PROJECT_ROOT, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    process.stderr.write(`ERROR: --source must be inside project root: ${resolved}\n`);
    process.exit(1);
  }
  return resolved;
})();

const JSONL_PATH = path.join(SOURCE_ROOT, 'CANON', 'DEPENDENCY_GRAPH.jsonl');
const MD_PATH = path.join(SOURCE_ROOT, 'CANON', 'DEPENDENCY_GRAPH.md');
const TRACE_SCRIPT = path.join(SOURCE_ROOT, 'scripts', 'trace-dependencies.js');

// Use safe-fs for atomic writes
let safeAtomicWriteSync;
try {
  ({ safeAtomicWriteSync } = require(path.join(__dirname, 'lib', 'safe-fs.js')));
} catch {
  // Fallback: manual tmp+rename pattern
  safeAtomicWriteSync = (filePath, data) => {
    const absPath = path.resolve(filePath);
    const tmpPath = `${absPath}.tmp.${process.pid}`;
    try {
      fs.writeFileSync(tmpPath, data, 'utf8');
      fs.renameSync(tmpPath, absPath);
    } catch (err) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {
        /* cleanup best-effort */
      }
      throw err;
    }
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalise path to forward slashes and make relative to SOURCE_ROOT. */
function toRelative(absPath) {
  return path.relative(SOURCE_ROOT, absPath).replaceAll('\\', '/');
}

/** Create a JSONL dependency record. */
function makeRecord(source, target, type, confidence, metadata) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    version: '1.0.0',
    source,
    target,
    type,
    confidence,
    metadata: metadata || {},
  };
}

// ---------------------------------------------------------------------------
// Step 1: Run trace-dependencies.js and collect code edges
// ---------------------------------------------------------------------------

function discoverCodeDependencies() {
  process.stderr.write('Running trace-dependencies.js...\n');

  let stdout;
  try {
    stdout = execFileSync(process.execPath, [TRACE_SCRIPT], {
      cwd: SOURCE_ROOT,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`ERROR: trace-dependencies.js failed: ${msg}\n`);
    process.exit(1);
  }

  let traceData;
  try {
    traceData = JSON.parse(stdout);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`ERROR: Failed to parse trace-dependencies output: ${msg}\n`);
    process.exit(1);
  }

  const records = [];
  const graph = traceData.fullGraph || {};

  for (const [absSource, node] of Object.entries(graph)) {
    const relSource = toRelative(absSource);

    // Code-level requires edges (file -> file)
    for (const absTarget of node.requires || []) {
      const relTarget = toRelative(absTarget);

      // Skip self-referential edges
      if (relSource === relTarget) continue;

      records.push(
        makeRecord(relSource, relTarget, 'requires', 'high', {
          discoveredBy: 'auto',
          method: 'import-scan',
        }),
      );
    }
  }

  process.stderr.write(`  Found ${records.length} code dependency edges\n`);
  return records;
}

// ---------------------------------------------------------------------------
// Step 2: Curated system-level edges
// ---------------------------------------------------------------------------

function getCuratedEdges() {
  const curated = (source, target, type, description) =>
    makeRecord(source, target, type, 'high', { discoveredBy: 'curated', description });

  const edges = [
    curated(
      '.claude/hooks',
      '.claude/hooks/lib',
      'requires',
      'Hook system requires shared hook libraries',
    ),
    curated(
      '.claude/hooks',
      '.claude/settings.json',
      'references',
      'Hooks are registered and configured in settings.json',
    ),
    curated(
      '.claude/skills',
      '.claude/agents',
      'invokes',
      'Skills invoke specialized agents for complex tasks',
    ),
    curated(
      '.husky/pre-commit',
      'eslint-plugin-framework',
      'validates',
      'Pre-commit hook runs ESLint with framework plugin rules',
    ),
    curated(
      '.github/workflows',
      'scripts',
      'invokes',
      'CI workflows invoke project scripts for linting, testing, audits',
    ),
    curated(
      '.github/workflows/ci.yml',
      'eslint-plugin-framework',
      'validates',
      'CI workflow runs ESLint with framework plugin',
    ),
    curated(
      'CANON/standards',
      'scripts',
      'validates',
      'CANON standards are enforced by project scripts',
    ),
    curated(
      'CANON/standards',
      'eslint-plugin-framework',
      'validates',
      'CANON standards are enforced by custom ESLint rules',
    ),
    curated(
      'CANON/schemas',
      'CANON/standards',
      'extends',
      'Schemas implement validation for standards',
    ),
    curated('scripts', 'scripts/lib', 'requires', 'Root scripts use shared library modules'),
    curated(
      'scripts',
      'scripts/config',
      'references',
      'Scripts load configuration from scripts/config/',
    ),
    curated(
      'git:commit',
      '.husky/pre-commit',
      'triggers',
      'Git commit triggers the pre-commit hook',
    ),
    curated('git:push', '.husky/pre-push', 'triggers', 'Git push triggers the pre-push hook'),
    curated(
      'scripts/trace-dependencies.js',
      'CANON/DEPENDENCY_GRAPH.jsonl',
      'generates',
      'trace-dependencies output feeds the dependency registry',
    ),
    curated(
      'scripts/build-dependency-registry.js',
      'CANON/DEPENDENCY_GRAPH.jsonl',
      'generates',
      'build-dependency-registry creates the JSONL and MD views',
    ),
  ];

  process.stderr.write(`  Added ${edges.length} curated system-level edges\n`);
  return edges;
}

// ---------------------------------------------------------------------------
// Step 3: Deduplicate edges
// ---------------------------------------------------------------------------

function deduplicateEdges(records) {
  const seen = new Set();
  const deduped = [];

  for (const record of records) {
    const key = `${record.source}|${record.target}|${record.type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(record);
  }

  const removed = records.length - deduped.length;
  if (removed > 0) {
    process.stderr.write(`  Deduplicated: removed ${removed} duplicate edges\n`);
  }
  return deduped;
}

// ---------------------------------------------------------------------------
// Step 4: Write JSONL
// ---------------------------------------------------------------------------

function writeJsonl(records) {
  fs.mkdirSync(path.dirname(JSONL_PATH), { recursive: true });

  const content = records.map((r) => JSON.stringify(r)).join('\n') + '\n';
  safeAtomicWriteSync(JSONL_PATH, content);
  process.stderr.write(
    `  Wrote ${records.length} records to ${path.relative(SOURCE_ROOT, JSONL_PATH)}\n`,
  );
}

// ---------------------------------------------------------------------------
// Step 5: Generate Markdown view
// ---------------------------------------------------------------------------

function generateMarkdown(records) {
  const lines = [];
  const now = new Date().toISOString().replace(/T.*/, '');

  lines.push(
    '# Dependency Graph',
    '',
    '<!-- prettier-ignore-start -->',
    `**Generated:** ${now}`,
    `**Total Edges:** ${records.length}`,
    '**Source:** `scripts/build-dependency-registry.js`',
    '<!-- prettier-ignore-end -->',
    '',
    '> This file is auto-generated from `CANON/DEPENDENCY_GRAPH.jsonl`.',
    '> Do NOT edit directly. Run `node scripts/build-dependency-registry.js` to regenerate.',
    '',
    '---',
    '',
  );

  // --- Summary by type ---
  const byType = {};
  const byConfidence = {};
  const byDiscovery = {};

  for (const r of records) {
    byType[r.type] = (byType[r.type] || 0) + 1;
    byConfidence[r.confidence] = (byConfidence[r.confidence] || 0) + 1;
    const method = r.metadata?.discoveredBy || 'unknown';
    byDiscovery[method] = (byDiscovery[method] || 0) + 1;
  }

  lines.push(
    '## Summary',
    '',
    '### Edges by Relationship Type',
    '',
    '| Type | Count |',
    '| ---- | ----- |',
  );
  for (const type of [
    'requires',
    'invokes',
    'references',
    'triggers',
    'generates',
    'validates',
    'extends',
  ]) {
    if (byType[type]) lines.push(`| \`${type}\` | ${byType[type]} |`);
  }

  lines.push('', '### Edges by Confidence', '', '| Confidence | Count |', '| ---------- | ----- |');
  for (const conf of ['high', 'medium', 'low']) {
    if (byConfidence[conf]) lines.push(`| ${conf} | ${byConfidence[conf]} |`);
  }

  lines.push('', '### Edges by Discovery Method', '', '| Method | Count |', '| ------ | ----- |');
  for (const [method, count] of Object.entries(byDiscovery).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${method} | ${count} |`);
  }

  lines.push('', '---', '', '## Dependency Edges', '');

  // Group by source system (first path segment or prefix)
  const groups = {};
  for (const r of records) {
    const system = categorizeSource(r.source);
    if (!groups[system]) groups[system] = [];
    groups[system].push(r);
  }

  // Sort groups for consistent output
  const groupOrder = [
    'Hooks',
    'Hook Libraries',
    'Skills',
    'Agents',
    'Scripts',
    'Scripts (lib)',
    'Scripts (config)',
    'Scripts (debt)',
    'ESLint Plugin',
    'CI Workflows',
    'CANON',
    'Git Events',
    'Other',
  ];

  const sortedGroups = Object.keys(groups).sort((a, b) => {
    const ai = groupOrder.indexOf(a);
    const bi = groupOrder.indexOf(b);
    const aIdx = ai === -1 ? 999 : ai;
    const bIdx = bi === -1 ? 999 : bi;
    return aIdx - bIdx;
  });

  for (const group of sortedGroups) {
    const edges = groups[group];
    lines.push(
      `### ${group}`,
      '',
      '| Source | Target | Type | Confidence |',
      '| ------ | ------ | ---- | ---------- |',
    );
    for (const e of edges.sort(
      (a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target),
    )) {
      lines.push(`| \`${e.source}\` | \`${e.target}\` | ${e.type} | ${e.confidence} |`);
    }
    lines.push('');
  }

  lines.push('---', '', '*Auto-generated by `scripts/build-dependency-registry.js`*', '');

  const content = lines.join('\n');
  safeAtomicWriteSync(MD_PATH, content);
  process.stderr.write(`  Wrote markdown view to ${path.relative(SOURCE_ROOT, MD_PATH)}\n`);
}

/** Prefix-to-group mappings for source categorization, ordered longest-first. */
const SOURCE_GROUP_PREFIXES = [
  ['git:', 'Git Events'],
  ['.claude/hooks/lib/', 'Hook Libraries'],
  ['.claude/hooks/', 'Hooks'],
  ['.claude/hooks', 'Hooks'],
  ['.claude/skills/', 'Skills'],
  ['.claude/agents/', 'Agents'],
  ['.github/workflows/', 'CI Workflows'],
  ['.husky/', 'Git Events'],
  ['eslint-plugin-framework/', 'ESLint Plugin'],
  ['eslint-plugin-framework', 'ESLint Plugin'],
  ['CANON/', 'CANON'],
  ['scripts/lib/', 'Scripts (lib)'],
  ['scripts/config/', 'Scripts (config)'],
  ['scripts/debt/', 'Scripts (debt)'],
  ['scripts/', 'Scripts'],
  ['scripts', 'Scripts'],
];

/** Categorize a source path into a human-readable system group. */
function categorizeSource(source) {
  for (const [prefix, group] of SOURCE_GROUP_PREFIXES) {
    if (source.startsWith(prefix)) return group;
  }
  return 'Other';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  process.stderr.write(`Building dependency registry from: ${SOURCE_ROOT}\n`);
  process.stderr.write('---\n');

  // Discover code dependencies
  const codeDeps = discoverCodeDependencies();

  // Add curated system-level edges
  const curatedDeps = getCuratedEdges();

  // Combine and deduplicate
  const allRecords = deduplicateEdges([...codeDeps, ...curatedDeps]);

  process.stderr.write('---\n');
  process.stderr.write(`Total edges: ${allRecords.length}\n`);

  // Write outputs
  writeJsonl(allRecords);
  generateMarkdown(allRecords);

  process.stderr.write('---\n');
  process.stderr.write('Done.\n');
}

try {
  main();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`FATAL: ${msg}\n`);
  process.exit(1);
}
