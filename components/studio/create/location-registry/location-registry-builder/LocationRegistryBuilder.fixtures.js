import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  buildLocationRegistryBuilderTabs,
} from "./LocationRegistryBuilder.contract";

const registry = Object.freeze({
  title: "Old Crescent Location Registry",
  description:
    "Tracks the artisan quarter, connected workshops, public lanes, and recurring local presence.",
  scope: "Old Crescent district and attached Story rooms",
  entries: [
    {
      id: "location_workshop",
      kind: "CREATION_REF",
      creationId: "fixture-location-workshop",
      name: "The Brasswhisker's Workshop",
      category: "BUILDING",
      locationScale: "BUILDING",
      spaceType: "PHYSICAL",
      parentLocationId: "location_old_crescent",
      weatherScopeId: "weather_old_crescent",
      region: "Old Crescent",
      mood: "Warm, cluttered, mechanically alert",
      summary: "Kessa's workshop, appraisal counter, and artificer den.",
      aliases: ["Brasswhisker Workshop"],
      themes: ["craft", "commerce"],
      sceneAffordances: ["investigation", "repair"],
    },
    {
      id: "location_old_crescent",
      kind: "AD_HOC",
      creationId: "",
      name: "Old Crescent",
      category: "DISTRICT",
      locationScale: "DISTRICT",
      spaceType: "PHYSICAL",
      parentLocationId: "",
      weatherScopeId: "weather_old_crescent",
      region: "Aethelgard",
      mood: "Busy artisan quarter",
      summary: "A district of workshops, markets, glassworkers, and old lanes.",
      aliases: [],
      themes: ["artisan trade"],
      sceneAffordances: ["social", "investigation"],
    },
  ],
  connections: [
    {
      id: "connection_market_lane",
      fromLocationId: "location_workshop",
      toLocationId: "location_old_crescent",
      relation: "INSIDE",
      distanceMode: "NEAR",
      availableRouteTypes: ["WALK"],
      defaultRouteType: "WALK",
      routeType: "WALK",
      bidirectional: true,
      accessRules: "The workshop opens directly onto the district lane.",
      notes: "Ordinary foot traffic.",
    },
  ],
  presenceBindings: [
    {
      id: "presence_kessa",
      locationEntryId: "location_workshop",
      relationshipRole: "OWNER",
      frequency: "COMMON",
      automaticPresence: true,
      opportunityTriggers: ["SCENE_START"],
      cooldownTurns: 6,
      minimumAbsentTurns: 2,
      guidance: "Usually present during business hours unless already active elsewhere.",
      person: {
        registryCreationId: "fixture-npc-registry",
        registryEntryId: "fixture-kessa",
        displayName: "Kessa Cindervell",
        registryTitle: "Old Crescent NPCs",
        entryKind: "CHARACTER_REF",
      },
      conditions: {
        dayparts: ["MORNING", "AFTERNOON"],
        requiredSceneTags: ["business_hours"],
        excludedSceneTags: ["workshop_closed"],
        requiredFlags: [],
      },
    },
  ],
  weatherScopes: [
    {
      id: "weather_old_crescent",
      name: "Old Crescent Street Weather",
      scopeType: "DISTRICT",
      defaultWeatherBehavior: "Use Aethelgard city weather unless overridden.",
      notes: "Workshop interiors inherit exterior ambience without direct rain.",
    },
  ],
  promptGuidance: {
    summary: "Use this registry for Old Crescent place continuity.",
    usageNotes: "Resolve named locations and local presence before inventing new places.",
  },
  runtimeGuidance: {
    movementResolverNotes: "Use authored connections for local travel.",
    adHocLocationPolicy: "Temporary places remain in hydrated runtime state only.",
  },
  middlewareHints: {
    allowRuntimeMutation: true,
    intendedUse: ["location continuity", "travel resolution", "presence opportunities"],
  },
});

const optionSets = Object.freeze({
  locationCategoryOptions: ["BUILDING", "DISTRICT", "ROOM", "STREET", "LANDMARK"],
  locationScaleOptions: ["ROOM", "BUILDING", "DISTRICT", "CITY", "REGION", "REALM"],
  spaceTypeOptions: ["PHYSICAL", "DREAMLIKE", "VIRTUAL", "POCKET_REALM"],
  connectionRelationOptions: ["INSIDE", "ADJACENT", "CONNECTED", "ABOVE", "BELOW"],
  routeTypeOptions: ["WALK", "VEHICLE", "PORTAL", "FLIGHT", "UNKNOWN"],
  distanceModeOptions: [
    { value: "IMMEDIATE", label: "0 · Immediate" },
    { value: "NEAR", label: "2 · Near" },
    { value: "LOCAL", label: "4 · Local" },
    { value: "REGIONAL", label: "7 · Regional" },
    { value: "UNKNOWN", label: "Unknown / Unset" },
  ],
  presenceRelationshipRoleOptions: ["OWNER", "OCCUPANT", "WORKER", "VISITOR"],
  presenceFrequencyOptions: ["ALWAYS", "COMMON", "OCCASIONAL", "RARE"],
  presenceOpportunityTriggerOptions: ["SCENE_START", "ARRIVAL", "TIME_CHANGE"],
});

const baseFixture = Object.freeze({
  contractVersion: LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  mode: "create",
  currentTab: "overview",
  hideTabs: false,
  tabs: buildLocationRegistryBuilderTabs("overview"),
  registry,
  saveStatus: "idle",
  saveMessage: "",
  entryDraft: null,
  connectionDraft: null,
  presenceBindingDraft: null,
  weatherScopeDraft: null,
  locationOptions: [],
  locationLoadError: "",
  npcEntryOptions: [],
  npcEntryLoadError: "",
  optionSets,
});

function withTab(tabId, overrides = {}) {
  return Object.freeze({
    ...baseFixture,
    ...overrides,
    currentTab: tabId,
    tabs: buildLocationRegistryBuilderTabs(tabId),
  });
}

export const locationRegistryBuilderOverviewFixture = withTab("overview");
export const locationRegistryBuilderEntriesFixture = withTab("entries");
export const locationRegistryBuilderConnectionsFixture = withTab("connections");
export const locationRegistryBuilderPresenceFixture = withTab("presence");
export const locationRegistryBuilderWeatherFixture = withTab("weather");
export const locationRegistryBuilderRuntimeFixture = withTab("runtime");
export const locationRegistryBuilderEditFixture = withTab("entries", {
  mode: "edit",
  hideTabs: true,
});
export const locationRegistryBuilderSavingFixture = withTab("overview", {
  saveStatus: "saving",
});
export const locationRegistryBuilderErrorFixture = withTab("overview", {
  saveStatus: "error",
  saveMessage: "Location registry could not be saved.",
});
