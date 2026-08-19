import {
  buildFeaturedMedia,
  getDefaultCreationImageForType,
  getFirstCreationImageUrl,
} from "@/lib/shared/creations/creationMedia";

export const LOCATION_REGISTRY_KIND = "LOCATION_REGISTRY";
export const LOCATION_REGISTRY_VERSION = "1.4";
export const LOCATION_REGISTRY_HIERARCHY_CONTRACT_VERSION =
  "location_registry_hierarchy_v1";
export const LOCATION_REGISTRY_CROSS_REGISTRY_LOCATION_CONTRACT_VERSION =
  "location_registry_cross_registry_location_v1";

export const LOCATION_REGISTRY_CHILD_LOAD_POLICY_OPTIONS = [
  "LOCATION_SCOPED",
];

export const LOCATION_CATEGORY_OPTIONS = [
  "General",
  "World / Region",
  "City / Town",
  "Neighborhood / District",
  "Street / Route",
  "Building",
  "Room / Interior",
  "Business / Venue",
  "Bar / Tavern",
  "Shop / Market",
  "Residential",
  "Industrial",
  "Government / Civic",
  "Faction Territory",
  "Wilderness",
  "Hidden / Restricted",
  "Transit / Travel",
  "Other",
];

export const LOCATION_SCALE_OPTIONS = [
  "WORLD",
  "REGION",
  "CITY",
  "DISTRICT",
  "NEIGHBORHOOD",
  "STREET",
  "BUILDING",
  "ROOM",
  "LANDMARK",
  "ROUTE",
  "POCKET_SPACE",
  "UNKNOWN",
];

export const SPACE_TYPE_OPTIONS = [
  "INDOOR",
  "OUTDOOR",
  "MIXED",
  "UNDERGROUND",
  "VEHICLE",
  "VIRTUAL",
  "DREAMLIKE",
  "UNKNOWN",
];


export const PRESENCE_RELATIONSHIP_ROLE_OPTIONS = [
  "OWNER",
  "OPERATOR",
  "RESIDENT",
  "EMPLOYEE",
  "GUARDIAN",
  "COMMON_OCCUPANT",
  "COMMON_VISITOR",
  "OCCASIONAL_VISITOR",
];

export const PRESENCE_FREQUENCY_OPTIONS = [
  "ALWAYS",
  "USUALLY",
  "OFTEN",
  "SOMETIMES",
  "RARELY",
  "CONDITIONAL",
  "NEVER_AUTOMATIC",
];

export const PRESENCE_OPPORTUNITY_TRIGGER_OPTIONS = [
  "LOCATION_ENTRY",
  "SCENE_START",
  "NARRATIVE_NEED",
  "RELEVANT_PROBLEM",
];

export const CONNECTION_RELATION_OPTIONS = [
  "NEXT_DOOR",
  "NEARBY",
  "INSIDE",
  "CONTAINS",
  "CONNECTED_TO",
  "ROAD_TO",
  "HALLWAY_TO",
  "STAIRS_TO",
  "ELEVATOR_TO",
  "TRANSIT_TO",
  "HIDDEN_PASSAGE",
  "SECRET_ROUTE",
  "LOCKED_ACCESS",
  "ONE_WAY",
  "OTHER",
];

export const ROUTE_TYPE_OPTIONS = [
  "WALK",
  "MOUNT",
  "DRIVE",
  "TRANSIT",
  "ELEVATOR",
  "STAIRS",
  "FLIGHT",
  "BOAT",
  "SPACEFLIGHT",
  "WARP",
  "PORTAL",
  "TELEPORT",
  "MAGICAL",
  "SECRET",
  "ABSTRACT",
  "UNKNOWN",
];

export const DISTANCE_MODE_DEFINITIONS = [
  {
    value: "ADJACENT",
    tier: 0,
    label: "Adjacent",
    description: "Immediately connected, next door, or across a shared boundary.",
  },
  {
    value: "VERY_NEAR",
    tier: 1,
    label: "Very Near",
    description: "Extremely close within the same immediate area.",
  },
  {
    value: "NEAR",
    tier: 2,
    label: "Near",
    description: "Nearby within a small shared local context.",
  },
  {
    value: "WALKABLE",
    tier: 3,
    label: "Walkable",
    description: "A normal local journey that can reasonably be crossed on foot.",
  },
  {
    value: "LOCAL_TRAVEL",
    tier: 4,
    label: "Local Travel",
    description: "Meaningful movement within the same local setting.",
  },
  {
    value: "DISTANT_LOCAL",
    tier: 5,
    label: "Distant Local",
    description: "Far apart within a city, settlement, complex, or comparable scope.",
  },
  {
    value: "REGIONAL_TRAVEL",
    tier: 6,
    label: "Regional Travel",
    description: "Substantial travel across a broader shared region.",
  },
  {
    value: "FAR_REGIONAL",
    tier: 7,
    label: "Far Regional",
    description: "A major separation within a shared world-level context.",
  },
  {
    value: "LONG_DISTANCE",
    tier: 8,
    label: "Long Distance",
    description: "A major journey across the relevant setting or world.",
  },
  {
    value: "EXTREME_DISTANCE",
    tier: 9,
    label: "Extreme Distance",
    description: "Cross-world, interplanetary, inter-realm, or equivalent separation.",
  },
  {
    value: "MAXIMUM_DISTANCE",
    tier: 10,
    label: "Maximum Distance",
    description: "The greatest meaningful separation represented by the authored scope.",
  },
];

export const DISTANCE_MODE_OPTIONS = [
  ...DISTANCE_MODE_DEFINITIONS.map((entry) => entry.value),
  "ABSTRACT",
  "UNKNOWN",
];

export const DISTANCE_TIER_BY_MODE = DISTANCE_MODE_DEFINITIONS.reduce(
  (tiers, entry) => ({
    ...tiers,
    [entry.value]: entry.tier,
  }),
  {}
);

export const EFFECTIVE_TRAVEL_TIER_DEFINITIONS = [
  {
    tier: 0,
    key: "WALKING_EQUIVALENT",
    label: "Walking / Basic Movement",
    description: "Ordinary walking or an equivalent basic movement capability.",
  },
  {
    tier: 1,
    key: "SLOW_TRAVEL",
    label: "Slow Travel",
    description: "Slower than ordinary conveyance, including difficult or encumbered travel.",
  },
  {
    tier: 2,
    key: "MODEST_TRAVEL",
    label: "Modest Travel",
    description: "A steady mount, small boat, bicycle, or comparable modest conveyance.",
  },
  {
    tier: 3,
    key: "STANDARD_TRAVEL",
    label: "Standard Travel",
    description: "An ordinary vehicle, transit system, or comparable common transport.",
  },
  {
    tier: 4,
    key: "SWIFT_TRAVEL",
    label: "Swift Travel",
    description: "A fast vehicle, exceptional mount, or efficient magical conveyance.",
  },
  {
    tier: 5,
    key: "FAST_TRAVEL",
    label: "Fast Travel",
    description: "Aircraft, advanced vehicles, or similarly rapid transportation.",
  },
  {
    tier: 6,
    key: "VERY_FAST_TRAVEL",
    label: "Very Fast Travel",
    description: "Highly advanced or extraordinary transportation with major reach.",
  },
  {
    tier: 7,
    key: "EXTREME_TRAVEL",
    label: "Extreme-Speed Travel",
    description: "Exceptional travel that crosses vast separations with relative ease.",
  },
  {
    tier: 8,
    key: "WARP_LIKE",
    label: "Warp-Like Travel",
    description: "Travel capable of rapidly crossing planetary, system, or realm-scale distances.",
  },
  {
    tier: 9,
    key: "NEAR_INSTANT",
    label: "Near-Instant Travel",
    description: "Negligible transit with only a brief visible transition, ritual, or passage.",
  },
  {
    tier: 10,
    key: "INSTANT",
    label: "Instant Relocation",
    description: "No meaningful transit occurs between origin and destination.",
  },
];

export const DEFAULT_EFFECTIVE_TRAVEL_TIER_BY_ROUTE_TYPE = {
  WALK: 0,
  MOUNT: 2,
  DRIVE: 3,
  TRANSIT: 3,
  ELEVATOR: 2,
  STAIRS: 0,
  FLIGHT: 5,
  BOAT: 2,
  SPACEFLIGHT: 5,
  WARP: 8,
  PORTAL: 9,
  TELEPORT: 10,
  MAGICAL: 4,
  SECRET: 0,
  ABSTRACT: 3,
  UNKNOWN: null,
};

export const DEFAULT_DISTANCE_MODE_BY_RELATION = {
  NEXT_DOOR: "ADJACENT",
  NEARBY: "NEAR",
  INSIDE: "ADJACENT",
  CONTAINS: "ADJACENT",
  HALLWAY_TO: "ADJACENT",
  STAIRS_TO: "VERY_NEAR",
  ELEVATOR_TO: "VERY_NEAR",
  ROAD_TO: "LOCAL_TRAVEL",
  TRANSIT_TO: "REGIONAL_TRAVEL",
  HIDDEN_PASSAGE: "WALKABLE",
  SECRET_ROUTE: "LOCAL_TRAVEL",
  CONNECTED_TO: "UNKNOWN",
  LOCKED_ACCESS: "UNKNOWN",
  ONE_WAY: "UNKNOWN",
  OTHER: "UNKNOWN",
};

export function createRegistryId(prefix = "loc") {
  const suffix =
    globalThis.crypto?.randomUUID?.() ||
    Math.random().toString(36).slice(2, 12);

  return `${prefix}_${suffix}`;
}

export function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeDistanceMode(value, fallback = "UNKNOWN") {
  const normalized = normalizeString(value).toUpperCase();
  return DISTANCE_MODE_OPTIONS.includes(normalized) ? normalized : fallback;
}

export function getDistanceTierForMode(value) {
  const mode = normalizeDistanceMode(value);
  return Number.isInteger(DISTANCE_TIER_BY_MODE[mode])
    ? DISTANCE_TIER_BY_MODE[mode]
    : null;
}

export function normalizeEffectiveTravelTier(value, fallback = null) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, 0), 10)
    : fallback;
}

function normalizeRouteType(value, fallback = "UNKNOWN") {
  const normalized = normalizeString(value).toUpperCase();
  return ROUTE_TYPE_OPTIONS.includes(normalized) ? normalized : fallback;
}

function normalizeRouteTypes(values, fallbackRouteType = "UNKNOWN") {
  const normalizedValues = Array.isArray(values)
    ? values
    : normalizeString(values)
      ? [values]
      : [];

  const routeTypes = [
    ...new Set(
      normalizedValues
        .map((value) => normalizeRouteType(value, ""))
        .filter(Boolean)
    ),
  ];

  if (routeTypes.length) return routeTypes;

  const fallback = normalizeRouteType(fallbackRouteType);
  return fallback === "UNKNOWN" ? [] : [fallback];
}

export function normalizeListText(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

export function upsertById(items = [], nextItem) {
  const exists = items.some((item) => item.id === nextItem.id);

  if (!exists) {
    return [...items, nextItem];
  }

  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

export function getLocationName(entries = [], entryId) {
  return (
    entries.find((entry) => entry.id === entryId)?.name || "Unknown Location"
  );
}

export function getWeatherScopeName(scopes = [], scopeId) {
  return (
    scopes.find((scope) => scope.id === scopeId)?.name ||
    "Inherited / Local Weather"
  );
}

export function createEmptyLocationParentRef() {
  return {
    registryCreationId: "",
    locationEntryId: "",
    locationCreationId: "",
  };
}

export function normalizeLocationParentRef(reference = {}) {
  const source = normalizeObject(reference);

  return {
    registryCreationId: normalizeString(
      source.registryCreationId || source.registry_creation_id
    ),
    locationEntryId: normalizeString(
      source.locationEntryId || source.location_entry_id
    ),
    locationCreationId: normalizeString(
      source.locationCreationId || source.location_creation_id
    ),
  };
}

export function serializeLocationParentRef(reference = {}) {
  const normalized = normalizeLocationParentRef(reference);

  return {
    registryCreationId: normalized.registryCreationId,
    locationEntryId: normalized.locationEntryId,
    locationCreationId: normalized.locationCreationId,
  };
}

export function createLocationConnectionEndpoint(locationEntryId = "") {
  return {
    registryCreationId: "",
    locationEntryId: normalizeString(locationEntryId),
    locationCreationId: "",
  };
}

export function normalizeLocationConnectionEndpoint(
  endpoint = {},
  fallbackLocationEntryId = ""
) {
  const source = normalizeObject(endpoint);

  return {
    registryCreationId: normalizeString(
      source.registryCreationId || source.registry_creation_id
    ),
    locationEntryId:
      normalizeString(source.locationEntryId || source.location_entry_id) ||
      normalizeString(fallbackLocationEntryId),
    locationCreationId: normalizeString(
      source.locationCreationId || source.location_creation_id
    ),
  };
}

export function createEmptyLocationEntry() {
  return {
    id: createRegistryId("loc"),
    kind: "AD_HOC",
        creationId: "",
        creationType: "",
    name: "",
    aliases: [],
    category: "General",
    locationScale: "BUILDING",
    spaceType: "MIXED",

    parentLocationId: "",
    parentLocationRef: createEmptyLocationParentRef(),
    region: "",
    weatherScopeId: "",

    summary: "",
    publicDescription: "",
    hiddenNotes: "",

    mood: "",
    atmosphere: "",
    sensoryNotes: "",
    visualIdentity: "",

    placeFunction: "",
    commonOccupants: [],
    ownershipNotes: "",
    accessRules: "",
    knowledgeRules: "",
    rulesNotes: "",

    themes: [],
    sceneAffordances: [],

    promptGuidance: "",
    negativePromptNotes: "",
    
  };
}

export function createEmptyPresenceBinding(entries = []) {
  return {
    id: createRegistryId("presence"),
    locationEntryId: entries[0]?.id || "",
    person: {
      kind: "CREATION_REF",
      registryCreationId: "",
      registryEntryId: "",
      registryTitle: "",
      entryKind: "",
      creationId: "",
      creationType: "CHARACTER",
      displayName: "",
      description: "",
      imageUrl: "",
      contentRating: "",
      visibility: "",
      status: "",
      aliases: [],
      referenceStatus: "UNRESOLVED",
      legacyReference: null,
    },
    relationshipRole: "COMMON_OCCUPANT",
    frequency: "USUALLY",
    automaticPresence: true,
    opportunityTriggers: ["LOCATION_ENTRY", "SCENE_START"],
    cooldownTurns: 6,
    minimumAbsentTurns: 2,
    guidance: "",
    conditions: {
      dayparts: [],
      requiredSceneTags: [],
      excludedSceneTags: [],
      requiredFlags: [],
      excludedFlags: [],
    },
  };
}

export function createEmptyLocationConnection(entries = []) {
  return {
    id: createRegistryId("conn"),
    fromLocationId: entries[0]?.id || "",
    toLocationId: entries[1]?.id || entries[0]?.id || "",
    from: createLocationConnectionEndpoint(entries[0]?.id || ""),
    to: createLocationConnectionEndpoint(
      entries[1]?.id || entries[0]?.id || ""
    ),
    relation: "CONNECTED_TO",
    bidirectional: true,

    availableRouteTypes: ["WALK"],
    defaultRouteType: "WALK",

    // Legacy mirror retained until every existing builder/runtime reader moves
    // from routeType to defaultRouteType.
    routeType: "WALK",

    distanceMode: "UNKNOWN",

    // Informational only. Travel authority comes from distanceMode and the
    // runtime-selected effective travel tier.
    distanceMeters: "",

    // Legacy compatibility only. New travel resolution must not use this as
    // authoritative pacing or arrival data.
    travelTimeMinutes: "",

    accessRules: "",
    notes: "",
  };
}

export function createEmptyWeatherScope() {
  return {
    id: createRegistryId("weather"),
    name: "",
    scopeType: "SHARED_LOCAL_WEATHER",
    defaultWeatherBehavior: "",
    notes: "",
  };
}

export function createEmptyLocationRegistryChildRef() {
  return {
    creationId: "",
    scopeLocationEntryId: "",
    scopeLocationCreationId: "",
    loadPolicy: "LOCATION_SCOPED",
  };
}

export function normalizeLocationRegistryChildRef(reference = {}) {
  const base = createEmptyLocationRegistryChildRef();
  const source = normalizeObject(reference);
  const loadPolicy = normalizeString(
    source.loadPolicy || source.load_policy
  ).toUpperCase();

  return {
    creationId: normalizeString(
      source.creationId || source.creation_id
    ),
    scopeLocationEntryId: normalizeString(
      source.scopeLocationEntryId || source.scope_location_entry_id
    ),
    scopeLocationCreationId: normalizeString(
      source.scopeLocationCreationId || source.scope_location_creation_id
    ),
    loadPolicy: LOCATION_REGISTRY_CHILD_LOAD_POLICY_OPTIONS.includes(loadPolicy)
      ? loadPolicy
      : base.loadPolicy,
  };
}

export function serializeLocationRegistryChildRef(reference = {}) {
  const normalized = normalizeLocationRegistryChildRef(reference);

  return {
    creationId: normalized.creationId,
    scopeLocationEntryId: normalized.scopeLocationEntryId,
    scopeLocationCreationId: normalized.scopeLocationCreationId,
    loadPolicy: normalized.loadPolicy,
  };
}

export function createStarterLocationRegistry() {
  return {
    title: "",
    scope: "",
    description: "",
    parentRegistryId: "",
    scopeLocationEntryId: "",
    scopeLocationCreationId: "",
    childRegistryRefs: [],
    entries: [],
    connections: [],
    presenceBindings: [],
    weatherScopes: [],
    promptGuidance: {
      summary: "",
      usageNotes: "",
      negativePromptNotes: "",
    },
    runtimeGuidance: {
      movementResolverNotes: "",
      adHocLocationPolicy:
        "Ad-hoc/basic locations may be created in hydrated chat-instance state when no registry location matches. Do not write them back into this registry unless explicitly promoted by the creator.",
    },
    middlewareHints: {
      intendedUse: [
        "location_continuity",
        "scene_anchoring",
        "weather_scoping",
        "travel_resolution",
        "memory_evidence_organization",
      ],
      strictness: "guided",
      allowRuntimeMutation: true,
    },
  };
}

export function normalizeLocationEntry(entry = {}) {
  const base = createEmptyLocationEntry();
  const source = normalizeObject(entry);

  return {
    ...base,
    ...source,
    id: normalizeString(source.id) || createRegistryId("loc"),
    kind:
        normalizeString(source.kind).toUpperCase() === "CREATION_REF"
            ? "CREATION_REF"
            : "AD_HOC",
    creationId: normalizeString(source.creationId || source.creation_id),
    creationType:
        normalizeString(source.creationType || source.creation_type).toUpperCase() ||
        (normalizeString(source.creationId || source.creation_id) ? "LOCATION" : ""),
    name: normalizeString(source.name || source.title || source.label),
    aliases: normalizeArray(source.aliases),
    category: normalizeString(source.category || source.type) || base.category,
    locationScale:
      normalizeString(source.locationScale || source.location_scale).toUpperCase() ||
      base.locationScale,
    spaceType:
      normalizeString(source.spaceType || source.space_type).toUpperCase() ||
      base.spaceType,
    parentLocationId: normalizeString(
      source.parentLocationId ||
        source.parent_location_id ||
        source.parentId ||
        source.parent_id ||
        (typeof source.parent === "string" ? source.parent : "")
    ),
    parentLocationRef: normalizeLocationParentRef(
      source.parentLocationRef || source.parent_location_ref
    ),
    region: normalizeString(source.region),
    weatherScopeId: normalizeString(
      source.weatherScopeId || source.weather_scope_id
    ),
    summary: normalizeString(source.summary || source.description),
    publicDescription: normalizeString(
      source.publicDescription || source.public_description
    ),
    hiddenNotes: normalizeString(source.hiddenNotes || source.hidden_notes),
    mood: normalizeString(source.mood),
    atmosphere: normalizeString(source.atmosphere),
    sensoryNotes: normalizeString(source.sensoryNotes || source.sensory_notes),
    visualIdentity: normalizeString(
      source.visualIdentity || source.visual_identity
    ),
    placeFunction: normalizeString(
      source.placeFunction || source.place_function || source.function
    ),
    commonOccupants: normalizeArray(
      source.commonOccupants || source.common_occupants
    ),
    ownershipNotes: normalizeString(
      source.ownershipNotes || source.ownership_notes
    ),
    accessRules: normalizeString(source.accessRules || source.access_rules),
    knowledgeRules: normalizeString(
      source.knowledgeRules || source.knowledge_rules
    ),
    rulesNotes: normalizeString(source.rulesNotes || source.rules_notes),
    themes: normalizeArray(source.themes),
    sceneAffordances: normalizeArray(
      source.sceneAffordances || source.scene_affordances
    ),
    promptGuidance: normalizeString(
      source.promptGuidance || source.prompt_guidance
    ),
    negativePromptNotes: normalizeString(
      source.negativePromptNotes || source.negative_prompt_notes
    ),
  };
}

export function normalizePresenceBinding(binding = {}) {
  const source = normalizeObject(binding);
  const base = createEmptyPresenceBinding();
  const personSource = normalizeObject(
    source.person || source.npc || source.character
  );
  const conditionsSource = normalizeObject(source.conditions);
  const legacySource = normalizeObject(
    personSource.legacyReference || personSource.legacy_reference
  );

  const cooldownTurns = Number.parseInt(
    source.cooldownTurns ?? source.cooldown_turns ?? base.cooldownTurns,
    10
  );
  const minimumAbsentTurns = Number.parseInt(
    source.minimumAbsentTurns ??
      source.minimum_absent_turns ??
      base.minimumAbsentTurns,
    10
  );

  const creationId = normalizeString(
    personSource.creationId ||
      personSource.creation_id ||
      source.creationId ||
      source.creation_id
  );
  const requestedCreationType = normalizeString(
    personSource.creationType ||
      personSource.creation_type ||
      source.creationType ||
      source.creation_type
  ).toUpperCase();
  const registryCreationId = normalizeString(
    legacySource.registryCreationId ||
      legacySource.registry_creation_id ||
      personSource.registryCreationId ||
      personSource.registry_creation_id ||
      source.registryCreationId ||
      source.registry_creation_id
  );
  const registryEntryId = normalizeString(
    legacySource.registryEntryId ||
      legacySource.registry_entry_id ||
      personSource.registryEntryId ||
      personSource.registry_entry_id ||
      source.registryEntryId ||
      source.registry_entry_id
  );
  const entryKind = normalizeString(
    legacySource.entryKind ||
      legacySource.entry_kind ||
      personSource.entryKind ||
      personSource.entry_kind
  ).toUpperCase();
  const suppliedKind = normalizeString(personSource.kind).toUpperCase();
  const hasRegistryReference = Boolean(registryCreationId || registryEntryId);
  const isLegacyReference =
    suppliedKind === "LEGACY_NPC_REGISTRY_ENTRY" ||
    Boolean(
      legacySource.registryCreationId ||
        legacySource.registry_creation_id ||
        legacySource.registryEntryId ||
        legacySource.registry_entry_id
    );
  const suppliedReferenceStatus = normalizeString(
    personSource.referenceStatus || personSource.reference_status
  ).toUpperCase();

  return {
    ...base,
    ...source,
    id: normalizeString(source.id) || createRegistryId("presence"),
    locationEntryId: normalizeString(
      source.locationEntryId || source.location_entry_id || source.locationId
    ),
    person: {
      ...base.person,
      kind: hasRegistryReference
        ? isLegacyReference && suppliedReferenceStatus !== "RESOLVED"
          ? "LEGACY_NPC_REGISTRY_ENTRY"
          : "NPC_REGISTRY_ENTRY"
        : "CREATION_REF",
      registryCreationId,
      registryEntryId,
      registryTitle: normalizeString(
        personSource.registryTitle || personSource.registry_title
      ),
      entryKind,
      creationId,
      creationType: hasRegistryReference
        ? requestedCreationType
        : creationId
          ? "CHARACTER"
          : requestedCreationType === "CHARACTER"
            ? "CHARACTER"
            : "",
      displayName: normalizeString(
        personSource.displayName ||
          personSource.display_name ||
          personSource.name ||
          source.personName
      ),
      description: normalizeString(
        personSource.description || personSource.summary
      ),
      imageUrl: normalizeString(
        personSource.imageUrl ||
          personSource.image_url ||
          personSource.avatarUrl ||
          personSource.avatar_url
      ),
      contentRating: normalizeString(
        personSource.contentRating || personSource.content_rating
      ).toUpperCase(),
      visibility: normalizeString(personSource.visibility).toUpperCase(),
      status: normalizeString(personSource.status).toUpperCase(),
      aliases: normalizeArray(personSource.aliases),
      referenceStatus: hasRegistryReference
        ? suppliedReferenceStatus ||
          (isLegacyReference ? "LEGACY_UNRESOLVED" : "UNRESOLVED")
        : creationId
          ? suppliedReferenceStatus || "UNRESOLVED"
          : suppliedReferenceStatus || "UNRESOLVED",
      legacyReference: isLegacyReference
        ? {
            registryCreationId,
            registryEntryId,
            entryKind,
          }
        : null,
    },
    relationshipRole: (() => {
      const value = normalizeString(
        source.relationshipRole || source.relationship_role || source.role
      ).toUpperCase();

      return PRESENCE_RELATIONSHIP_ROLE_OPTIONS.includes(value)
        ? value
        : base.relationshipRole;
    })(),
    frequency: (() => {
      const value = normalizeString(source.frequency).toUpperCase();

      return PRESENCE_FREQUENCY_OPTIONS.includes(value)
        ? value
        : base.frequency;
    })(),
    automaticPresence: normalizeBoolean(
      source.automaticPresence ?? source.automatic_presence,
      true
    ),
    opportunityTriggers: (() => {
      const raw = source.opportunityTriggers || source.opportunity_triggers;
      const values = raw === undefined ? base.opportunityTriggers : raw;

      return normalizeArray(values)
        .map((value) => normalizeString(value).toUpperCase())
        .filter((value) =>
          PRESENCE_OPPORTUNITY_TRIGGER_OPTIONS.includes(value)
        );
    })(),
    cooldownTurns: Number.isFinite(cooldownTurns)
      ? Math.max(0, cooldownTurns)
      : base.cooldownTurns,
    minimumAbsentTurns: Number.isFinite(minimumAbsentTurns)
      ? Math.max(0, minimumAbsentTurns)
      : base.minimumAbsentTurns,
    guidance: normalizeString(source.guidance || source.notes),
    conditions: {
      ...base.conditions,
      ...conditionsSource,
      dayparts: normalizeArray(conditionsSource.dayparts),
      requiredSceneTags: normalizeArray(
        conditionsSource.requiredSceneTags ||
          conditionsSource.required_scene_tags
      ),
      excludedSceneTags: normalizeArray(
        conditionsSource.excludedSceneTags ||
          conditionsSource.excluded_scene_tags
      ),
      requiredFlags: normalizeArray(
        conditionsSource.requiredFlags || conditionsSource.required_flags
      ),
      excludedFlags: normalizeArray(
        conditionsSource.excludedFlags || conditionsSource.excluded_flags
      ),
    },
  };
}

export function normalizeLocationConnection(connection = {}) {
  const base = createEmptyLocationConnection();
  const source = normalizeObject(connection);

  const relation =
    normalizeString(source.relation || source.type).toUpperCase() ||
    base.relation;

  const defaultRouteType = normalizeRouteType(
    source.defaultRouteType ||
      source.default_route_type ||
      source.routeType ||
      source.route_type,
    base.defaultRouteType
  );

  const availableRouteTypes = normalizeRouteTypes(
    source.availableRouteTypes || source.available_route_types,
    defaultRouteType
  );

  const distanceMode = normalizeDistanceMode(
    source.distanceMode || source.distance_mode,
    DEFAULT_DISTANCE_MODE_BY_RELATION[relation] || base.distanceMode
  );

  const legacyFromLocationId = normalizeString(
    source.fromLocationId ||
      source.from_location_id ||
      (typeof source.from === "string" ? source.from : "") ||
      source.sourceLocationId
  );
  const legacyToLocationId = normalizeString(
    source.toLocationId ||
      source.to_location_id ||
      (typeof source.to === "string" ? source.to : "") ||
      source.targetLocationId
  );
  const from = normalizeLocationConnectionEndpoint(
    source.from,
    legacyFromLocationId
  );
  const to = normalizeLocationConnectionEndpoint(
    source.to,
    legacyToLocationId
  );

  return {
    ...base,
    ...source,
    id: normalizeString(source.id) || createRegistryId("conn"),
    fromLocationId: legacyFromLocationId || from.locationEntryId,
    toLocationId: legacyToLocationId || to.locationEntryId,
    from,
    to,
    relation,
    bidirectional: normalizeBoolean(source.bidirectional, true),

    availableRouteTypes,
    defaultRouteType,

    // Legacy mirror for existing readers.
    routeType: defaultRouteType,

    distanceMode,
    distanceMeters: normalizeString(
      source.distanceMeters || source.distance_meters
    ),

    // Legacy informational field only.
    travelTimeMinutes: normalizeString(
      source.travelTimeMinutes || source.travel_time_minutes
    ),

    accessRules: normalizeString(source.accessRules || source.access_rules),
    notes: normalizeString(source.notes),
  };
}


export function normalizeWeatherScope(scope = {}) {
  const base = createEmptyWeatherScope();
  const source = normalizeObject(scope);

  return {
    ...base,
    ...source,
    id: normalizeString(source.id) || createRegistryId("weather"),
    name: normalizeString(source.name),
    scopeType:
      normalizeString(source.scopeType || source.scope_type).toUpperCase() ||
      base.scopeType,
    defaultWeatherBehavior: normalizeString(
      source.defaultWeatherBehavior || source.default_weather_behavior
    ),
    notes: normalizeString(source.notes),
  };
}

export function normalizeLocationRegistry(registry = {}) {
  const base = createStarterLocationRegistry();
  const source = normalizeObject(registry);

  return {
    ...base,
    ...source,
    title: normalizeString(source.title) || base.title,
    scope: normalizeString(source.scope),
    description: normalizeString(source.description),
    parentRegistryId: normalizeString(
      source.parentRegistryId || source.parent_registry_id
    ),
    scopeLocationEntryId: normalizeString(
      source.scopeLocationEntryId || source.scope_location_entry_id
    ),
    scopeLocationCreationId: normalizeString(
      source.scopeLocationCreationId || source.scope_location_creation_id
    ),
    childRegistryRefs: normalizeArray(
      source.childRegistryRefs || source.child_registry_refs
    ).map(normalizeLocationRegistryChildRef),
    entries: normalizeArray(source.entries).map(normalizeLocationEntry),
    connections: normalizeArray(source.connections).map(
      normalizeLocationConnection
    ),
    presenceBindings: normalizeArray(
      source.presenceBindings || source.presence_bindings
    ).map(normalizePresenceBinding),
    weatherScopes: normalizeArray(
      source.weatherScopes || source.weather_scopes
    ).map(normalizeWeatherScope),
    promptGuidance: {
      ...base.promptGuidance,
      ...(source.promptGuidance || source.prompt_guidance || {}),
    },
    runtimeGuidance: {
      ...base.runtimeGuidance,
      ...(source.runtimeGuidance || source.runtime_guidance || {}),
    },
    middlewareHints: {
      ...base.middlewareHints,
      ...(source.middlewareHints || source.middleware_hints || {}),
    },
  };
}


export function serializeLocationRegistryEntry(entry = {}) {
  const normalized = normalizeLocationEntry(entry);

  if (normalized.kind === "CREATION_REF") {
    return {
      id: normalized.id,
      kind: "CREATION_REF",
      creationId: normalized.creationId,
      creationType: normalized.creationType || "LOCATION",
      parentLocationId: normalized.parentLocationId,
      ...(normalized.parentLocationRef.registryCreationId ||
      normalized.parentLocationRef.locationEntryId
        ? {
            parentLocationRef: serializeLocationParentRef(
              normalized.parentLocationRef
            ),
          }
        : {}),
      weatherScopeId: normalized.weatherScopeId,
      region: normalized.region,
      commonOccupants: normalized.commonOccupants,
      ownershipNotes: normalized.ownershipNotes,
      accessRules: normalized.accessRules,
      knowledgeRules: normalized.knowledgeRules,
      rulesNotes: normalized.rulesNotes,
      promptGuidance: normalized.promptGuidance,
      negativePromptNotes: normalized.negativePromptNotes,
    };
  }

  return {
    ...normalized,
    parentLocationRef: serializeLocationParentRef(
      normalized.parentLocationRef
    ),
  };
}

export function serializeLocationConnection(connection = {}) {
  const normalized = normalizeLocationConnection(connection);
  const from = normalizeLocationConnectionEndpoint(normalized.from);
  const to = normalizeLocationConnectionEndpoint(normalized.to);
  const crossRegistry = Boolean(
    from.registryCreationId || to.registryCreationId
  );
  const shared = {
    id: normalized.id,
    relation: normalized.relation,
    bidirectional: normalized.bidirectional,
    availableRouteTypes: normalized.availableRouteTypes,
    defaultRouteType: normalized.defaultRouteType,
    routeType: normalized.routeType,
    distanceMode: normalized.distanceMode,
    distanceMeters: normalized.distanceMeters,
    travelTimeMinutes: normalized.travelTimeMinutes,
    accessRules: normalized.accessRules,
    notes: normalized.notes,
  };

  if (!crossRegistry) {
    return {
      ...shared,
      fromLocationId: from.locationEntryId || normalized.fromLocationId,
      toLocationId: to.locationEntryId || normalized.toLocationId,
    };
  }

  return {
    ...shared,
    from,
    to,
  };
}

export function serializeLocationPresenceBinding(binding = {}) {
  const normalized = normalizePresenceBinding(binding);
  const person = normalizeObject(normalized.person);
  const legacyReference = normalizeObject(person.legacyReference);
  const registryCreationId =
    normalizeString(person.registryCreationId) ||
    normalizeString(legacyReference.registryCreationId);
  const registryEntryId =
    normalizeString(person.registryEntryId) ||
    normalizeString(legacyReference.registryEntryId);
  const hasRegistryReference = Boolean(
    registryCreationId || registryEntryId
  );
  const keepLegacyUnresolved =
    person.kind === "LEGACY_NPC_REGISTRY_ENTRY" &&
    person.referenceStatus !== "RESOLVED";

  return {
    id: normalized.id,
    locationEntryId: normalized.locationEntryId,
    person: hasRegistryReference
      ? {
          kind: keepLegacyUnresolved
            ? "LEGACY_NPC_REGISTRY_ENTRY"
            : "NPC_REGISTRY_ENTRY",
          registryCreationId,
          registryEntryId,
          ...(keepLegacyUnresolved
            ? {
                entryKind: normalizeString(
                  person.entryKind || legacyReference.entryKind
                ),
              }
            : {}),
        }
      : person.creationId
        ? {
            kind: "CREATION_REF",
            creationId: person.creationId,
            creationType: "CHARACTER",
          }
        : {
            kind: "CREATION_REF",
            creationId: "",
            creationType: "CHARACTER",
          },
    relationshipRole: normalized.relationshipRole,
    frequency: normalized.frequency,
    automaticPresence: normalized.automaticPresence,
    opportunityTriggers: normalized.opportunityTriggers,
    cooldownTurns: normalized.cooldownTurns,
    minimumAbsentTurns: normalized.minimumAbsentTurns,
    guidance: normalized.guidance,
    conditions: normalized.conditions,
  };
}

export function hydrateLocationRegistryReferenceEntries(registry = {}, options = []) {
  const optionById = new Map(
    normalizeArray(options)
      .filter((option) => option?.id)
      .map((option) => [option.id, option])
  );

  return {
    ...registry,
    entries: normalizeArray(registry.entries).map((entry) => {
      const normalized = normalizeLocationEntry(entry);
      if (normalized.kind !== "CREATION_REF" || !normalized.creationId) {
        return normalized;
      }

      const option = optionById.get(normalized.creationId);
      if (!option) return normalized;

      return {
        ...normalized,
        name: option.title || normalized.name,
        summary: option.description || option.subtitle || normalized.summary,
        publicDescription: option.description || normalized.publicDescription,
        creationType: option.type || normalized.creationType || "LOCATION",
      };
    }),
  };
}

export function hydrateLocationRegistryPresenceBindings(
  registry = {},
  characterOptions = [],
  npcEntryOptions = []
) {
  const characterById = new Map(
    normalizeArray(characterOptions)
      .filter((option) => option?.id)
      .map((option) => [String(option.id), option])
  );
  const npcEntryById = new Map(
    normalizeArray(npcEntryOptions)
      .filter((option) => option?.id)
      .map((option) => [String(option.id), option])
  );

  return {
    ...registry,
    presenceBindings: normalizeArray(
      registry.presenceBindings || registry.presence_bindings
    ).map((binding) => {
      const normalized = normalizePresenceBinding(binding);
      const person = normalizeObject(normalized.person);
      const legacyReference = normalizeObject(person.legacyReference);
      const registryCreationId =
        normalizeString(person.registryCreationId) ||
        normalizeString(legacyReference.registryCreationId);
      const registryEntryId =
        normalizeString(person.registryEntryId) ||
        normalizeString(legacyReference.registryEntryId);

      if (registryCreationId || registryEntryId) {
        const option = npcEntryById.get(
          `${registryCreationId}:${registryEntryId}`
        );

        if (!option) {
          return {
            ...normalized,
            person: {
              ...person,
              kind:
                person.kind === "LEGACY_NPC_REGISTRY_ENTRY"
                  ? "LEGACY_NPC_REGISTRY_ENTRY"
                  : "NPC_REGISTRY_ENTRY",
              registryCreationId,
              registryEntryId,
              displayName:
                person.displayName ||
                (person.kind === "LEGACY_NPC_REGISTRY_ENTRY"
                  ? "Legacy NPC Registry reference unavailable"
                  : "NPC Registry entry unavailable"),
              referenceStatus:
                person.kind === "LEGACY_NPC_REGISTRY_ENTRY"
                  ? "LEGACY_UNRESOLVED"
                  : "UNAVAILABLE",
            },
          };
        }

        return {
          ...normalized,
          person: {
            ...person,
            kind: "NPC_REGISTRY_ENTRY",
            registryCreationId: option.registryCreationId,
            registryEntryId: option.registryEntryId,
            registryTitle: option.registryTitle || "NPC Registry",
            entryKind: option.entryKind || "AD_HOC",
            creationId: option.creationId || "",
            creationType: option.creationType || "",
            displayName:
              option.displayName || option.title || "Linked NPC Registry entry",
            description: option.description || "",
            imageUrl: option.imageUrl || "",
            contentRating: option.contentRating || "SFW",
            aliases: normalizeArray(option.aliases),
            referenceStatus: "RESOLVED",
            legacyReference: null,
          },
        };
      }

      const creationId = normalizeString(person.creationId);

      if (!creationId) {
        return {
          ...normalized,
          person: {
            ...person,
            displayName: person.displayName || "Character selection required",
            description: "",
            imageUrl: "",
            referenceStatus: "UNRESOLVED",
          },
        };
      }

      const option = characterById.get(creationId);

      if (!option) {
        return {
          ...normalized,
          person: {
            ...person,
            displayName: "Linked Character unavailable",
            description: "",
            imageUrl: "",
            referenceStatus: "UNAVAILABLE",
          },
        };
      }

      return {
        ...normalized,
        person: {
          ...person,
          kind: "CREATION_REF",
          registryCreationId: "",
          registryEntryId: "",
          registryTitle: "",
          entryKind: "",
          creationId,
          creationType: "CHARACTER",
          displayName: option.title || "Linked Character",
          description: option.description || option.subtitle || "",
          imageUrl: option.imageUrl || "",
          contentRating: option.contentRating || "SFW",
          visibility: option.visibility || "PRIVATE",
          status: option.status || "DRAFT",
          aliases: [],
          referenceStatus: "RESOLVED",
          legacyReference: null,
        },
      };
    }),
  };
}

export function buildLocationRegistryData(registry = {}) {
  const normalized = normalizeLocationRegistry(registry);

  return {
    registry_kind: LOCATION_REGISTRY_KIND,
    registry_version: LOCATION_REGISTRY_VERSION,
    scope: normalized.scope,
    parent_registry_id: normalized.parentRegistryId,
    scope_location_entry_id: normalized.scopeLocationEntryId,
    scope_location_creation_id: normalized.scopeLocationCreationId,
    child_registry_refs: normalized.childRegistryRefs.map(
      serializeLocationRegistryChildRef
    ),
    entries: normalized.entries.map(serializeLocationRegistryEntry),
    connections: normalized.connections.map(serializeLocationConnection),
    presence_bindings: normalized.presenceBindings.map(serializeLocationPresenceBinding),
    weather_scopes: normalized.weatherScopes,
    prompt_guidance: {
      summary: normalizeString(normalized.promptGuidance.summary),
      usageNotes: normalizeString(normalized.promptGuidance.usageNotes),
      negativePromptNotes: normalizeString(
        normalized.promptGuidance.negativePromptNotes
      ),
    },
    runtime_guidance: {
      movementResolverNotes: normalizeString(
        normalized.runtimeGuidance.movementResolverNotes
      ),
      adHocLocationPolicy: normalizeString(
        normalized.runtimeGuidance.adHocLocationPolicy
      ),
    },
    middleware_hints: {
      intendedUse: normalizeArray(normalized.middlewareHints.intendedUse),
      strictness: normalizeString(normalized.middlewareHints.strictness) || "guided",
      allowRuntimeMutation:
        normalized.middlewareHints.allowRuntimeMutation !== false,
    },
    builder: "LOCATION_REGISTRY_BUILDER",
    builder_version: LOCATION_REGISTRY_VERSION,
  };
}

export function buildLocationRegistryCreationPayload(registry = {}) {
  const normalized = normalizeLocationRegistry(registry);

  return {
    type: LOCATION_REGISTRY_KIND,
    title: normalized.title || "Untitled Location Registry",
    description: normalized.description,
    visibility: "PRIVATE",
    status: "DRAFT",
    contentRating: "SFW",
    canonStatus: "NONE",
    data: buildLocationRegistryData(normalized),
  };
}
export function normalizeLocationRegistryRegistryOptions(
  creations = [],
  { excludeCreationId = "" } = {}
) {
  const excludedId = normalizeString(excludeCreationId);

  return normalizeArray(creations)
    .filter((creation) => creation?.id)
    .filter(
      (creation) =>
        String(creation.type || "").toUpperCase() === LOCATION_REGISTRY_KIND
    )
    .filter((creation) => normalizeString(creation.id) !== excludedId)
    .map((creation) => ({
      id: normalizeString(creation.id),
      type: LOCATION_REGISTRY_KIND,
      title: normalizeString(creation.title) || "Untitled Location Registry",
      description: normalizeString(creation.description),
      parentRegistryId: normalizeString(
        creation.data?.parent_registry_id || creation.data?.parentRegistryId
      ),
      scopeLocationEntryId: normalizeString(
        creation.data?.scope_location_entry_id ||
          creation.data?.scopeLocationEntryId
      ),
      scopeLocationCreationId: normalizeString(
        creation.data?.scope_location_creation_id ||
          creation.data?.scopeLocationCreationId
      ),
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function buildLocationRegistryScopeLocationOptions(
  registry = {},
  locationOptions = []
) {
  const hydrated = hydrateLocationRegistryReferenceEntries(
    normalizeLocationRegistry(registry),
    locationOptions
  );

  return hydrated.entries.map((entry) => ({
    id: entry.id,
    value: entry.id,
    label: entry.name || entry.id || "Unnamed Location",
    creationId:
      entry.kind === "CREATION_REF" ? normalizeString(entry.creationId) : "",
    creationType:
      entry.kind === "CREATION_REF"
        ? normalizeString(entry.creationType) || "LOCATION"
        : "",
    kind: entry.kind,
  }));
}

export function normalizeLocationRegistryLocationOptions(creations = []) {
  return creations
    .filter((creation) => creation?.id)
    .filter((creation) => String(creation.type || "").toUpperCase() === "LOCATION")
    .map((creation) => {
      const featuredMedia = buildFeaturedMedia({
        row: creation,
        data: creation.data,
        title: creation.title,
        max: 1,
      });

      const fallbackImage = getDefaultCreationImageForType(creation.type);

      return {
        id: creation.id,
        type: creation.type || "LOCATION",
        title:
          creation.title ||
          creation.data?.name ||
          creation.name ||
          "Untitled Location",
        subtitle:
          creation.description ||
          creation.data?.short_concept ||
          creation.data?.location_role ||
          creation.data?.space_type ||
          "",
        description:
          creation.description ||
          creation.data?.summary ||
          creation.data?.usage_notes ||
          creation.data?.sensory_notes ||
          "",
        imageUrl: getFirstCreationImageUrl(featuredMedia, fallbackImage),
        contentRating: creation.contentRating || creation.content_rating || "SFW",
        visibility: creation.visibility || "PRIVATE",
        status: creation.status || "DRAFT",
      };
    });
}

export function normalizeLocationRegistryCharacterOptions(creations = []) {
  const source = Array.isArray(creations)
    ? creations
    : normalizeArray(
        creations?.creations || creations?.data?.creations || creations?.items
      );

  return source
    .filter((creation) => creation?.id)
    .filter(
      (creation) => String(creation.type || "").toUpperCase() === "CHARACTER"
    )
    .map((creation) => {
      const featuredMedia = buildFeaturedMedia({
        row: creation,
        data: creation.data,
        title: creation.title,
        max: 1,
      });
      const fallbackImage = getDefaultCreationImageForType("CHARACTER");

      return {
        id: creation.id,
        type: "CHARACTER",
        title:
          creation.title ||
          creation.data?.name ||
          creation.name ||
          "Untitled Character",
        subtitle:
          creation.data?.short_concept ||
          creation.data?.class ||
          creation.data?.role_archetype ||
          "Character",
        description:
          creation.description ||
          creation.data?.summary ||
          creation.data?.personality_summary ||
          "",
        imageUrl: getFirstCreationImageUrl(featuredMedia, fallbackImage),
        contentRating:
          creation.contentRating || creation.content_rating || "SFW",
        visibility: creation.visibility || "PRIVATE",
        status: creation.status || "DRAFT",
        creationId: creation.id,
        creationType: "CHARACTER",
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function normalizeLocationRegistryNpcEntryOptions(creations = []) {
  const source = Array.isArray(creations)
    ? creations
    : normalizeArray(
        creations?.creations || creations?.data?.creations || creations?.items
      );

  return source
    .filter((creation) => creation?.id)
    .filter(
      (creation) =>
        String(creation.type || "").toUpperCase() === "NPC_REGISTRY"
    )
    .flatMap((registryCreation) => {
      const data = normalizeObject(registryCreation.data);
      const entries = normalizeArray(data.entries);
      const aliases = normalizeArray(data.aliases || data.alias_rules);
      const registryTitle =
        normalizeString(registryCreation.title) || "NPC Registry";

      return entries
        .filter((entry) => entry?.id)
        .filter((entry) => {
          const creationType = normalizeString(
            entry.creationType || entry.creation_type
          ).toUpperCase();

          return creationType !== "PLAYER_CHARACTER";
        })
        .map((entry) => {
          const entryId = normalizeString(entry.id);
          const linkedAliases = aliases
            .filter(
              (alias) =>
                normalizeString(alias.trueEntryId || alias.true_entry_id) ===
                entryId
            )
            .map((alias) =>
              normalizeString(alias.publicIdentity || alias.public_identity)
            )
            .filter(Boolean);
          const name =
            normalizeString(entry.name || entry.title || entry.label) ||
            "Untitled NPC";
          const entryKind =
            normalizeString(entry.kind).toUpperCase() === "CREATION_REF"
              ? "CREATION_REF"
              : "AD_HOC";
          const creationId = normalizeString(
            entry.creationId || entry.creation_id
          );
          const creationType = normalizeString(
            entry.creationType || entry.creation_type
          ).toUpperCase();

          return {
            id: `${registryCreation.id}:${entryId}`,
            type:
              entryKind === "CREATION_REF"
                ? creationType || "CHARACTER"
                : "LIGHTWEIGHT_NPC",
            title: name,
            subtitle: `${registryTitle} · ${
              entryKind === "CREATION_REF"
                ? "Linked Character"
                : "Lightweight NPC"
            }`,
            description: normalizeString(entry.notes || entry.description),
            imageUrl: normalizeString(
              entry.imageUrl ||
                entry.image_url ||
                entry.avatarUrl ||
                entry.avatar_url
            ),
            contentRating:
              registryCreation.contentRating ||
              registryCreation.content_rating ||
              "SFW",
            registryCreationId: registryCreation.id,
            registryEntryId: entryId,
            registryTitle,
            entryKind,
            creationId,
            creationType,
            displayName: name,
            aliases: linkedAliases,
          };
        });
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function getPresenceBindingPersonName(binding = {}) {
  const person = normalizeObject(binding?.person);

  return (
    normalizeString(person.displayName) ||
    (person.referenceStatus === "LEGACY_UNRESOLVED"
      ? "Legacy NPC Registry reference unavailable"
      : person.referenceStatus === "UNAVAILABLE"
        ? person.kind === "NPC_REGISTRY_ENTRY"
          ? "NPC Registry entry unavailable"
          : "Linked Character unavailable"
        : "Unknown Person")
  );
}
