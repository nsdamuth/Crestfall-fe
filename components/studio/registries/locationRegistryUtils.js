import {
  buildFeaturedMedia,
  getDefaultCreationImageForType,
  getFirstCreationImageUrl,
} from "@/lib/shared/creations/creationMedia";

export const LOCATION_REGISTRY_KIND = "LOCATION_REGISTRY";
export const LOCATION_REGISTRY_VERSION = "1.1";

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
      kind: "NPC_REGISTRY_ENTRY",
      registryCreationId: "",
      registryEntryId: "",
      creationId: "",
      creationType: "",
      entryKind: "",
      displayName: "",
      registryTitle: "",
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

export function createStarterLocationRegistry() {
  return {
    title: "",
    scope: "",
    description: "",
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
        source.parent
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
  const personSource = normalizeObject(source.person || source.npc || source.character);
  const conditionsSource = normalizeObject(source.conditions);

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

  return {
    ...base,
    ...source,
    id: normalizeString(source.id) || createRegistryId("presence"),
    locationEntryId: normalizeString(
      source.locationEntryId || source.location_entry_id || source.locationId
    ),
    person: {
      ...base.person,
      ...personSource,
      kind: "NPC_REGISTRY_ENTRY",
      registryCreationId: normalizeString(
        personSource.registryCreationId ||
          personSource.registry_creation_id ||
          source.registryCreationId ||
          source.registry_creation_id
      ),
      registryEntryId: normalizeString(
        personSource.registryEntryId ||
          personSource.registry_entry_id ||
          source.registryEntryId ||
          source.registry_entry_id
      ),
      creationId: normalizeString(
        personSource.creationId || personSource.creation_id
      ),
      creationType: normalizeString(
        personSource.creationType || personSource.creation_type
      ).toUpperCase(),
      entryKind: normalizeString(
        personSource.entryKind || personSource.entry_kind
      ).toUpperCase(),
      displayName: normalizeString(
        personSource.displayName ||
          personSource.display_name ||
          personSource.name ||
          source.personName
      ),
      registryTitle: normalizeString(
        personSource.registryTitle || personSource.registry_title
      ),
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

  return {
    ...base,
    ...source,
    id: normalizeString(source.id) || createRegistryId("conn"),
    fromLocationId: normalizeString(
      source.fromLocationId ||
        source.from_location_id ||
        source.from ||
        source.sourceLocationId
    ),
    toLocationId: normalizeString(
      source.toLocationId ||
        source.to_location_id ||
        source.to ||
        source.targetLocationId
    ),
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

export function buildLocationRegistryData(registry = {}) {
  const normalized = normalizeLocationRegistry(registry);

  return {
    registry_kind: LOCATION_REGISTRY_KIND,
    registry_version: LOCATION_REGISTRY_VERSION,
    scope: normalized.scope,
    entries: normalized.entries,
    connections: normalized.connections,
    presence_bindings: normalized.presenceBindings,
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
    builder_version: "1.1",
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

export function normalizeLocationRegistryNpcEntryOptions(creations = []) {
  const source = Array.isArray(creations)
    ? creations
    : normalizeArray(
        creations?.creations || creations?.data?.creations || creations?.items
      );

  return source
    .filter((creation) => creation?.id)
    .filter(
      (creation) => String(creation.type || "").toUpperCase() === "NPC_REGISTRY"
    )
    .flatMap((registryCreation) => {
      const data = normalizeObject(registryCreation.data);
      const entries = normalizeArray(data.entries);
      const aliases = normalizeArray(data.aliases || data.alias_rules);

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
          const registryTitle =
            normalizeString(registryCreation.title) || "NPC Registry";

          return {
            id: `${registryCreation.id}:${entryId}`,
            type:
              entryKind === "CREATION_REF"
                ? creationType || "CHARACTER"
                : "CUSTOM NPC",
            title: name,
            subtitle: `${registryTitle} · ${
              entryKind === "CREATION_REF" ? "Linked Character" : "Custom NPC"
            }`,
            description: normalizeString(entry.notes || entry.description),
            imageUrl: normalizeString(
              entry.imageUrl || entry.image_url || entry.avatarUrl || entry.avatar_url
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
  return (
    normalizeString(binding?.person?.displayName) ||
    "Unknown NPC Registry Entry"
  );
}
