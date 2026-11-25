#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';

const reportArgs = new Set(globalThis.process.argv.slice(2));
const shouldBuild = !reportArgs.has('--no-build');
const shouldCheckBudgets = reportArgs.has('--budget');
const reactQueryDevtoolsKey = 'node_modules/@tanstack/react-query-devtools/build/modern/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const manifestPath = path.join(distDir, '.vite', 'manifest.json');
const reportDir = path.join(distDir, 'reports');
const reportJsonPath = path.join(reportDir, 'performance-report.json');
const reportTextPath = path.join(reportDir, 'performance-report.txt');
const budgetsPath = path.join(projectRoot, 'performance-budgets.json');

await main();

async function main() {
  if (shouldBuild) {
    await runViteBuild();
  }

  const manifest = await readJson(manifestPath);
  const budgetsConfig = await readJson(budgetsPath);
  const fileMetrics = await collectFileMetrics(manifest);
  const sharedShell = analyzeSharedShell(manifest, fileMetrics);
  const routes = analyzeRoutes(manifest, fileMetrics, sharedShell.fileSet);
  const routeFamilies = summarizeRouteFamilies(routes);
  const optionalEntries = analyzeOptionalEntries(manifest, fileMetrics, sharedShell.fileSet);
  const optionalFeatureDomains = analyzeOptionalFeatureDomains(
    manifest,
    fileMetrics,
    sharedShell.fileSet,
    budgetsConfig.optionalFeatureDomains,
  );
  const budgets = evaluateBudgets(budgetsConfig, sharedShell, routes, optionalFeatureDomains);

  const report = {
    generatedAt: new Date().toISOString(),
    build: {
      command: 'vite build --manifest',
      manifestPath: toProjectRelative(manifestPath),
      reportJsonPath: toProjectRelative(reportJsonPath),
      reportTextPath: toProjectRelative(reportTextPath),
      budgetsPath: toProjectRelative(budgetsPath),
    },
    sharedShell: serializeAnalysis(sharedShell),
    routeFamilies,
    routes: routes.map(serializeAnalysis),
    optionalEntries: optionalEntries.map(serializeAnalysis),
    optionalFeatureDomains: optionalFeatureDomains.map(serializeDomainAnalysis),
    budgets,
  };

  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const summary = renderSummary(report);
  await fs.writeFile(reportTextPath, `${summary}\n`, 'utf8');

  globalThis.process.stdout.write(`${summary}\n`);

  if (shouldCheckBudgets && !budgets.passed) {
    globalThis.process.exitCode = 1;
  }
}

async function runViteBuild() {
  const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

  await runCommand(globalThis.process.execPath, [viteBin, 'build', '--manifest']);
}

async function runCommand(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: false,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(' ')}`));
    });
  });
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function collectFileMetrics(manifest) {
  const files = new Set();

  for (const manifestEntry of Object.values(manifest)) {
    addFiles(files, manifestEntry.file);
    addFiles(files, manifestEntry.css);
    addFiles(files, manifestEntry.assets);
  }

  if (await exists(path.join(distDir, 'index.html'))) {
    files.add('index.html');
  }

  const metrics = new Map();

  await Promise.all(
    [...files].map(async (file) => {
      const absolutePath = path.join(distDir, file);
      const buffer = await fs.readFile(absolutePath);

      metrics.set(file, {
        file,
        rawBytes: buffer.length,
        gzipBytes: gzipSync(buffer).length,
        brotliBytes: brotliCompressSync(buffer, {
          params: {
            [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
          },
        }).length,
      });
    }),
  );

  return metrics;
}

function analyzeSharedShell(manifest, fileMetrics) {
  const manifestKeys = collectStaticManifestKeys(manifest, ['index.html']);
  const fileSet = collectOutputFiles(manifest, manifestKeys);

  if (fileMetrics.has('index.html')) {
    fileSet.add('index.html');
  }

  return buildAnalysis({
    kind: 'shared-shell',
    label: 'shared-shell',
    sourceKey: 'index.html',
    family: 'shell',
    outputFile: manifest['index.html']?.file ?? null,
    entryChunk: metricForFile(fileMetrics, manifest['index.html']?.file),
    manifestKeys,
    fileSet,
    deltaFileSet: new Set(fileSet),
    fileMetrics,
  });
}

function analyzeRoutes(manifest, fileMetrics, sharedShellFiles) {
  return Object.entries(manifest)
    .filter(([key, manifestEntry]) => key.startsWith('src/pages/') && manifestEntry.isDynamicEntry)
    .map(([key, manifestEntry]) =>
      analyzeDynamicEntry({
        kind: 'route',
        label: formatLabel(key, 'src/pages/'),
        sourceKey: key,
        family: routeFamily(key),
        outputFile: manifestEntry.file,
        manifest,
        fileMetrics,
        sharedShellFiles,
      }),
    )
    .sort(compareByDeltaGzip);
}

function analyzeOptionalEntries(manifest, fileMetrics, sharedShellFiles) {
  return Object.entries(manifest)
    .filter(
      ([key, manifestEntry]) =>
        manifestEntry.isDynamicEntry &&
        !key.startsWith('src/pages/') &&
        key !== reactQueryDevtoolsKey,
    )
    .map(([key, manifestEntry]) =>
      analyzeDynamicEntry({
        kind: 'optional-entry',
        label: formatOptionalEntryLabel(key),
        sourceKey: key,
        family: optionalEntryFamily(key),
        outputFile: manifestEntry.file,
        manifest,
        fileMetrics,
        sharedShellFiles,
      }),
    )
    .sort(compareByDeltaGzip);
}

function analyzeOptionalFeatureDomains(manifest, fileMetrics, sharedShellFiles, domainBudgets) {
  return domainBudgets.map((domainBudget) => {
    const matchedEntryKeys = Object.keys(manifest)
      .filter((manifestKey) =>
        domainBudget.include.some((pattern) => manifestKey.includes(pattern)),
      )
      .sort();

    const manifestKeys = collectStaticManifestKeys(manifest, matchedEntryKeys);
    const fileSet = collectOutputFiles(manifest, manifestKeys);
    const deltaFileSet = subtractSets(fileSet, sharedShellFiles);

    return {
      label: domainBudget.label,
      include: [...domainBudget.include],
      maxDeltaGzipBytes: kibToBytes(domainBudget.maxDeltaGzipKiB),
      matchedEntryKeys,
      manifestKeys: [...manifestKeys].sort(),
      fileSet,
      deltaFileSet,
      payload: summarizeFiles(fileSet, fileMetrics),
      deltaFromSharedShell: summarizeFiles(deltaFileSet, fileMetrics),
    };
  });
}

function analyzeDynamicEntry({
  kind,
  label,
  sourceKey,
  family,
  outputFile,
  manifest,
  fileMetrics,
  sharedShellFiles,
}) {
  const manifestKeys = collectStaticManifestKeys(manifest, [sourceKey]);
  const fileSet = collectOutputFiles(manifest, manifestKeys);
  const deltaFileSet = subtractSets(fileSet, sharedShellFiles);

  return buildAnalysis({
    kind,
    label,
    sourceKey,
    family,
    outputFile,
    entryChunk: metricForFile(fileMetrics, outputFile),
    manifestKeys,
    fileSet,
    deltaFileSet,
    fileMetrics,
  });
}

function buildAnalysis({
  kind,
  label,
  sourceKey,
  family,
  outputFile,
  entryChunk,
  manifestKeys,
  fileSet,
  deltaFileSet,
  fileMetrics,
}) {
  return {
    kind,
    label,
    sourceKey,
    family,
    outputFile,
    entryChunk,
    manifestKeys: [...manifestKeys].sort(),
    fileSet,
    deltaFileSet,
    payload: summarizeFiles(fileSet, fileMetrics),
    deltaFromSharedShell: summarizeFiles(deltaFileSet, fileMetrics),
  };
}

function collectStaticManifestKeys(manifest, seedKeys) {
  const queue = [...seedKeys];
  const visited = new Set();

  while (queue.length > 0) {
    const currentKey = queue.pop();

    if (!currentKey || visited.has(currentKey) || !manifest[currentKey]) {
      continue;
    }

    visited.add(currentKey);

    for (const dependencyKey of manifest[currentKey].imports ?? []) {
      queue.push(dependencyKey);
    }
  }

  return visited;
}

function collectOutputFiles(manifest, manifestKeys) {
  const fileSet = new Set();

  for (const manifestKey of manifestKeys) {
    const manifestEntry = manifest[manifestKey];

    if (!manifestEntry) {
      continue;
    }

    addFiles(fileSet, manifestEntry.file);
    addFiles(fileSet, manifestEntry.css);
    addFiles(fileSet, manifestEntry.assets);
  }

  return fileSet;
}

function summarizeFiles(fileSet, fileMetrics) {
  const files = [...fileSet]
    .map((file) => metricForFile(fileMetrics, file))
    .filter(Boolean)
    .sort((left, right) => right.gzipBytes - left.gzipBytes || right.rawBytes - left.rawBytes);

  const totals = files.reduce(
    (accumulator, file) => ({
      rawBytes: accumulator.rawBytes + file.rawBytes,
      gzipBytes: accumulator.gzipBytes + file.gzipBytes,
      brotliBytes: accumulator.brotliBytes + file.brotliBytes,
    }),
    {
      rawBytes: 0,
      gzipBytes: 0,
      brotliBytes: 0,
    },
  );

  return {
    fileCount: files.length,
    totals,
    files,
  };
}

function summarizeRouteFamilies(routes) {
  const families = new Map();

  for (const route of routes) {
    const current = families.get(route.family) ?? {
      family: route.family,
      routeCount: 0,
      totalDeltaGzipBytes: 0,
      maxDeltaGzipBytes: 0,
      maxRouteLabel: null,
      maxRouteSourceKey: null,
    };

    current.routeCount += 1;
    current.totalDeltaGzipBytes += route.deltaFromSharedShell.totals.gzipBytes;

    if (route.deltaFromSharedShell.totals.gzipBytes > current.maxDeltaGzipBytes) {
      current.maxDeltaGzipBytes = route.deltaFromSharedShell.totals.gzipBytes;
      current.maxRouteLabel = route.label;
      current.maxRouteSourceKey = route.sourceKey;
    }

    families.set(route.family, current);
  }

  return [...families.values()]
    .map((family) => ({
      ...family,
      averageDeltaGzipBytes:
        family.routeCount > 0 ? Math.round(family.totalDeltaGzipBytes / family.routeCount) : 0,
    }))
    .sort((left, right) => right.maxDeltaGzipBytes - left.maxDeltaGzipBytes);
}

function evaluateBudgets(config, sharedShell, routes, optionalFeatureDomains) {
  const checks = [];

  const sharedShellMaxGzipBytes = kibToBytes(config.sharedShell.maxGzipKiB);
  checks.push({
    label: 'shared-shell',
    status: sharedShell.payload.totals.gzipBytes > sharedShellMaxGzipBytes ? 'fail' : 'pass',
    actualGzipBytes: sharedShell.payload.totals.gzipBytes,
    maxGzipBytes: sharedShellMaxGzipBytes,
  });

  const routeBudget = config.heavyRouteEntryBundles;
  const watchedRoutes = routes.filter((route) =>
    routeBudget.include.some((pattern) => route.sourceKey.includes(pattern)),
  );
  const failingRoutes = watchedRoutes.filter(
    (route) =>
      route.deltaFromSharedShell.totals.gzipBytes > kibToBytes(routeBudget.maxDeltaGzipKiB),
  );
  const heaviestWatchedRoute = watchedRoutes[0] ?? null;

  checks.push({
    label: 'heavy-route-entry-bundles',
    status: watchedRoutes.length === 0 ? 'missing' : failingRoutes.length > 0 ? 'fail' : 'pass',
    watchedEntryCount: watchedRoutes.length,
    actualMaxGzipBytes: heaviestWatchedRoute?.deltaFromSharedShell.totals.gzipBytes ?? 0,
    maxGzipBytes: kibToBytes(routeBudget.maxDeltaGzipKiB),
    maxObservedRoute: heaviestWatchedRoute
      ? {
          label: heaviestWatchedRoute.label,
          sourceKey: heaviestWatchedRoute.sourceKey,
          gzipBytes: heaviestWatchedRoute.deltaFromSharedShell.totals.gzipBytes,
        }
      : null,
    failingRoutes: failingRoutes.slice(0, 10).map((route) => ({
      label: route.label,
      sourceKey: route.sourceKey,
      gzipBytes: route.deltaFromSharedShell.totals.gzipBytes,
    })),
  });

  for (const domain of optionalFeatureDomains) {
    checks.push({
      label: `optional-feature-domain:${domain.label}`,
      status:
        domain.matchedEntryKeys.length === 0
          ? 'missing'
          : domain.deltaFromSharedShell.totals.gzipBytes > domain.maxDeltaGzipBytes
            ? 'fail'
            : 'pass',
      matchedEntryCount: domain.matchedEntryKeys.length,
      actualGzipBytes: domain.deltaFromSharedShell.totals.gzipBytes,
      maxGzipBytes: domain.maxDeltaGzipBytes,
    });
  }

  return {
    passed: checks.every((check) => check.status !== 'fail'),
    checks,
  };
}

function renderSummary(report) {
  const lines = [];

  lines.push('Performance report generated');
  lines.push(`- JSON: ${report.build.reportJsonPath}`);
  lines.push(`- Text: ${report.build.reportTextPath}`);
  lines.push('');

  lines.push('Shared shell');
  lines.push(
    `- Total: ${formatKiB(report.sharedShell.payload.totals.gzipBytes)} gzip / ${formatKiB(report.sharedShell.payload.totals.rawBytes)} raw`,
  );

  for (const file of report.sharedShell.payload.files.slice(0, 5)) {
    lines.push(`- ${file.file}: ${formatKiB(file.gzipBytes)} gzip`);
  }

  lines.push('');
  lines.push('Route families by max extra payload');

  for (const family of report.routeFamilies.slice(0, 6)) {
    lines.push(
      `- ${family.family}: max ${formatKiB(family.maxDeltaGzipBytes)} at ${family.maxRouteLabel}`,
    );
  }

  lines.push('');
  lines.push('Top route payloads beyond shared shell');

  report.routes.slice(0, 10).forEach((route, index) => {
    lines.push(
      `${index + 1}. ${route.label}: ${formatKiB(route.entryChunk.gzipBytes)} entry / ${formatKiB(route.deltaFromSharedShell.totals.gzipBytes)} extra`,
    );
  });

  lines.push('');
  lines.push('Top optional dynamic entries');

  report.optionalEntries.slice(0, 8).forEach((entry, index) => {
    lines.push(
      `${index + 1}. ${entry.label}: ${formatKiB(entry.deltaFromSharedShell.totals.gzipBytes)} extra`,
    );
  });

  lines.push('');
  lines.push('Optional feature-domain groups');

  for (const domain of report.optionalFeatureDomains) {
    lines.push(
      `- ${domain.label}: ${formatKiB(domain.deltaFromSharedShell.totals.gzipBytes)} extra across ${domain.matchedEntryKeys.length} entries`,
    );
  }

  lines.push('');
  lines.push(`Budget status: ${report.budgets.passed ? 'PASS' : 'FAIL'}`);

  for (const check of report.budgets.checks) {
    if (check.label === 'heavy-route-entry-bundles') {
      const observedRoute = check.maxObservedRoute ? ` at ${check.maxObservedRoute.label}` : '';
      lines.push(
        `- ${check.status.toUpperCase()} ${check.label}: ${formatKiB(check.actualMaxGzipBytes)} / ${formatKiB(check.maxGzipBytes)} max${observedRoute}`,
      );
      continue;
    }

    lines.push(
      `- ${check.status.toUpperCase()} ${check.label}: ${formatKiB(check.actualGzipBytes)} / ${formatKiB(check.maxGzipBytes)}`,
    );
  }

  return lines.join('\n');
}

function serializeAnalysis(analysis) {
  return {
    kind: analysis.kind,
    label: analysis.label,
    sourceKey: analysis.sourceKey,
    family: analysis.family,
    outputFile: analysis.outputFile,
    entryChunk: analysis.entryChunk,
    manifestKeys: analysis.manifestKeys,
    payload: analysis.payload,
    deltaFromSharedShell: analysis.deltaFromSharedShell,
  };
}

function serializeDomainAnalysis(domain) {
  return {
    label: domain.label,
    include: domain.include,
    maxDeltaGzipBytes: domain.maxDeltaGzipBytes,
    matchedEntryKeys: domain.matchedEntryKeys,
    manifestKeys: domain.manifestKeys,
    payload: domain.payload,
    deltaFromSharedShell: domain.deltaFromSharedShell,
  };
}

function subtractSets(source, subtract) {
  return new Set([...source].filter((value) => !subtract.has(value)));
}

function addFiles(target, value) {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    for (const file of value) {
      if (file) {
        target.add(file);
      }
    }

    return;
  }

  target.add(value);
}

function metricForFile(fileMetrics, file) {
  if (!file) {
    return null;
  }

  const metric = fileMetrics.get(file);

  return metric ? { ...metric } : null;
}

function compareByDeltaGzip(left, right) {
  return (
    right.deltaFromSharedShell.totals.gzipBytes - left.deltaFromSharedShell.totals.gzipBytes ||
    right.entryChunk.gzipBytes - left.entryChunk.gzipBytes
  );
}

function routeFamily(sourceKey) {
  return sourceKey.split('/')[2] ?? 'unknown';
}

function optionalEntryFamily(sourceKey) {
  if (sourceKey.startsWith('src/')) {
    return sourceKey.split('/').slice(1, 3).join('/');
  }

  if (sourceKey.startsWith('node_modules/')) {
    return sourceKey.split('/').slice(1, 3).join('/');
  }

  return 'generated';
}

function formatLabel(sourceKey, prefix) {
  return sourceKey.replace(prefix, '').replace(/\.[^.]+$/, '');
}

function formatOptionalEntryLabel(sourceKey) {
  if (sourceKey.startsWith('src/')) {
    return formatLabel(sourceKey, 'src/');
  }

  if (sourceKey.startsWith('node_modules/')) {
    return formatLabel(sourceKey, 'node_modules/');
  }

  return sourceKey.replace(/^_/, '').replace(/\.[^.]+$/, '');
}

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function kibToBytes(value) {
  return Math.round(value * 1024);
}

function toProjectRelative(targetPath) {
  return path.relative(projectRoot, targetPath).replace(/\\/g, '/');
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}
