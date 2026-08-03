import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../../../..");

function read(relativePath) {
  return readFileSync(resolve(repoRoot, relativePath), "utf8");
}

const shell = read(
  "components/studio/create/npc-registry/NpcEntryModal.jsx"
);
const view = read(
  "components/studio/create/npc-registry/npc-entry/NpcEntryModal.view.jsx"
);
const viewModel = read(
  "components/studio/create/npc-registry/npc-entry/useNpcEntryModalViewModel.js"
);
const contract = read(
  "components/studio/create/npc-registry/npc-entry/NpcEntryModal.contract.js"
);
const fixtures = read(
  "components/studio/create/npc-registry/npc-entry/NpcEntryModal.fixtures.js"
);
const builderVm = read(
  "components/studio/create/npc-registry/npc-registry-builder/useNpcRegistryBuilderViewModel.js"
);
const editor = read(
  "components/studio/registries/hooks/useNpcRegistryEditor.js"
);
const registryUtils = read(
  "components/studio/registries/npcRegistryUtils.js"
);
const createShell = read(
  "components/studio/create/npc-registry/NpcRegistryBuilder.jsx"
);
const editShell = read(
  "components/studio/my-creations/edit/sections/npc-registries/NpcRegistryFieldsSection.jsx"
);

assert.match(shell, /ActorMechanicsProfileAttachmentSection/);
assert.match(shell, /actorType="NPC_REGISTRY_ENTRY"/);
assert.match(shell, /getNpcRegistryEntryActorId\(draft\.id\)/);
assert.match(shell, /actorMechanicsProfileAttachmentContent/);
assert.match(shell, /Sparse NPC runtime hydration and actor-state initialization are introduced separately/);
assert.doesNotMatch(shell, /\bfetch\s*\(|supabase|PostGraphile/);

assert.match(view, /actorMechanicsProfileAttachmentContent/);
assert.match(view, /linkedCharacterMechanicsNote/);
assert.match(view, /!isLinkedCharacterMode/);
assert.doesNotMatch(
  view,
  /actorMechanicsProfileId|actorMechanicsProfileLink|updateDataField|fetch\s*\(/
);

assert.match(viewModel, /Linked Character entries use the Actor Mechanics Profile attached to the Character creation/);
assert.match(contract, /NPC_ENTRY_MODAL_VIEW_CONTRACT_VERSION = "1\.1\.0"/);
assert.match(contract, /actorMechanicsProfileAttachmentContent/);
assert.match(fixtures, /npcEntryLightweightMechanicsFixture/);

for (const source of [builderVm, editor]) {
  assert.match(
    source,
    /clearNpcRegistryEntryActorMechanicsProfileAttachment/
  );
  assert.match(source, /kind === "CREATION_REF"/);
}

assert.match(registryUtils, /getNpcRegistryEntryActorId/);
assert.match(
  registryUtils,
  /clearNpcRegistryEntryActorMechanicsProfileAttachment/
);
assert.match(
  registryUtils,
  /getNpcRegistryEntryActorMechanicsProfileAttachment/
);

assert.match(createShell, /<NpcEntryModal/);
assert.match(editShell, /<NpcEntryModal/);

console.log(
  JSON.stringify(
    {
      diagnostic:
        "npc_registry_entry_actor_mechanics_profile_attachment_loom_v0",
      status: "PASSED",
      ownerType: "NPC_REGISTRY_ENTRY",
      lightweightEntryAttachmentAvailable: true,
      linkedCharacterUsesCharacterAttachment: true,
      runtimeHydrationIncluded: false,
      directPersistenceAllowedByView: false,
    },
    null,
    2
  )
);
