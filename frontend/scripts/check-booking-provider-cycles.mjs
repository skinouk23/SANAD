import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const srcRoot = path.join(projectRoot, 'src');
const trackedRoots = [
  path.join(srcRoot, 'features', 'bookings') + path.sep,
  path.join(srcRoot, 'features', 'providers') + path.sep,
];
const entrypoints = [
  path.join(srcRoot, 'features', 'bookings', 'index.ts'),
  path.join(srcRoot, 'features', 'bookings', 'flow', 'index.ts'),
  path.join(srcRoot, 'features', 'providers', 'index.ts'),
  path.join(srcRoot, 'features', 'providers', 'public-api.ts'),
];

const dependencyCache = new Map();

function isTrackedFile(filePath) {
  return trackedRoots.some((root) => filePath.startsWith(root));
}

function normalizePath(filePath) {
  return path.normalize(filePath);
}

function isExistingFile(filePath) {
  return existsSync(filePath) && statSync(filePath).isFile();
}

function resolveModule(fromFile, specifier) {
  let targetBase = null;

  if (specifier.startsWith('@/')) {
    targetBase = path.join(srcRoot, specifier.slice(2));
  } else if (specifier.startsWith('.')) {
    targetBase = path.resolve(path.dirname(fromFile), specifier);
  } else {
    return null;
  }

  const candidates = [
    targetBase,
    `${targetBase}.ts`,
    `${targetBase}.tsx`,
    `${targetBase}.js`,
    `${targetBase}.jsx`,
    path.join(targetBase, 'index.ts'),
    path.join(targetBase, 'index.tsx'),
    path.join(targetBase, 'index.js'),
    path.join(targetBase, 'index.jsx'),
  ];

  for (const candidate of candidates) {
    if (isExistingFile(candidate)) {
      return normalizePath(candidate);
    }
  }

  return null;
}

function collectRuntimeDependencies(filePath) {
  const normalizedFilePath = normalizePath(filePath);

  if (dependencyCache.has(normalizedFilePath)) {
    return dependencyCache.get(normalizedFilePath);
  }

  const sourceText = readFileSync(normalizedFilePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    normalizedFilePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    normalizedFilePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const dependencies = new Set();

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      if (statement.importClause?.isTypeOnly || !ts.isStringLiteral(statement.moduleSpecifier)) {
        continue;
      }

      const resolved = resolveModule(normalizedFilePath, statement.moduleSpecifier.text);

      if (resolved && isTrackedFile(resolved)) {
        dependencies.add(resolved);
      }
    }

    if (ts.isExportDeclaration(statement)) {
      if (statement.isTypeOnly || !statement.moduleSpecifier) {
        continue;
      }

      if (!ts.isStringLiteral(statement.moduleSpecifier)) {
        continue;
      }

      const resolved = resolveModule(normalizedFilePath, statement.moduleSpecifier.text);

      if (resolved && isTrackedFile(resolved)) {
        dependencies.add(resolved);
      }
    }
  }

  const dependencyList = [...dependencies].sort();
  dependencyCache.set(normalizedFilePath, dependencyList);
  return dependencyList;
}

function canonicalizeCycle(cycle) {
  const nodes = cycle.slice(0, -1);

  if (nodes.length === 0) {
    return '';
  }

  const relativeNodes = nodes.map((node) => path.relative(projectRoot, node).replaceAll('\\', '/'));
  const rotations = relativeNodes.map((_, index) => [
    ...relativeNodes.slice(index),
    ...relativeNodes.slice(0, index),
  ]);

  return rotations.map((rotation) => rotation.join(' -> ')).sort()[0];
}

function formatCycle(cycle) {
  return cycle.map((node) => path.relative(projectRoot, node).replaceAll('\\', '/')).join(' -> ');
}

const visited = new Set();
const stack = [];
const inStack = new Set();
const cycles = new Map();

function walk(filePath) {
  const normalizedFilePath = normalizePath(filePath);
  visited.add(normalizedFilePath);
  inStack.add(normalizedFilePath);
  stack.push(normalizedFilePath);

  for (const dependency of collectRuntimeDependencies(normalizedFilePath)) {
    if (!visited.has(dependency)) {
      walk(dependency);
      continue;
    }

    if (!inStack.has(dependency)) {
      continue;
    }

    const cycleStartIndex = stack.indexOf(dependency);
    const cycle = [...stack.slice(cycleStartIndex), dependency];
    const key = canonicalizeCycle(cycle);

    if (!cycles.has(key)) {
      cycles.set(key, cycle);
    }
  }

  stack.pop();
  inStack.delete(normalizedFilePath);
}

for (const entrypoint of entrypoints) {
  if (existsSync(entrypoint) && !visited.has(normalizePath(entrypoint))) {
    walk(entrypoint);
  }
}

if (cycles.size > 0) {
  console.error('Detected booking/provider runtime import cycles:');

  for (const cycle of cycles.values()) {
    console.error(`- ${formatCycle(cycle)}`);
  }

  process.exit(1);
}

console.log('No booking/provider runtime import cycles found.');
