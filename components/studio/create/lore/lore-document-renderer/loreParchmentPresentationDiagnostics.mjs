import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  LORE_PARCHMENT_BACKGROUNDS,
  buildLoreParchmentPresentation,
  resolveLoreParchmentBackground,
} from "./loreParchmentPresentation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Lore parchment registry targets the ten approved static assets", () => {
  assert.equal(LORE_PARCHMENT_BACKGROUNDS.length, 10);
  assert.deepEqual(
    LORE_PARCHMENT_BACKGROUNDS.map((entry) => entry.src),
    Array.from({ length: 10 }, (_, index) => `/images/parchments/${index + 1}.png`)
  );
  assert.equal(new Set(LORE_PARCHMENT_BACKGROUNDS.map((entry) => entry.id)).size, 10);
});

test("parchment selection is deterministic rather than changing on refresh", () => {
  const first = buildLoreParchmentPresentation({
    seed: "creation-123",
    chapterIds: ["chapter-a", "chapter-b", "chapter-c"],
  });
  const second = buildLoreParchmentPresentation({
    seed: "creation-123",
    chapterIds: ["chapter-a", "chapter-b", "chapter-c"],
  });

  assert.deepEqual(first, second);
  assert.equal(resolveLoreParchmentBackground("creation-123").src.startsWith("/images/parchments/"), true);
  assert.equal(first.chapters.length, 3);
  assert.equal(first.chapters.every((entry, index) => index === 0 || entry.index !== first.chapters[index - 1].index), true);
});

test("renderer ViewModel projects stable parchment presentation without transport", () => {
  const vm = read("components/studio/create/lore/lore-document-renderer/useLoreDocumentRendererViewModel.js");
  const helper = read("components/studio/create/lore/lore-document-renderer/loreParchmentPresentation.js");

  assert.match(vm, /parchmentSeed/);
  assert.match(vm, /buildLoreParchmentPresentation/);
  assert.match(vm, /parchmentPresentation/);
  assert.doesNotMatch(helper, /Math\.random|fetch\(|supabase|PostGraphile|services\/api/i);
});

test("Lore reader applies parchment to cover and chapter sheets", () => {
  const view = read("components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx");
  const css = read("app/globals.css");

  assert.match(view, /lore-parchment-page--cover/);
  assert.match(view, /lore-parchment-page--chapter/);
  assert.match(view, /backgroundImage:/);
  assert.doesNotMatch(view, /--lore-parchment-image/);
  assert.doesNotMatch(view, /sourcebook-page lore-parchment-page/);
  assert.match(view, /data-lore-parchment/);
  assert.match(view, /Reader Index/);
  assert.match(css, /\.lore-parchment-page/);
  assert.match(css, /\.lore-parchment-page > \*/);
  assert.doesNotMatch(css.slice(css.indexOf("\/* Lore reader convergence")), /radial-gradient\(circle at 12% 78%/);
  assert.match(css, /background-size:\s*100% 100%, 100% auto/);
  assert.match(css, /\.lore-parchment-page--chapter[\s\S]*background-repeat:\s*no-repeat, repeat-y/);
  assert.match(css, /\.lore-parchment-page--chapter[\s\S]*background-size:\s*100% 100%, 100% auto/);
  assert.match(css, /\.lore-parchment-page--cover[\s\S]*background-size:\s*100% 100%, cover/);
  assert.doesNotMatch(css, /\.lore-parchment-page--chapter[\s\S]*background-size:\s*100% 100%;/);
  assert.match(css, /background-color:\s*#e4d4b8/);
  assert.match(css, /\.lore-parchment-plate__frame/);
  assert.match(css, /\.lore-parchment-plate__caption/);
  assert.match(css, /\.lore-reader-index/);
});

test("public and owner Lore readers seed parchment from the Creation identity", () => {
  const publicPage = read("components/studio/creations/lore/LorePublicCreationPage.jsx");
  const ownerPreview = read("app/studio/my-creations/[id]/preview/page.js");
  const editProjection = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");

  assert.match(publicPage, /parchmentSeed=\{creation\.id\}/);
  assert.match(ownerPreview, /parchmentSeed=\{creation\.id\}/);
  assert.match(editProjection, /parchmentSeed:\s*ctx\.creationId/);
});

console.log("Lore parchment presentation diagnostics passed.");
