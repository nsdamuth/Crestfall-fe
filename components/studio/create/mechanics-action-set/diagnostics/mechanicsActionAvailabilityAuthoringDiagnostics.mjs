import assert from "node:assert/strict";
import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const creationAssets = read("data/creationAssets.js");
const createRoute = read("app/studio/create/mechanics-action-set/page.js");
const setContract = read("components/studio/create/mechanics-action-set/mechanicsActionSetContract.js");
const setBuilder = read("components/studio/create/mechanics-action-set/MechanicsActionSetBuilderShell.jsx");
const setEditor = read("components/studio/create/mechanics-action-set/MechanicsActionSetEditor.jsx");
const picker = read("components/studio/my-creations/edit/sections/mechanics-actions/MechanicsAssetPickerModal.jsx");
const availability = read("components/studio/my-creations/edit/sections/mechanics-actions/MechanicsActionAvailabilitySection.jsx");
const sectionMap = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
const constants = read("components/studio/my-creations/edit/creationEditConstants.js");
const creationConstants = read("lib/server/creations/constants.js");
const typePolicy = read("lib/shared/creations/creationTypePolicy.js");
const terminology = read("lib/shared/presentation/terminology.js");
const catalogTaxonomy = read("app/studio/v2/catalog/creationCatalogFilterTaxonomy.js");
const pickerBuckets = read("components/studio/creation-picker/creation-picker/creationPickerBuckets.js");

assert.match(creationAssets, /title:\s*"Mechanics Action Set"/);
assert.match(creationAssets, /href:\s*"\/studio\/create\/mechanics-action-set"/);
assert.match(createRoute, /MechanicsActionSetBuilderShell/);
assert.match(setContract, /MECHANICS_ACTION_SET_MAX_ACTIONS\s*=\s*256/);
assert.match(setContract, /mechanics_action_set_v0/);
assert.match(setBuilder, /createMechanicsActionSetDraft/);
assert.match(setEditor, /creationType="MECHANICS_ACTION"/);
assert.match(setEditor, /Add Action/);

assert.match(picker, /fetchOwnedCreations/);
assert.match(picker, /fetchCommunityCreations/);
assert.match(picker, /creationType/);
assert.doesNotMatch(picker, /mechanics_action\s*:\s*item/);

assert.match(availability, /const MAX_SETS = 32/);
assert.match(availability, /const MAX_DIRECT = 64/);
assert.match(availability, /Action Sets are the normal path for shared rules/);
assert.match(availability, /Availability is not executability/);
assert.match(availability, /Full Action bodies are not embedded here/);

for (const host of ["ROOM_TEMPLATE", "SCENARIO", "ACTOR_MECHANICS_PROFILE"]) {
  const pattern = new RegExp(`${host}:[\\s\\S]{0,1800}availableActions`, "m");
  assert.match(sectionMap, pattern, `${host} should expose availableActions`);
}
assert.match(constants, /MECHANICS_ACTION_SET:\s*MECHANICS_ACTION_SET_EDIT_SECTIONS/);
assert.match(constants, /ROOM_TEMPLATE:[\s\S]{0,1200}availableActions/);
assert.match(constants, /SCENARIO:[\s\S]{0,1200}availableActions/);
assert.match(constants, /ACTOR_MECHANICS_PROFILE:[\s\S]{0,1200}availableActions/);
assert.match(constants, /sectionIds:\s*\["runtime",\s*"narrative",\s*"runtimeModules",\s*"availableActions"\]/);

for (const type of ["MECHANICS_ACTION", "MECHANICS_ACTION_SET"]) {
  assert.match(creationConstants, new RegExp(`"${type}"`));
  assert.match(typePolicy, new RegExp(`${type}:[\\s\\S]{0,320}editMode:\\s*"${type}"`));
  assert.match(terminology, new RegExp(`${type}:\\s*"`));
  assert.match(catalogTaxonomy, new RegExp(`value:\\s*"${type}"`));
  assert.match(pickerBuckets, new RegExp(`${type}:\\s*"more"`));
}

const packageJson = read("package.json");
assert.doesNotMatch(packageJson, /diagnostics:mechanics-action-availability/);

console.log(JSON.stringify({
  status: "MECHANICS_ACTION_AVAILABILITY_AUTHORING_V0_ACCEPTED",
  firstClassActionSetCreator: true,
  actionSetMaxActions: 256,
  storyActionAvailability: true,
  scenarioActionAvailability: true,
  actorMechanicsProfileActionAvailability: true,
  actionSetsPreferred: true,
  directActionsSupported: true,
  ownedAndPublicPicker: true,
  fullActionBodiesEmbeddedInAvailability: false,
  availabilityNotExecutability: true,
  mechanicsModuleSurfaceReusedForActions: false,
  actionTypesRegisteredInCoreCreationTaxonomy: true,
  packageJsonChangedForOneOffDiagnostic: false,
}, null, 2));
