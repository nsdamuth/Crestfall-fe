import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const viewModelPath = path.join(
  repoRoot,
  "components/studio/story-rooms/story-character-configuration/useStoryCharacterConfigurationViewModel.js"
);
const source = fs.readFileSync(viewModelPath, "utf8");

const memoStart = source.lastIndexOf("return useMemo(() => {");
assert.ok(memoStart >= 0, "Character Configuration useMemo projection was not found.");

const dependencyStart = source.indexOf("  }, [", memoStart);
assert.ok(dependencyStart > memoStart, "Character Configuration useMemo dependency array was not found.");

const dependencyEnd = source.indexOf("  ]);", dependencyStart);
assert.ok(dependencyEnd > dependencyStart, "Character Configuration useMemo dependency array end was not found.");

const memoBody = source.slice(memoStart, dependencyStart);
const dependencies = source.slice(dependencyStart, dependencyEnd);

assert.match(
  memoBody,
  /const required = isStoryPlayerActorConfigurationRequired\(descriptor\);/,
  "Character Configuration must derive readiness from the authoritative player actor descriptor."
);
assert.match(
  memoBody,
  /\n\s*required,\n/,
  "Character Configuration must still project the required flag to the View."
);
assert.doesNotMatch(
  dependencies,
  /\n\s*required,?\n/,
  "A callback-local `required` binding must not appear in the outer useMemo dependency array."
);

assert.match(dependencies, /\bsnapshot,/);
assert.match(source, /isStoryPlayerActorConfigurationRequired/);
assert.doesNotMatch(source, /Crownfall|Valentina/i);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_character_configuration_render_scope_v1",
      status: "PASSED",
      callbackLocalRequiredFlagPreserved: true,
      undefinedMemoDependencyRemoved: true,
      authoritativePlayerActorConfigurationStillUsed: true,
      crownfallSpecificRulesIntroduced: false,
    },
    null,
    2
  )
);
