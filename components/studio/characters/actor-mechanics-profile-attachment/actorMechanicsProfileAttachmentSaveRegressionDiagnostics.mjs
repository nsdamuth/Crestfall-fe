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

test("Actor Mechanics attachment reads the persisted graph projection returned after save", () => {
  const viewModel = read(
    "components/studio/characters/actor-mechanics-profile-attachment/useActorMechanicsProfileAttachmentSectionViewModel.js"
  );

  assert.match(viewModel, /actorMechanicsProfileAttachmentGraph/);
  assert.match(viewModel, /profileCreationId/);
  assert.match(viewModel, /profileContractVersion/);
  assert.match(viewModel, /enabledDomains/);
});

test("Actor Mechanics attachment writes a draft selection instead of legacy JSON authority", () => {
  const viewModel = read(
    "components/studio/characters/actor-mechanics-profile-attachment/useActorMechanicsProfileAttachmentSectionViewModel.js"
  );

  assert.match(viewModel, /actorMechanicsProfileAttachmentDraft/);
  assert.doesNotMatch(
    viewModel,
    /updateDataField\?\.\(\s*["']actorMechanicsProfileId["']/
  );
  assert.doesNotMatch(
    viewModel,
    /updateDataField\?\.\(\s*["']actorMechanicsProfileLink["']/
  );
});
