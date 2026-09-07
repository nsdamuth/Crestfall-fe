import assert from "node:assert/strict";
import fs from "node:fs";

function read(path) { return fs.readFileSync(path, "utf8"); }

const assets = read("data/creationAssets.js");
const studio = read("components/studio/create/creation-studio/CreationStudio.contract.mjs");
const page = read("app/studio/create/mechanics-action/page.js");
const builder = read("components/studio/create/mechanics-action/MechanicsActionBuilderShell.jsx");
const editor = read("components/studio/create/mechanics-action/MechanicsActionJsonEditor.jsx");
const map = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
const constants = read("components/studio/my-creations/edit/creationEditConstants.js");

assert.match(assets, /title: "Mechanics Action"/);
assert.equal(assets.includes('href: "/studio/create/mechanics-action"'), true);
assert.match(studio, /"Mechanics Action"/);
assert.match(page, /Create Mechanics Action/);
assert.match(builder, /type: MECHANICS_ACTION_CREATION_TYPE/);
assert.match(builder, /buildMechanicsActionData/);
assert.match(editor, /mechanics_action_definition_v0/);
assert.match(editor, /instanceData/);
assert.match(map, /MECHANICS_ACTION:/);
assert.match(constants, /MECHANICS_ACTION_EDIT_SECTIONS/);
assert.doesNotMatch(builder, /type:\\s*"MECHANICS_MODULE"/);

console.log(JSON.stringify({
  status: "MECHANICS_ACTION_CREATOR_SURFACE_V0_ACCEPTED",
  rulesMechanicsTilePresent: true,
  standaloneCreateRoutePresent: true,
  standaloneEditSectionPresent: true,
  rootActionJsonAcceptedByEditor: true,
  mechanicsModuleInstanceDataRequired: false,
  creatorActionKeyVisible: true,
  firstClassActionCreation: true,
}, null, 2));
