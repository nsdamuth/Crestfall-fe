import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_TRACKERS_CONTRACT_VERSION,
  MECHANICS_TRACKERS_STORAGE_PATH,
  TRACKERS_MODULE_CONFIG_MODAL_CLASSIFICATION,
} from "./MechanicsTrackersSection.contract.js";
import { listMechanicsTrackerFixtures } from "./mechanicsTrackers.fixtures.js";
import {
  normalizeMechanicsTracker,
  normalizeMechanicsTrackers,
} from "./mechanicsTrackersNormalization.js";
import {
  addMechanicsTracker,
  addMechanicsTrackerMutationHint,
  addMechanicsTrackerPhase,
  patchMechanicsTracker,
  removeMechanicsTracker,
} from "./mechanicsTrackersOperations.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../../../..");
const parentPath = path.join(here, "../mechanics-module-assembly/MechanicsModuleAssembly.jsx");
const viewPath = path.join(here, "MechanicsTrackersSection.view.jsx");
const shellPath = path.join(here, "MechanicsTrackersSection.jsx");
const previewPage = path.join(
  repoRoot,
  "app/dev/ui-preview/mechanics-trackers/page.jsx"
);
const packageJsonPath = path.join(repoRoot, "package.json");

const read = (filePath) => fs.readFileSync(filePath, "utf8");

test("M2 contract freezes the tracker storage boundary", () => {
  assert.equal(MECHANICS_TRACKERS_CONTRACT_VERSION, "crestfall.loom.mechanics-trackers.v1");
  assert.equal(MECHANICS_TRACKERS_STORAGE_PATH, "instanceData.trackers");
});

test("current, legacy, empty, and recoverable tracker fixtures normalize", () => {
  const fixtures = listMechanicsTrackerFixtures();
  assert.equal(fixtures.length, 4);
  fixtures.forEach((fixture) => assert.ok(Array.isArray(fixture.normalized)));
  assert.equal(fixtures.find((fixture) => fixture.id === "recoverable").normalized[0].initial, 10);
});

test("legacy aliases and unknown metadata survive normalization", () => {
  const legacy = listMechanicsTrackerFixtures().find((fixture) => fixture.id === "legacy").normalized[0];
  assert.equal(legacy.mutationHints[0].eventTypes[0], "ACCEPTED_CARE");
  assert.equal(legacy.mutationHints[0].delta, 3);
  assert.deepEqual(legacy.futureTrackerMetadata, { retained: true });
  assert.deepEqual(legacy.mutationHints[0].futureHintMetadata, { retained: true });
});

test("normalization is idempotent and clamps initial values", () => {
  const input = [{ id: "health", min: 0, max: 10, initial: 99 }];
  const once = normalizeMechanicsTrackers(input);
  const twice = normalizeMechanicsTrackers(once);
  assert.deepEqual(twice, once);
  assert.equal(once[0].initial, 10);
});

test("tracker operations add, patch, nest, and remove without mutating input", () => {
  const input = [{ id: "trust", label: "Trust", future: { retained: true } }];
  const added = addMechanicsTracker(input);
  const patched = patchMechanicsTracker(added, 0, { label: "Bond" });
  const phased = addMechanicsTrackerPhase(patched, 0);
  const hinted = addMechanicsTrackerMutationHint(phased, 0);
  const removed = removeMechanicsTracker(hinted, 1);
  assert.equal(input[0].label, "Trust");
  assert.equal(removed[0].label, "Bond");
  assert.equal(removed[0].phases.length, 1);
  assert.equal(removed[0].mutationHints.length, 1);
  assert.deepEqual(removed[0].future, { retained: true });
});

test("the main Mechanics parent mounts the extracted tracker package", () => {
  const source = read(parentPath);
  assert.match(source, /import MechanicsTrackersSection from/);
  assert.match(source, /<MechanicsTrackersSection/);
  assert.doesNotMatch(source, /function TrackersVisualEditor/);
  assert.doesNotMatch(source, /function TrackerCard/);
  const assemblyViewModel = read(
    path.join(here, "../mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js")
  );
  assert.match(assemblyViewModel, /normalizeMechanicsTrackers\(trackersNext\)/);
});

test("the portable tracker View owns no application data access", () => {
  const source = read(viewPath);
  assert.doesNotMatch(source, /next\/link|next\/navigation/);
  assert.doesNotMatch(source, /@\/lib\/(client|server|supabase)/);
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.match(source, /Trackers \/ Meters/);
});

test("the tracker Binding Shell composes the ViewModel and portable View", () => {
  const source = read(shellPath);
  assert.match(source, /useMechanicsTrackersViewModel/);
  assert.match(source, /MechanicsTrackersSectionView/);
});

test("the preview is explicitly unavailable in production", () => {
  const source = read(previewPage);
  assert.match(source, /process\.env\.NODE_ENV === "production"/);
  assert.match(source, /notFound\(\)/);
});

test("the M2 diagnostic command is registered", () => {
  const packageJson = JSON.parse(read(packageJsonPath));
  assert.equal(
    packageJson.scripts["diagnostics:loom:mechanics-m2"],
    "node --test components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/mechanicsTrackersDiagnostics.mjs"
  );
});

test("the unreferenced location tracker modal remains quarantined", () => {
  assert.equal(
    TRACKERS_MODULE_CONFIG_MODAL_CLASSIFICATION,
    "QUARANTINED_UNREFERENCED_LEGACY_OR_FUTURE"
  );
  const modalName = "TrackersModuleConfigModal";
  const candidates = [];
  for (const base of [path.join(repoRoot, "app"), path.join(repoRoot, "components")]) {
    const stack = [base];
    while (stack.length) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (/\.(js|jsx|mjs)$/.test(entry.name) && entry.name !== `${modalName}.jsx`) {
          const source = read(full);
          const relativePath = path.relative(repoRoot, full);
          const isDocumentationInventory = relativePath.includes(
            "components/studio/pre-mechanics-closeout/"
          );
          if (
            source.includes(modalName) &&
            !entry.name.endsWith("Diagnostics.mjs") &&
            !isDocumentationInventory
          ) {
            candidates.push(relativePath);
          }
        }
      }
    }
  }
  assert.deepEqual(candidates, []);
});
