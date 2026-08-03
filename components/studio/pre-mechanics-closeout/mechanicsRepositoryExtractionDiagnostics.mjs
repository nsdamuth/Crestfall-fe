import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_EXTERNAL_RUNTIME_DEPENDENCIES,
  MECHANICS_EXCLUDED_HOST_SURFACES,
  MECHANICS_EXTRACTION_SEQUENCE,
  MECHANICS_EXTRACTION_VERIFICATION_SURFACES,
  MECHANICS_FROZEN_RUNTIME_GRAPH_FILE_COUNT,
  MECHANICS_HOST_CONSUMER_FILES,
  MECHANICS_HOST_UI_SEAMS,
  MECHANICS_PORTABLE_PACKAGE_DIRECTORIES,
  MECHANICS_PORTABLE_SUPPORT_FILES,
  MECHANICS_PUBLIC_CONSUMER_CONTRACT,
  MECHANICS_REPOSITORY_EXTRACTION_STATUS,
  MECHANICS_REPOSITORY_EXTRACTION_VERSION,
  MECHANICS_RUNTIME_ENTRYPOINTS,
} from "./mechanicsRepositoryExtractionManifest.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const mechanicsRoot =
  "components/studio/my-creations/edit/sections/mechanics-modules";

function absolute(relativePath) {
  return path.join(repoRoot, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function normalizePath(value) {
  return value.replaceAll(path.sep, "/");
}

const importPattern =
  /(?:import\s+(?:[^;]*?\s+from\s+)?|export\s+[^;]*?\s+from\s+|import\()(["'])(.+?)\1/gs;

function readImportSpecifiers(relativePath) {
  const source = read(relativePath);
  return [...source.matchAll(importPattern)].map((match) => match[2]);
}

function resolveRelativeImport(importer, specifier) {
  const base = path.resolve(path.dirname(absolute(importer)), specifier);
  const candidates = [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
    path.join(base, "index.mjs"),
  ];
  const resolved = candidates.find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()
  );
  assert.ok(resolved, `Unresolved relative import ${specifier} from ${importer}`);
  return normalizePath(path.relative(repoRoot, resolved));
}

function buildRuntimeGraph(entrypoints) {
  const pending = [...entrypoints];
  const files = new Set();
  const externalImports = new Map();

  while (pending.length) {
    const relativePath = pending.pop();
    if (files.has(relativePath)) continue;
    files.add(relativePath);

    for (const specifier of readImportSpecifiers(relativePath)) {
      if (specifier.startsWith(".")) {
        pending.push(resolveRelativeImport(relativePath, specifier));
        continue;
      }
      const importers = externalImports.get(specifier) || new Set();
      importers.add(relativePath);
      externalImports.set(specifier, importers);
    }
  }

  return { files, externalImports };
}

function isPortableRuntimeFile(relativePath) {
  if (!relativePath.startsWith(`${mechanicsRoot}/`)) return false;
  const localPath = relativePath.slice(mechanicsRoot.length + 1);
  const firstSegment = localPath.split("/")[0];
  return (
    MECHANICS_PORTABLE_PACKAGE_DIRECTORIES.includes(firstSegment) ||
    MECHANICS_PORTABLE_SUPPORT_FILES.includes(localPath)
  );
}

const runtimeGraph = buildRuntimeGraph(MECHANICS_RUNTIME_ENTRYPOINTS);

test("Mechanics repository extraction closeout is versioned and commit-ready", () => {
  assert.equal(
    MECHANICS_REPOSITORY_EXTRACTION_VERSION,
    "crestfall.loom.mechanics-repository-extraction.v1"
  );
  assert.equal(
    MECHANICS_REPOSITORY_EXTRACTION_STATUS,
    "READY_FOR_EXTERNAL_REPOSITORY_EXTRACTION_AFTER_COMMIT"
  );
  assert.ok(MECHANICS_EXTRACTION_SEQUENCE.length >= 8);
  assert.deepEqual(MECHANICS_EXTRACTION_SEQUENCE.at(0),
    "Commit the validated Crestfall M0-M9 decomposition and this closeout patch."
  );
});

test("runtime entrypoints resolve to the frozen portable Mechanics graph", () => {
  for (const entrypoint of MECHANICS_RUNTIME_ENTRYPOINTS) {
    assert.equal(fs.existsSync(absolute(entrypoint)), true, entrypoint);
  }
  assert.equal(runtimeGraph.files.size, MECHANICS_FROZEN_RUNTIME_GRAPH_FILE_COUNT);
  for (const relativePath of runtimeGraph.files) {
    assert.equal(
      isPortableRuntimeFile(relativePath),
      true,
      `Runtime graph escaped the portable inventory: ${relativePath}`
    );
  }
});

test("runtime graph has only React, icons, and one explicit host UI seam", () => {
  const externalSpecifiers = [...runtimeGraph.externalImports.keys()].sort();
  const expected = [
    ...MECHANICS_EXTERNAL_RUNTIME_DEPENDENCIES,
    ...MECHANICS_HOST_UI_SEAMS.map((seam) => seam.importSpecifier),
  ].sort();
  assert.deepEqual(externalSpecifiers, expected);

  for (const seam of MECHANICS_HOST_UI_SEAMS) {
    assert.deepEqual(
      [...(runtimeGraph.externalImports.get(seam.importSpecifier) || [])],
      [seam.importer]
    );
    assert.match(seam.extractionDecision, /during repository extraction/i);
  }
});

test("portable runtime graph remains free of application and persistence dependencies", () => {
  const forbiddenSourcePatterns = [
    /from\s+["']next\//,
    /from\s+["']@supabase/,
    /from\s+["']@\/lib\/client/,
    /from\s+["']@\/lib\/server/,
    /from\s+["']@\/app\//,
    /\bfetch\s*\(/,
    /\blocalStorage\b/,
    /\bsessionStorage\b/,
  ];

  for (const relativePath of runtimeGraph.files) {
    const source = read(relativePath);
    for (const pattern of forbiddenSourcePatterns) {
      assert.doesNotMatch(source, pattern, relativePath);
    }
  }
});

test("the Crestfall host binding remains the minimal public consumer contract", () => {
  const bindingPath = MECHANICS_PUBLIC_CONSUMER_CONTRACT.hostBindingFile;
  const binding = read(bindingPath);

  assert.match(binding, /import MechanicsModuleAssembly from/);
  assert.match(binding, /import \{\s*normalizeMechanicsDocument,?\s*\} from/s);
  assert.match(binding, /function replaceMechanicsData\(nextData\)/);
  assert.match(binding, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
  assert.match(binding, /mechanicsData=\{form\?\.data \|\| \{\}\}/);
  assert.match(binding, /updateDataField=\{updateDataField\}/);
  assert.match(binding, /canReplaceData=\{canReplaceData\}/);
  assert.match(binding, /onReplaceMechanicsData=\{replaceMechanicsData\}/);
  assert.doesNotMatch(binding, /fetch\(|supabase|next\/navigation|@\/lib\/client/);

  assert.deepEqual(MECHANICS_PUBLIC_CONSUMER_CONTRACT.props, [
    "mechanicsData",
    "updateDataField",
    "canReplaceData",
    "onReplaceMechanicsData",
  ]);
  assert.equal(MECHANICS_PUBLIC_CONSUMER_CONTRACT.hostResponsibilities.length, 4);
  assert.equal(MECHANICS_PUBLIC_CONSUMER_CONTRACT.packageResponsibilities.length, 4);
});

test("host consumers and excluded application surfaces remain explicit", () => {
  for (const relativePath of MECHANICS_HOST_CONSUMER_FILES) {
    assert.equal(fs.existsSync(absolute(relativePath)), true, relativePath);
  }

  for (const item of MECHANICS_EXCLUDED_HOST_SURFACES) {
    assert.equal(fs.existsSync(absolute(item.path)), true, item.path);
    assert.ok(item.reason.length > 45);
    if (fs.statSync(absolute(item.path)).isFile()) {
      assert.equal(runtimeGraph.files.has(item.path), false, item.path);
    } else {
      for (const graphFile of runtimeGraph.files) {
        assert.equal(
          graphFile.startsWith(`${item.path}/`),
          false,
          `${item.path} leaked into the portable runtime graph`
        );
      }
    }
  }
});

test("the extraction verification surfaces preserve preview, create, and edit proof", () => {
  assert.deepEqual(MECHANICS_EXTRACTION_VERIFICATION_SURFACES, [
    "/dev/ui-preview/mechanics-module-assembly",
    "/studio/create/mechanics-module",
    "/studio/my-creations/<mechanics-module-id>/edit",
  ]);
  assert.equal(
    fs.existsSync(
      absolute("app/dev/ui-preview/mechanics-module-assembly/page.jsx")
    ),
    true
  );
});

test("closeout documentation records the external-repository stop boundary", () => {
  const closeout = read(
    "components/studio/pre-mechanics-closeout/MECHANICS_REPOSITORY_EXTRACTION_CLOSEOUT.md"
  );
  assert.match(closeout, /M0–M9 decomposition is complete/);
  assert.match(closeout, /No runtime behavior changes/);
  assert.match(closeout, /ModalShell/);
  assert.match(closeout, /Commit boundary/);
  assert.match(closeout, /do not begin physical extraction/i);
});
