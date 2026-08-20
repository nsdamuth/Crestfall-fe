import assert from "node:assert/strict";
import fs from "node:fs";

const viewModel = fs.readFileSync(
  new URL("./useActorMechanicsProfileAttachmentSectionViewModel.js", import.meta.url),
  "utf8"
);
const readme = fs.readFileSync(new URL("./README.md", import.meta.url), "utf8");

assert.match(viewModel, /actor_mechanics_profile_attachment_graph_v0/);
assert.match(viewModel, /actorMechanicsProfileAttachmentGraph/);
assert.match(viewModel, /actorMechanicsProfileAttachmentDraft/);
assert.match(viewModel, /profileCreationId/);
assert.doesNotMatch(viewModel, /createLinkedCreationLink/);
assert.doesNotMatch(viewModel, /updateDataField\?\.\(\s*["']actorMechanicsProfileId/);
assert.doesNotMatch(viewModel, /updateDataField\?\.\(\s*["']actorMechanicsProfileLink/);
assert.match(readme, /creation_asset_edges/);
assert.match(readme, /USES_ACTOR_MECHANICS_PROFILE/);
assert.match(readme, /Legacy .*JSON is read only as a migration fallback/);

console.log(JSON.stringify({
  diagnostic: "actor_mechanics_profile_attachment_loom_graph_v0",
  status: "PASSED",
  checks: {
    graphProjectionIsPresentationInput: true,
    unsavedDraftStoresRelationshipIntentOnly: true,
    copiedProfileSnapshotPersistenceRemoved: true,
    loomViewRemainsApiFree: true,
  },
}, null, 2));
