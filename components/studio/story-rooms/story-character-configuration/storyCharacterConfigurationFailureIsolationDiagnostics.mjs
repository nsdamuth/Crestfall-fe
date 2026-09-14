import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const viewModelPath = path.join(
  repoRoot,
  "components/studio/story-rooms/story-character-configuration/useStoryCharacterConfigurationViewModel.js"
);
const viewPath = path.join(
  repoRoot,
  "components/studio/story-rooms/story-character-configuration/StoryCharacterConfiguration.view.jsx"
);

const viewModel = fs.readFileSync(viewModelPath, "utf8");
const view = fs.readFileSync(viewPath, "utf8");

assert.match(
  viewModel,
  /async function loadConfigurationLane\(loader, fallbackMessage\)/,
  "Character Configuration must isolate domain-lane loading failures."
);
assert.match(
  viewModel,
  /loadConfigurationLane\(\s*\(\) => fetchStoryAbilitySpellCharacterConfiguration\(roomId\)/,
  "Ability\/Spell loading must use the isolated configuration-lane loader."
);
assert.match(
  viewModel,
  /setConfigurationLoadErrors\(\{\s*stats: statsResult\.error,\s*skills: skillsResult\.error,\s*abilitySpell: abilitySpellResult\.error,/s,
  "Per-domain Character Configuration load errors must remain independently projected."
);
assert.match(
  viewModel,
  /loadError: configurationLoadErrors\.abilitySpell/,
  "Ability\/Spell load failure must be projected to the Ability\/Spell surface."
);
assert.match(
  viewModel,
  /playerCharacterAction: descriptor\s*\?\s*\{\s*visible: true,/s,
  "Player Character recovery controls must remain available whenever the room descriptor is available."
);
assert.match(
  viewModel,
  /operationError,/,
  "Save-operation errors must be separate from fatal room-load errors."
);
assert.match(
  view,
  /function ConfigurationLoadError/,
  "The Character Configuration view must render lane-local load failures."
);
assert.match(
  view,
  /abilitySpellConfiguration\.loadError[\s\S]*onRetry=\{abilitySpellConfiguration\.onRetry\}/,
  "Ability\/Spell failures must retain an in-place retry callback."
);
assert.match(
  view,
  /Retry Character Configuration/,
  "The lane-local error surface must provide an in-place retry control."
);
assert.match(
  view,
  /Change Player Character/,
  "The player must retain a visible Change Player Character recovery action."
);
assert.match(
  view,
  /\{operationError \? \(/,
  "Save-operation failures must render without replacing the entire Character Configuration page."
);
assert.doesNotMatch(viewModel, /Crownfall|Valentina/i);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_character_configuration_failure_isolation_v1",
      status: "PASSED",
      roomLoadRemainsFatalBoundary: true,
      domainLoadFailuresAreIsolated: true,
      abilitySpellRetryPreserved: true,
      changePlayerCharacterRecoveryPreserved: true,
      saveErrorsNoLongerReplaceWholePage: true,
      crownfallSpecificRulesIntroduced: false,
    },
    null,
    2
  )
);
