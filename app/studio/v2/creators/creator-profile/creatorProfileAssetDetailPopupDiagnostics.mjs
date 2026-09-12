import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const livePath = path.resolve(here, "../CreatorProfileLive.jsx");
const live = readFileSync(livePath, "utf8");

assert.match(live, /import KitAssetDetailPopup from "@\/components\/kit\/KitAssetDetailPopup";/);
assert.match(live, /const \[assetDetailId, setAssetDetailId\] = useState\(null\);/);
assert.match(live, /onOpenAssetDetail: \(\) => setAssetDetailId\(item\.id\)/);
assert.match(live, /onOpenImageOverlay: \(\) => setAssetDetailId\(item\.id\)/);
assert.match(live, /<KitAssetDetailPopup/);
assert.match(live, /metrics=\{item\.metrics\}/);
assert.match(live, /onViewCatalogue=\{\(\) =>/);
assert.match(live, /router\.push\(`\/studio\/creations\/\$\{encodeURIComponent\(item\.id\)\}`\)/);
assert.match(live, /onClose=\{\(\) => setAssetDetailId\(null\)\}/);
assert.doesNotMatch(
  live,
  /onOpenAssetDetail: \(\) => router\.push\(`\/studio\/creations\//
);

console.log("creatorProfileAssetDetailPopupDiagnostics: PASS");
