import assert from "node:assert/strict";
import fs from "node:fs";

import {
  normalizeProgressionRequirementTierIds,
} from "./mechanics-command-requirements/mechanicsCommandRequirementsNormalization.js";
import {
  MECHANICS_PROGRESSION_REQUIREMENT_AUTHORING_VERSION,
  normalizeProgressionTierId,
  normalizeProgressionTierIdList,
} from "./mechanicsProgressionRequirementAuthoring.js";

assert.equal(
  MECHANICS_PROGRESSION_REQUIREMENT_AUTHORING_VERSION,
  "mechanics_progression_requirement_authoring_v1"
);

const requirementsNormalizationSource = fs.readFileSync(
  new URL(
    "./mechanics-command-requirements/mechanicsCommandRequirementsNormalization.js",
    import.meta.url
  ),
  "utf8"
);
const fieldsSectionSource = fs.readFileSync(
  new URL("./mechanics-module-assembly/MechanicsModuleAssembly.jsx", import.meta.url),
  "utf8"
);

assert.match(
  requirementsNormalizationSource,
  /import \{\s*normalizeProgressionTierIdList,?\s*\} from "\.\.\/mechanicsProgressionRequirementAuthoring\.js";/
);
assert.match(
  requirementsNormalizationSource,
  /return normalizeProgressionTierIdList\(value\);/
);
assert.match(fieldsSectionSource, /import MechanicsCommandRequirements/);
assert.doesNotMatch(
  fieldsSectionSource,
  /from "\.\/mechanicsProgressionRequirementAuthoring\.js"/
);

assert.equal(normalizeProgressionTierId("tier.novice"), "tier.novice");
assert.equal(normalizeProgressionTierId("tier:veteran"), "tier:veteran");
assert.equal(normalizeProgressionTierId("tier_master"), "tier_master");
assert.equal(normalizeProgressionTierId("tier-master"), "tier-master");
assert.equal(normalizeProgressionTierId(" Tier Novice "), "tier_novice");
assert.deepEqual(
  normalizeProgressionTierIdList("tier.novice, tier.veteran, tier.novice"),
  ["tier.novice", "tier.veteran"]
);
assert.deepEqual(
  normalizeProgressionTierIdList(["tier.master", "tier:legend"]),
  ["tier.master", "tier:legend"]
);
assert.deepEqual(
  normalizeProgressionRequirementTierIds(
    " Tier Novice, tier.veteran, Tier Novice "
  ),
  ["tier_novice", "tier.veteran"]
);

console.log(
  JSON.stringify(
    {
      diagnostic: MECHANICS_PROGRESSION_REQUIREMENT_AUTHORING_VERSION,
      status: "PASSED",
      owner: "mechanics-command-requirements",
      preservedSeparators: [".", ":", "_", "-"],
      normalizedTierIds: normalizeProgressionRequirementTierIds([
        "tier.novice",
        "tier.veteran",
        "tier.master",
      ]),
    },
    null,
    2
  )
);
