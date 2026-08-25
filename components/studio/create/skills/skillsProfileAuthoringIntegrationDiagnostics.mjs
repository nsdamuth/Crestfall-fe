import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, "../../../../");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");

const createPage = read("app/studio/create/skills-profile/page.js");
const sectionMap = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
const editShellViewModel = read("components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js");
const constants = read("components/studio/my-creations/edit/creationEditConstants.js");
const client = read("lib/client/studio/skills/skillsClient.js");
const serverTypes = read("lib/server/creations/constants.js");
const policy = read("lib/shared/creations/creationTypePolicy.js");
const previewPage = read("app/dev/ui-preview/skills-profile-editor/page.jsx");

assert.match(createPage, /SkillsProfileBuilderShell/);
assert.match(editShellViewModel, /isSkillsProfile: creationType === "SKILLS_PROFILE"/);
assert.match(constants, /SKILLS_PROFILE_EDIT_SECTIONS/);
assert.match(constants, /id: "SKILLS_PROFILE", label: "Skills Profiles"/);
assert.match(sectionMap, /import SkillsProfileEditor/);
assert.match(sectionMap, /SKILLS_PROFILE:\s*\{/);
assert.match(sectionMap, /ctx\.form\.data\?\.skills_profile/);
assert.match(sectionMap, /updateDataField\("skills_profile"/);
assert.match(client, /createCreationDraft/);
assert.doesNotMatch(client, /supabase|PostGraphile|from\(/i);
assert.match(serverTypes, /"SKILLS_PROFILE"/);
assert.match(policy, /SKILLS_PROFILE:/);
assert.match(policy, /editMode: "SKILLS_PROFILE"/);
assert.match(previewPage, /NODE_ENV === "production"/);
assert.match(previewPage, /notFound\(\)/);

console.log(JSON.stringify({
  diagnostic: "skills_profile_authoring_integration_v1",
  status: "PASSED",
  checks: {
    createRouteInstalled: true,
    registryDrivenEditRouteIntegrated: true,
    standardCreationClientUsed: true,
    directDatabaseAccessAbsent: true,
    creationTypeRegistered: true,
    previewProductionGated: true,
  },
}, null, 2));
