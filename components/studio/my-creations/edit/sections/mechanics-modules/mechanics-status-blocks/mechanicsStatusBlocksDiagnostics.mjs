import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_STATUS_BLOCKS_LOOM_CONTRACT,
  MECHANICS_STATUS_BLOCK_PLACEMENTS,
  MECHANICS_STATUS_BLOCK_VISIBILITIES,
} from "./MechanicsStatusBlocks.contract.js";
import { MECHANICS_STATUS_BLOCK_FIXTURES } from "./mechanicsStatusBlocks.fixtures.js";
import {
  normalizeMechanicsStatusBlock,
  normalizeMechanicsStatusBlocks,
  summarizeMechanicsStatusBlock,
} from "./mechanicsStatusBlocksNormalization.js";
import {
  addMechanicsStatusBlock,
  addMechanicsStatusBlockLine,
  patchMechanicsStatusBlock,
  patchMechanicsStatusBlockLine,
  removeMechanicsStatusBlock,
  removeMechanicsStatusBlockLine,
} from "./mechanicsStatusBlocksOperations.js";
import { normalizeMechanicsDocument } from "../mechanics-core/mechanicsDocumentNormalization.js";
import { canonicalizeMechanicsModuleData } from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
const fixture = (id) =>
  MECHANICS_STATUS_BLOCK_FIXTURES.find((item) => item.id === id);

test("M7B contract freezes Status Block ownership", () => {
  assert.equal(
    MECHANICS_STATUS_BLOCKS_LOOM_CONTRACT.id,
    "crestfall.loom.mechanics-status-blocks.v1"
  );
  assert.equal(
    MECHANICS_STATUS_BLOCKS_LOOM_CONTRACT.storagePath,
    "instanceData.statusBlocks"
  );
  assert.deepEqual([...MECHANICS_STATUS_BLOCK_PLACEMENTS], [
    "response_end",
    "response_start",
  ]);
  assert.deepEqual([...MECHANICS_STATUS_BLOCK_VISIBILITIES], [
    "public",
    "private",
    "hidden",
  ]);
});

test("fixture inventory covers empty, current, legacy, and malformed blocks", () => {
  assert.deepEqual(
    MECHANICS_STATUS_BLOCK_FIXTURES.map((item) => item.id),
    ["EMPTY", "CURRENT", "LEGACY", "MALFORMED"]
  );
});

test("Status Block normalization is idempotent", () => {
  for (const item of MECHANICS_STATUS_BLOCK_FIXTURES) {
    const once = normalizeMechanicsStatusBlocks(item.statusBlocks);
    const twice = normalizeMechanicsStatusBlocks(once);
    assert.deepEqual(twice, once, item.id);
  }
});

test("document normalization delegates Status Blocks to M7B", () => {
  const document = normalizeMechanicsDocument({
    instanceData: {
      status_blocks: fixture("LEGACY").statusBlocks,
    },
  });
  assert.equal(document.instanceData.statusBlocks[0].id, "legacy_footer");
  assert.equal(document.instanceData.statusBlocks[0].placement, "response_end");
  assert.equal(document.instanceData.statusBlocks[1].placement, "response_start");
});

test("Mechanics JSON canonicalization delegates Status Blocks to M7B", () => {
  const data = canonicalizeMechanicsModuleData({
    moduleDefinitionId: "core.trackers.v1",
    instanceData: { status_blocks: fixture("LEGACY").statusBlocks },
  });
  assert.equal(data.instanceData.statusBlocks[0].slot, "legacy_slot");
  assert.deepEqual(data.instanceData.statusBlocks[0].lines, [
    "[Legacy: {{counters.legacy.value}}]",
  ]);
});

test("legacy field aliases project into canonical Status Blocks", () => {
  const normalized = normalizeMechanicsStatusBlocks(
    fixture("LEGACY").statusBlocks
  );
  assert.equal(normalized[0].id, "legacy_footer");
  assert.equal(normalized[0].label, "Legacy Footer");
  assert.equal(normalized[0].slot, "legacy_slot");
  assert.equal(normalized[0].placement, "response_end");
  assert.equal(normalized[0].required, true);
  assert.equal(normalized[0].visibility, "public");
  assert.equal(normalized[1].id, "legacy_header");
  assert.deepEqual(normalized[1].lines, ["Header line", "Second line"]);
});

test("unknown block metadata survives normalization and patching", () => {
  const source = normalizeMechanicsStatusBlocks(fixture("CURRENT").statusBlocks);
  const patched = patchMechanicsStatusBlock(source, 0, {
    label: "Updated Footer",
  });
  assert.deepEqual(patched[0].futureStatusMetadata, { retained: true });
  assert.equal(patched[0].label, "Updated Footer");
});

test("block operations preserve ordering and neighboring blocks", () => {
  const source = normalizeMechanicsStatusBlocks(fixture("CURRENT").statusBlocks);
  const added = addMechanicsStatusBlock(source);
  assert.equal(added.length, 3);
  assert.equal(added[0].id, "relationship_footer");
  const removed = removeMechanicsStatusBlock(added, 1);
  assert.equal(removed.length, 2);
  assert.equal(removed[1].id, added[2].id);
});

test("line operations preserve ordering and block metadata", () => {
  const source = normalizeMechanicsStatusBlocks(fixture("CURRENT").statusBlocks);
  const added = addMechanicsStatusBlockLine(source, 0, "  New line  ");
  assert.equal(added[0].lines.at(-1), "New line");
  const patched = patchMechanicsStatusBlockLine(added, 0, 0, "Updated line");
  assert.equal(patched[0].lines[0], "Updated line");
  const removed = removeMechanicsStatusBlockLine(patched, 0, 1);
  assert.equal(removed[0].lines.length, patched[0].lines.length - 1);
  assert.deepEqual(removed[0].futureStatusMetadata, { retained: true });
});

test("malformed Status Blocks recover safely", () => {
  const normalized = normalizeMechanicsStatusBlocks(
    fixture("MALFORMED").statusBlocks
  );
  assert.equal(normalized[0].id, "status_block_1");
  assert.equal(normalized[1].id, "status_block_2");
  assert.equal(normalized[1].placement, "response_end");
  assert.equal(normalized[1].visibility, "public");
  assert.equal(normalized[1].required, true);
  assert.deepEqual(normalized[1].lines, []);
});

test("Status Block summaries retain placement, visibility, and line count", () => {
  assert.equal(
    summarizeMechanicsStatusBlock(fixture("CURRENT").statusBlocks[0]),
    "response_end · public · 2 lines"
  );
});

test("portable Status Blocks View owns presentation without application imports", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks/MechanicsStatusBlocks.view.jsx"
  );
  assert.match(view, /Rendered Lines/);
  assert.match(view, /Status Blocks/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /MechanicsModuleFieldsSection/);
});

test("the main Mechanics parent mounts M7B and no longer owns Status Block UI", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  assert.match(parent, /import MechanicsStatusBlocks/);
  assert.match(parent, /<MechanicsStatusBlocks/);
  const assemblyViewModel = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js"
  );
  assert.match(assemblyViewModel, /normalizeMechanicsStatusBlocks/);
  assert.doesNotMatch(parent, /const STATUS_BLOCK_PLACEMENTS/);
  assert.doesNotMatch(parent, /function StatusBlocksVisualEditor/);
  assert.doesNotMatch(parent, /function StatusBlockCard/);
  assert.doesNotMatch(parent, /function normalizeStatusBlock/);
});

test("M7B package includes contract, View, ViewModel, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsStatusBlocks.contract.js",
    "MechanicsStatusBlocks.jsx",
    "MechanicsStatusBlocks.view.jsx",
    "useMechanicsStatusBlocksViewModel.js",
    "mechanicsStatusBlocksNormalization.js",
    "mechanicsStatusBlocksOperations.js",
    "mechanicsStatusBlocks.fixtures.js",
    "mechanicsStatusBlocksDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-status-blocks/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m7b"] || "",
    /mechanicsStatusBlocksDiagnostics\.mjs/
  );
});
