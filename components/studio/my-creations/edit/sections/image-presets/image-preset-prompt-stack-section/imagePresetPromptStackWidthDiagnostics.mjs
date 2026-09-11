import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(
  path.join(here, "ImagePresetPromptStackSection.view.jsx"),
  "utf8"
);

assert.match(
  source,
  /<div className="min-w-0 w-full max-w-full">/,
  "Prompt Stack root must stay shrinkable inside the editor content column."
);
assert.match(
  source,
  /grid min-w-0 w-full max-w-full[^"]*gap-/,
  "Prompt Stack's single-column grid must not grow from a child's intrinsic width."
);
assert.match(
  source,
  /<div className="min-w-0 max-w-full">\s*<TextAreaField\s*label=\{imagePromptLabel\}/,
  "Standalone Image Prompt wrapper must opt out of the grid item's auto min-width."
);
assert.match(
  source,
  /max-w-full break-words[^"]*text-\[length:var\(--text-ui\)\]/,
  "Standalone prompt help copy must wrap within the section width."
);
assert.doesNotMatch(
  source,
  /PromptStackSectionView[\s\S]{0,3000}overflow-hidden/,
  "Width containment must not clip the editor's global focus ring."
);

console.log(
  JSON.stringify(
    {
      diagnostic: "image_preset_prompt_stack_width_v1",
      status: "PASSED",
      promptStackColumnShrinkable: true,
      intrinsicWidthGrowthPrevented: true,
      standalonePromptGridItemShrinkable: true,
      helpCopyWrapsWithinSection: true,
      focusRingClippingNotIntroduced: true,
    },
    null,
    2
  )
);
