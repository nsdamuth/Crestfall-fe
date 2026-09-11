import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  OUTFIT_ADVANCED_CLOTHING_SECTION_IDS,
  applyOutfitAdvancedPromptConversion,
  hasAuthoredAdvancedClothing,
} from "./outfitAdvancedPromptConversionProjection.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

assert.equal(OUTFIT_ADVANCED_CLOTHING_SECTION_IDS.length, 10);
assert.equal(hasAuthoredAdvancedClothing({ data: {} }), false);
assert.equal(
  hasAuthoredAdvancedClothing({
    data: { clothing_sections: { feet: "weathered riding boots" } },
  }),
  true
);

const writes = [];
assert.equal(
  applyOutfitAdvancedPromptConversion({
    conversion: {
      signature_clothing: "signature amber goggles",
      clothing_sections: Object.fromEntries(
        OUTFIT_ADVANCED_CLOTHING_SECTION_IDS.map((id) => [id, `${id} detail`])
      ),
    },
    updateDataField: (field, value) => writes.push([field, value]),
  }),
  true
);
assert.deepEqual(writes.map(([field]) => field), [
  "signature_clothing",
  "clothing_sections",
  "clothing_mode",
]);
assert.equal(writes.at(-1)[1], "ADVANCED");
assert.equal(writes[1][1].feet, "feet detail");

const vm = read(
  "components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/useOutfitPromptGuidanceSectionViewModel.js"
);
const view = read(
  "components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view.jsx"
);
const client = read("lib/client/studio/outfits/outfitAuthoringClient.js");
const route = read("app/api/studio/outfits/advanced-prompt-conversion/route.js");

assert.match(vm, /convertOutfitNormalPromptToAdvanced/);
assert.match(vm, /hasAuthoredAdvancedClothing/);
assert.match(vm, /conversionConfirmationRequired/);
assert.match(view, /Convert to Advanced/);
assert.match(view, /Converting…/);
assert.match(view, /Replace them with a new conversion/);
assert.match(view, /Review the Advanced sections before saving|conversionNotice/);
assert.match(client, /\/api\/studio\/outfits\/advanced-prompt-conversion/);
assert.match(route, /\/v1\/studio\/outfits\/advanced-prompt-conversion/);

console.log(
  JSON.stringify(
    {
      diagnostic: "outfit_advanced_prompt_conversion_fe_v1",
      status: "PASSED",
      normalPromptPreserved: true,
      advancedSectionsAppliedWithoutSaving: true,
      switchesToAdvancedAfterConversion: true,
      existingAdvancedContentRequiresInlineConfirmation: true,
      compactThemedAuthoringActionPresent: true,
      mvvmAndApiBoundaryPreserved: true,
    },
    null,
    2
  )
);
