import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Guided Build milestone art uses verified public defaults before stale asset paths", () => {
  const view = read(
    "components/studio/create/creation-studio/CreationStudio.view.jsx"
  );

  assert.match(view, /GUIDED_MILESTONE_DEFAULT_ART/);
  assert.match(view, /\/assets\/characters\/crestfall\/lux\/profile\.png/);
  assert.match(view, /\/assets\/locations\/aethelgard\/amphitheater\/profile\.png/);
  assert.match(view, /\/assets\/covers\/crestfall-book-cover\.png/);
  assert.match(view, /GUIDED_MILESTONE_DEFAULT_ART\[asset\?\.title\] \|\| asset\?\.image/);
  assert.match(view, /style=\{\{ backgroundImage: `url\(\$\{image\}\)` \}\}/);
  assert.doesNotMatch(view, /fetch\s*\(|createClient|supabase|postgraphile/i);
});

test("recommended milestone renders its asset image as presentation", () => {
  const view = read(
    "components/studio/create/creation-studio/CreationStudio.view.jsx"
  );

  assert.match(
    view,
    /function RecommendedNextPanel[\s\S]*<GuidedMilestoneArtwork asset=\{asset\} emphasis \/>/
  );
});

test("guided milestone cards use full-card artwork treatment", () => {
  const view = read(
    "components/studio/create/creation-studio/CreationStudio.view.jsx"
  );

  assert.match(
    view,
    /function GuidedChapterStep[\s\S]*min-h-\[220px\][\s\S]*<GuidedMilestoneArtwork asset=\{asset\} \/>[\s\S]*font-display text-\[1\.95rem\]/
  );
  assert.match(
    view,
    /if \(step\.complete\)[\s\S]*min-h-\[220px\][\s\S]*<GuidedMilestoneArtwork asset=\{asset\} \/>/
  );
});

test("active guided milestone keeps current-state emphasis over the same artwork", () => {
  const view = read(
    "components/studio/create/creation-studio/CreationStudio.view.jsx"
  );

  assert.match(
    view,
    /<GuidedMilestoneArtwork asset=\{asset\} emphasis=\{step\.current\} \/>/
  );
});

test("milestone artwork now uses a clearly visible full-card treatment", () => {
  const view = read(
    "components/studio/create/creation-studio/CreationStudio.view.jsx"
  );

  assert.match(view, /bg-gradient-to-br from-black\/82 via-black\/68 to-black\/45/);
  assert.match(view, /relative z-10/);
  assert.match(view, /group-hover:scale-\[1\.02\] group-hover:saturate-110/);
});
