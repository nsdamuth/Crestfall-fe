import assert from "node:assert/strict";

import {
  getCreationReferenceId,
  hydrateCreationReference,
  indexCreationSummaries,
} from "./creationReferenceHydration.js";

const registryId = "11111111-1111-4111-8111-111111111111";
const profileId = "22222222-2222-4222-8222-222222222222";

const index = indexCreationSummaries([
  {
    id: registryId,
    type: "NPC_REGISTRY",
    title: "Aruahol Registry",
    description: "Named NPCs and knowledge boundaries.",
  },
  {
    id: profileId,
    type: "ACTOR_MECHANICS_PROFILE",
    title: "Roadsworn Mechanics",
    description: "Reusable actor mechanics.",
  },
]);

const legacyRegistry = {
  id: `legacy_${registryId}`,
  creationId: registryId,
  title: registryId,
  type: "REGISTRY",
  notes: "Keep this Story-scoped.",
};

const hydratedRegistry = hydrateCreationReference(legacyRegistry, index, {
  fallbackType: "NPC_REGISTRY",
});

assert.equal(getCreationReferenceId(legacyRegistry), registryId);
assert.equal(hydratedRegistry.title, "Aruahol Registry");
assert.equal(hydratedRegistry.type, "NPC_REGISTRY");
assert.equal(hydratedRegistry.notes, "Keep this Story-scoped.");
assert.equal(hydratedRegistry.id, `legacy_${registryId}`);

const legacyProfile = hydrateCreationReference(
  { creationId: profileId, title: profileId, notes: "Actor-local note." },
  index,
  { fallbackType: "ACTOR_MECHANICS_PROFILE" }
);
assert.equal(legacyProfile.title, "Roadsworn Mechanics");
assert.equal(legacyProfile.notes, "Actor-local note.");

const missing = hydrateCreationReference(
  { creationId: "missing", title: "missing" },
  index
);
assert.equal(missing.title, "missing");

console.log("creationReferenceHydration diagnostics passed");
