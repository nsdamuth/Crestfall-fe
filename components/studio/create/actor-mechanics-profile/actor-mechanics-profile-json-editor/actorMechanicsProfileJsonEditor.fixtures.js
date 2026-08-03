import {
  ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
  ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
  ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION,
} from "../actor-mechanics-profile-editor/ActorMechanicsProfileEditor.contract.js";

export const actorMechanicsProfileJsonEditorFixture = Object.freeze({
  contractVersion: ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION,
  presetId: "STATTED_NPC",
  title: "Statted NPC",
  summary:
    "Actor-scoped Stats and Progression definitions for an important NPC.",
  enabled: true,
  owner: {
    bindingMode: "BOUND_ACTOR",
    ownerType: "NPC_REGISTRY_ENTRY",
    ownerId: "npc-registry-entry:captain-veren",
    ownerTitle: "Captain Veren",
  },
  statePolicy: {
    isolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
    namespaceStrategy: ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
    sharedDefinitionsAllowed: true,
    sharedMutableStateAllowed: false,
  },
  capabilityPolicy: {
    mode: "STANDARD",
    opposedResolutionPolicy: "DETERMINISTIC",
    workingModeProfile: "",
    notes: "",
  },
  bindings: [
    {
      bindingVersion: ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
      id: "stats",
      domain: "STATS",
      title: "Guard Captain Stats",
      enabled: true,
      required: true,
      stateIsolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
      activation: { mode: "ON_DEMAND", domains: ["STATS"] },
      references: [
        {
          referenceType: "CREATION",
          sourceId: "3922a33f-dd34-4a4b-9b48-77b365ca3d5f",
          version: ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION,
          title: "Core Adventurer Stats and Pools",
          metadata: {
            creationType: "STATS_POOLS_PROFILE",
            contractVersion:
              ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION,
          },
        },
      ],
      notes: "",
      order: 0,
      metadata: {},
    },
    {
      bindingVersion: ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
      id: "progression",
      domain: "PROGRESSION",
      title: "Adventurer Progression",
      enabled: true,
      required: false,
      stateIsolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
      activation: { mode: "ON_DEMAND", domains: ["PROGRESSION"] },
      references: [
        {
          referenceType: "CREATION",
          sourceId: "a8af88bb-8147-460f-9748-9cff1ceb59c8",
          version: ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
          title: "Adventurer Progression",
          metadata: {
            creationType: "PROGRESSION_PROFILE",
            contractVersion:
              ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
          },
        },
      ],
      notes: "",
      order: 1,
      metadata: {},
    },
  ],
  metadata: {},
});
