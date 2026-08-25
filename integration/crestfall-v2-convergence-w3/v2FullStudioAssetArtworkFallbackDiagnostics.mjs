import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const viewPath = path.join(root, "app/studio/v2/studio/studio/StudioModePanels.view.jsx");
const view = fs.readFileSync(viewPath, "utf8");

function fallbackPathsFromSource(source) {
  const match = source.match(/const STUDIO_ASSET_FALLBACK_ART_BY_TITLE = Object\.freeze\(\{([\s\S]*?)\}\);/);
  assert.ok(match, "fallback artwork map must exist");
  return [...match[1].matchAll(/:\s*"(\/assets\/[^"]+)"/g)].map((entry) => entry[1]);
}

test("live Full Studio asset cards always render an image with runtime fallback", () => {
  assert.match(view, /function FullStudioAssetCard/);
  assert.match(view, /const fallbackArt = getStudioAssetFallbackArt\(asset\)/);
  assert.match(view, /const art = hasUsableArt\(asset\) \? String\(asset\.image\) : fallbackArt/);
  assert.match(view, /<img[\s\S]*src=\{art\}[\s\S]*onError=\{\(event\) => applyStudioAssetArtFallback\(event, fallbackArt\)\}/);
});

test("broken authored URLs swap once to a curated fallback and then fail cleanly", () => {
  assert.match(view, /function applyStudioAssetArtFallback/);
  assert.match(view, /image\.dataset\.fallbackApplied !== "true"/);
  assert.match(view, /image\.src = fallbackArt/);
  assert.match(view, /image\.hidden = true/);
});

test("known broken-card types have explicit Crestfall fallback artwork", () => {
  const mapMatch = view.match(/const STUDIO_ASSET_FALLBACK_ART_BY_TITLE = Object\.freeze\(\{([\s\S]*?)\}\);/);
  assert.ok(mapMatch, "fallback artwork map must exist");
  const mapSource = mapMatch[1];

  for (const title of ["Character", "Player Character", "Scenario", "Location", "Lore Asset"]) {
    const quoted = `"${title}"`;
    assert.equal(
      mapSource.includes(quoted) || mapSource.includes(`${title}:`),
      true,
      `missing explicit fallback for ${title}`
    );
  }
});

test("every curated fallback path exists in the public asset tree", () => {
  const paths = fallbackPathsFromSource(view);
  assert.ok(paths.length >= 20, "expected a broad tool-specific fallback map");
  for (const publicPath of paths) {
    const absolute = path.join(root, "public", publicPath.replace(/^\//, ""));
    assert.equal(fs.existsSync(absolute), true, `missing fallback artwork: ${publicPath}`);
  }
});
