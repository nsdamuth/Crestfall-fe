import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

const tests = [];
function test(name, run) {
  tests.push({ name, run });
}

test("Guided Build now exposes all 28 current Crestfall milestones", async () => {
  const contract = await source("components/studio/create/creation-studio/CreationStudio.contract.mjs");
  const diagnostics = await source("components/studio/create/creation-studio/creationStudioDiagnostics.mjs");

  assert.match(contract, /id: "SKILLS_PROFILE"/);
  assert.match(contract, /id: "ABILITY_SPELL_PROFILE"/);
  assert.match(contract, /id: "WALLET_PROFILE"/);
  assert.match(contract, /number: 28/);
  assert.match(diagnostics, /publishes 28 milestones/);
});

test("Full Studio has live builder assets for Skills, Ability Spell, and Wallet profiles", async () => {
  const assets = await source("data/creationAssets.js");

  assert.match(assets, /title: "Skills Profile"[\s\S]*href: "\/studio\/create\/skills-profile"/);
  assert.match(assets, /title: "Ability & Spell Profile"[\s\S]*href: "\/studio\/create\/ability-spell-profile"/);
  assert.match(assets, /title: "Wallet Profile"[\s\S]*href: "\/studio\/create\/wallet-profile"/);
});

test("all three creation routes use the current Crestfall builder shells", async () => {
  const skills = await source("app/studio/create/skills-profile/page.js");
  const ability = await source("app/studio/create/ability-spell-profile/page.js");
  const wallet = await source("app/studio/create/wallet-profile/page.js");

  assert.match(skills, /SkillsProfileBuilderShell/);
  assert.match(ability, /AbilitySpellProfileBuilderShell/);
  assert.match(wallet, /WalletProfileBuilderShell/);
});

test("V2 registry-driven creation editor supports all three profile families", async () => {
  const constants = await source("components/studio/my-creations/edit/creationEditConstants.js");
  const sectionMap = await source("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
  const viewModel = await source("components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js");

  for (const type of ["SKILLS_PROFILE", "ABILITY_SPELL_PROFILE", "WALLET_PROFILE"]) {
    assert.match(constants, new RegExp(`${type}_EDIT_SECTIONS`));
    assert.match(sectionMap, new RegExp(`${type}:\\s*\\{`));
    assert.match(viewModel, new RegExp(`creationType === "${type}"`));
  }

  assert.match(sectionMap, /SkillsProfileEditor/);
  assert.match(sectionMap, /AbilitySpellProfileEditor/);
  assert.match(sectionMap, /WalletProfileEditor/);
});

test("creation type policy, validation vocabulary, and picker taxonomy include the new profiles", async () => {
  const serverTypes = await source("lib/server/creations/constants.js");
  const policy = await source("lib/shared/creations/creationTypePolicy.js");
  const media = await source("lib/shared/creations/creationMedia.js");
  const buckets = await source("components/studio/creation-picker/creation-picker/creationPickerBuckets.js");

  for (const type of ["SKILLS_PROFILE", "ABILITY_SPELL_PROFILE", "WALLET_PROFILE"]) {
    assert.match(serverTypes, new RegExp(`"${type}"`));
    assert.match(policy, new RegExp(`${type}:`));
    assert.match(media, new RegExp(`"${type}"`));
    assert.match(buckets, new RegExp(`${type}: "more"`));
  }
});

test("profile builders remain Chassis clients rather than direct database views", async () => {
  const skillsClient = await source("lib/client/studio/skills/skillsClient.js");
  const abilityClient = await source("lib/client/studio/ability-spell/abilitySpellClient.js");
  const walletClient = await source("lib/client/studio/wallet/walletClient.js");

  for (const client of [skillsClient, abilityClient, walletClient]) {
    assert.match(client, /createCreationDraft/);
    assert.doesNotMatch(client, /supabase|PostGraphile|from\(/i);
  }
});

test("W3B stays outside parallel Images and Account ownership", async () => {
  const ownedFiles = [
    "app/studio/create/skills-profile/page.js",
    "app/studio/create/ability-spell-profile/page.js",
    "app/studio/create/wallet-profile/page.js",
    "components/studio/create/skills/**",
    "components/studio/create/ability-spell/**",
    "components/studio/create/wallet/**",
    "components/studio/create/creation-studio/**",
    "components/studio/my-creations/creation-edit-shell/**",
    "components/studio/my-creations/edit/creationEditConstants.js",
    "components/studio/creation-picker/creation-picker/**",
    "data/creationAssets.js",
    "lib/server/creations/constants.js",
    "lib/shared/creations/creationTypePolicy.js",
    "lib/shared/creations/creationMedia.js",
  ].join("\n");

  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/images\//);
  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/account\//);
  assert.doesNotMatch(ownedFiles, /services\/api\//);
});

for (const { name, run } of tests) {
  await run();
  console.log(`PASS ${name}`);
}

console.log(`V2 Studio authoring profile parity diagnostics: ${tests.length}/${tests.length} PASS`);
