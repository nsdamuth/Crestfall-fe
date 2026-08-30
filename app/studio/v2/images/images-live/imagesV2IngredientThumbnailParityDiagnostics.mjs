import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Image Studio requests the same summary media projection used by Vault", () => {
  const imageStudioClient = read(
    "lib/client/studio/image-studio/imageStudioClient.js"
  );
  const creationClient = read(
    "lib/client/studio/creations/creationClient.js"
  );
  const vaultPageData = read("lib/server/studio/getMyCreationsPageData.js");

  assert.match(vaultPageData, /\/api\/creations\?view=summary/);
  assert.match(imageStudioClient, /view:\s*["']summary["']/);
  assert.match(creationClient, /if \(filters\.view\)/);
  assert.match(creationClient, /searchParams\.set\(["']view["'], filters\.view\)/);
});

test("Image Studio keeps shared creation-media resolution for assigned primary images", () => {
  const imageStudioUtils = read(
    "components/studio/image-studio/imageStudioUtils.js"
  );
  const creationMedia = read("lib/shared/creations/creationMedia.js");

  assert.match(imageStudioUtils, /buildFeaturedMedia/);
  assert.match(imageStudioUtils, /getFirstCreationImageUrl/);
  assert.match(creationMedia, /row\.featuredMedia/);
  assert.match(creationMedia, /row\.featured_media/);
  assert.match(creationMedia, /row\.imageUrl/);
  assert.match(creationMedia, /row\.image_url/);
});

test("Image Studio generation remains asset-id based after summary projection", () => {
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(workbench, /return item\.id \|\| null/);
  assert.match(workbench, /mode:\s*["']asset["']/);
  assert.match(workbench, /assetId/);
});
