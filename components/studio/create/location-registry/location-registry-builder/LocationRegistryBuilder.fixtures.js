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
  characterOptions: [],
  characterLoadError: "",
  npcEntryOptions: [],
  npcEntryLoadError: "",
  crossRegistry: {
    authoringAvailable: false,
    registryOptions: [],
    referenceRegistryLoadError: "",
    connectionFromLocationOptions: [],
    connectionToLocationOptions: [],
  },
  splitPreview: {
    available: false,
    open: false,
    analysis: null,
    selectedCandidateIds: [],
    selectedCount: 0,
    planStatus: "idle",
    planMessage: "",
    serverPlan: null,
    creatorConfirmed: false,
    busy: false,
  },
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


export const locationRegistryBuilderPresenceDirectCharacterFixture =
  withTab("presence", {
    characterOptions: [{
      id: "fixture-character-kessa",
      title: "Kessa Cindervell",
      subtitle: "Artificer and workshop owner",
      description: "A full Character linked directly to this Location Registry.",
      imageUrl: "",
      contentRating: "SFW",
      visibility: "PRIVATE",
      status: "DRAFT",
    }],
    characterLoadError: "",
    npcEntryOptions: [{
      id: "fixture-npc-registry:fixture-shopper",
      title: "Workshop Customer",
      subtitle: "Old Crescent NPCs · Lightweight NPC",
      description: "A lightweight Registry-owned recurring customer.",
      imageUrl: "",
      type: "LIGHTWEIGHT_NPC",
      registryCreationId: "fixture-npc-registry",
      registryEntryId: "fixture-shopper",
      registryTitle: "Old Crescent NPCs",
      entryKind: "AD_HOC",
    }],
    npcEntryLoadError: "",
    presenceBindingDraft: {
      id: "presence-direct-kessa",
      locationEntryId: "location_workshop",
      relationshipRole: "OWNER",
      frequency: "COMMON",
      automaticPresence: true,
      opportunityTriggers: ["SCENE_START"],
      cooldownTurns: 6,
      minimumAbsentTurns: 2,
      guidance: "Usually present during business hours.",
      person: {
        kind: "CREATION_REF",
        creationId: "fixture-character-kessa",
        creationType: "CHARACTER",
        displayName: "Kessa Cindervell",
        contentRating: "SFW",
        visibility: "PRIVATE",
        status: "DRAFT",
        referenceStatus: "RESOLVED",
      },
      conditions: { dayparts: [], requiredSceneTags: [], excludedSceneTags: [], requiredFlags: [] },
    },
  });

export const locationRegistryBuilderPresenceUnavailableFixture =
  withTab("presence", {
    characterOptions: [],
    characterLoadError: "",
    npcEntryOptions: [],
    npcEntryLoadError: "",
    presenceBindingDraft: {
      id: "presence-missing",
      locationEntryId: "location_workshop",
      relationshipRole: "VISITOR",
      frequency: "OCCASIONAL",
      automaticPresence: false,
      opportunityTriggers: [],
      cooldownTurns: 0,
      minimumAbsentTurns: 0,
      guidance: "",
      person: {
        kind: "CREATION_REF",
        creationId: "fixture-character-missing",
        creationType: "CHARACTER",
        displayName: "Linked Character unavailable",
        referenceStatus: "UNAVAILABLE",
      },
      conditions: { dayparts: [], requiredSceneTags: [], excludedSceneTags: [], requiredFlags: [] },
    },
  });


export const locationRegistryBuilderCrossRegistryConnectionFixture =
  withTab("connections", {
    mode: "edit",
    registry: {
      ...registry,
      connections: [
        {
          ...registry.connections[0],
          id: "connection_boundary",
          fromLocationId: "location_workshop",
          toLocationId: "remote_brass_gate",
          from: {
            registryCreationId: "",
            locationEntryId: "location_workshop",
            locationCreationId: "fixture-location-workshop",
          },
          to: {
            registryCreationId: "fixture-city-registry",
            locationEntryId: "remote_brass_gate",
            locationCreationId: "fixture-brass-gate",
          },
          fromLocationDisplay: "The Brasswhisker's Workshop",
          toLocationDisplay: "Aethelgard City Registry · Brass Gate",
          crossRegistry: true,
        },
      ],
    },
    connectionDraft: {
      id: "connection_boundary",
      fromLocationId: "location_workshop",
      toLocationId: "remote_brass_gate",
      from: {
        registryCreationId: "",
        locationEntryId: "location_workshop",
        locationCreationId: "fixture-location-workshop",
      },
      to: {
        registryCreationId: "fixture-city-registry",
        locationEntryId: "remote_brass_gate",
        locationCreationId: "fixture-brass-gate",
      },
      relation: "CONNECTED",
      distanceMode: "LOCAL",
      availableRouteTypes: ["WALK"],
      defaultRouteType: "WALK",
      routeType: "WALK",
      bidirectional: true,
      distanceMeters: "",
      notes: "Boundary route into the city Registry.",
    },
    crossRegistry: {
      authoringAvailable: true,
      registryOptions: [
        {
          value: "fixture-city-registry",
          label: "Aethelgard City Registry",
        },
      ],
      referenceRegistryLoadError: "",
      connectionFromLocationOptions: [],
      connectionToLocationOptions: [
        {
          id: "remote_brass_gate",
          value: "remote_brass_gate",
          label: "Brass Gate",
          creationId: "fixture-brass-gate",
        },
        {
          id: "remote_market",
          value: "remote_market",
          label: "Central Market",
          creationId: "",
        },
      ],
    },
  });

export const locationRegistryBuilderCrossRegistryDegradedFixture =
  withTab("connections", {
    mode: "edit",
    connectionDraft: {
      id: "connection_degraded",
      fromLocationId: "missing_remote_location",
      toLocationId: "location_workshop",
      from: {
        registryCreationId: "fixture-roads-registry",
        locationEntryId: "missing_remote_location",
        locationCreationId: "fixture-missing-location",
      },
      to: {
        registryCreationId: "",
        locationEntryId: "location_workshop",
        locationCreationId: "fixture-location-workshop",
      },
      relation: "CONNECTED",
      distanceMode: "REGIONAL",
      availableRouteTypes: ["WALK"],
      defaultRouteType: "WALK",
      routeType: "WALK",
      bidirectional: false,
      distanceMeters: "",
      notes: "",
    },
    crossRegistry: {
      authoringAvailable: true,
      registryOptions: [
        {
          value: "fixture-roads-registry",
          label: "Outer Roads Registry",
        },
      ],
      referenceRegistryLoadError:
        "A referenced Location Registry could not be loaded.",
      connectionFromLocationOptions: [],
      connectionToLocationOptions: [],
    },
  });


const splitCandidateFixture = Object.freeze({
  id: "split:location_old_crescent",
  scopeEntryId: "location_old_crescent",
  scopeName: "Old Crescent",
  suggestedChildTitle: "Old Crescent Child Registry",
  status: "PREVIEW_READY",
  entryCount: 3,
  internalConnectionCount: 2,
  boundaryConnectionCount: 1,
  presenceBindingCount: 1,
  nestedChildReferenceRewriteCount: 0,
  movedEntryNames: [
    "The Brasswhisker's Workshop",
    "Market Lane",
    "Glassworkers' Court",
  ],
  overlapCount: 0,
  overlappingCandidateIds: [],
  existingChildRegistryCreationId: "",
});

export const locationRegistryBuilderSplitPreviewFixture =
  withTab("entries", {
    mode: "edit",
    splitPreview: {
      available: true,
      open: true,
      analysis: {
        status: "PREVIEW_READY",
        source: {
          entryCount: 4,
          connectionCount: 3,
          presenceBindingCount: 1,
        },
        previewReadyCount: 1,
        issues: [],
        candidates: [splitCandidateFixture],
      },
      selectedCandidateIds: ["split:location_old_crescent"],
      selectedCount: 1,
      planStatus: "idle",
      planMessage: "",
      serverPlan: null,
      creatorConfirmed: false,
      busy: false,
    },
  });

export const locationRegistryBuilderSplitBlockedFixture =
  withTab("entries", {
    mode: "edit",
    splitPreview: {
      available: true,
      open: true,
      analysis: {
        status: "BLOCKED_SOURCE_INTEGRITY",
        source: {
          entryCount: 4,
          connectionCount: 3,
          presenceBindingCount: 1,
        },
        previewReadyCount: 0,
        issues: [
          {
            code: "DANGLING_PARENT",
            referenceId: "location_missing_parent",
            message:
              "A Location parent reference does not resolve inside the source Registry.",
          },
        ],
        candidates: [],
      },
      selectedCandidateIds: [],
      selectedCount: 0,
      planStatus: "blocked",
      planMessage:
        "Source integrity issues must be corrected before planning.",
      serverPlan: null,
      creatorConfirmed: false,
      busy: false,
    },
  });

export const locationRegistryBuilderSplitCommitReadyFixture =
  withTab("entries", {
    mode: "edit",
    splitPreview: {
      available: true,
      open: true,
      analysis: {
        status: "PREVIEW_READY",
        source: {
          entryCount: 4,
          connectionCount: 3,
          presenceBindingCount: 1,
        },
        previewReadyCount: 1,
        issues: [],
        candidates: [splitCandidateFixture],
      },
      selectedCandidateIds: ["split:location_old_crescent"],
      selectedCount: 1,
      planStatus: "ready",
      planMessage:
        "Server-authoritative split plan is ready for creator confirmation.",
      serverPlan: {
        planFingerprint:
          "fixture-plan-fingerprint-0123456789",
        sourceFingerprint:
          "fixture-source-fingerprint-0123456789",
        selection: [
          {
            candidateId:
              "split:location_old_crescent",
          },
        ],
        integrity: {
          status: "PRESERVED",
          before: {
            entries: 4,
            connections: 3,
            presenceBindings: 1,
          },
          after: {
            entries: 4,
            connections: 3,
            presenceBindings: 1,
          },
        },
        executionGate: {
          commitReady: true,
          blockers: [],
        },
      },
      creatorConfirmed: true,
      busy: false,
    },
  });
