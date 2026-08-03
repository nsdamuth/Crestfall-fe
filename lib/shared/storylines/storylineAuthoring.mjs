export const STORY_AUTHORING_CONTRACT_VERSION = "story_authoring_v1";
export const STORYLINE_AUTHORING_CONTRACT_VERSION = "storyline_authoring_v1";
export const STORYLINE_NODE_CONTRACT_VERSION = "storyline_node_v1";
export const STORYLINE_TRIGGER_CONTRACT_VERSION = "storyline_trigger_v1";
export const STORYLINE_OPEN_WORLD_POLICY_VERSION =
  "storyline_open_world_policy_v1";

export const STORY_CIRCLE_PHASE_IDS = [
  "you",
  "need",
  "go",
  "search",
  "find",
  "take",
  "return",
  "change",
];

export const STORYLINE_REFERENCE_TYPES = ["STORY", "SCENARIO"];
export const STORYLINE_TRANSITION_POLICIES = [
  "OPEN_WORLD_UNTIL_TRIGGER",
  "IMMEDIATE",
  "MANUAL",
  "OPTIONAL",
  "COMPLETE_STORYLINE",
];
export const STORYLINE_NON_TERMINAL_TRANSITION_POLICIES = [
  "OPEN_WORLD_UNTIL_TRIGGER",
  "IMMEDIATE",
  "MANUAL",
  "OPTIONAL",
];
export const STORYLINE_TRIGGER_MODES = ["ANY", "ALL"];
export const STORYLINE_TRIGGER_TYPES = [
  "PLAYER_ACCEPTS",
  "PLAYER_ENTERS_LOCATION",
  "PLAYER_SPEAKS_TO_CHARACTER",
  "QUEST_STATE",
  "EVENT_STATE",
  "MECHANICS_STATE",
  "ITEM_STATE",
  "TIME_REACHED",
  "PREVIOUS_CONSEQUENCE",
  "MANUAL_START",
  "AI_SEMANTIC_TRIGGER",
];
export const STORY_BRANCHING_POLICIES = [
  "ALLOW_RUNTIME_BRANCHES",
  "ALLOW_TEMPORARY_DIVERGENCE",
  "AUTHORED_PATH_ONLY",
];
export const STORY_COMPLETION_POLICIES = [
  "SCENARIO_COMPLETION",
  "MANUAL_CONFIRMATION",
  "OBJECTIVE_EVIDENCE",
];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_STORYLINE_NODES = 64;
const MAX_TRIGGERS_PER_NODE = 12;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeEnum(value, allowed, fallback) {
  const normalized = normalizeString(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function makeLocalId(prefix) {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `${prefix}_${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function splitGuidanceLines(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeString).filter(Boolean);
  }

  return String(value || "")
    .split(/\r?\n/)
    .map(normalizeString)
    .filter(Boolean);
}

export function joinGuidanceLines(value) {
  return splitGuidanceLines(value).join("\n");
}

export function normalizeStorylineReference(reference) {
  const source = normalizeObject(reference);
  const creationType = normalizeString(source.type).toUpperCase();
  const referenceType =
    creationType === "ROOM_TEMPLATE" || creationType === "STORY"
      ? "STORY"
      : creationType === "SCENARIO"
        ? "SCENARIO"
        : normalizeEnum(source.referenceType, STORYLINE_REFERENCE_TYPES, "");

  return {
    id: normalizeString(
      source.id || source.creationId || source.creation_id || source.rowId
    ),
    type: referenceType === "STORY" ? "ROOM_TEMPLATE" : "SCENARIO",
    referenceType,
    title: normalizeString(source.title) || "Untitled",
    subtitle: normalizeString(source.subtitle || source.description),
    contentRating:
      normalizeString(source.contentRating || source.content_rating) || "SFW",
    imageUrl:
      normalizeString(source.imageUrl || source.image_url || source.url) || null,
  };
}

export function createStorylineTrigger(overrides = {}) {
  const source = normalizeObject(overrides);

  return {
    contractVersion: STORYLINE_TRIGGER_CONTRACT_VERSION,
    id: normalizeString(source.id) || makeLocalId("trigger"),
    type: normalizeEnum(
      source.type,
      STORYLINE_TRIGGER_TYPES,
      "AI_SEMANTIC_TRIGGER"
    ),
    label: normalizeString(source.label),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    config: normalizeObject(source.config),
  };
}

export function createStorylineNode(reference, index = 0) {
  const normalizedReference = normalizeStorylineReference(reference);

  return {
    contractVersion: STORYLINE_NODE_CONTRACT_VERSION,
    id: makeLocalId("storyline_node"),
    order: Number.isInteger(index) ? index : 0,
    referenceType: normalizedReference.referenceType,
    reference: normalizedReference,
    entryPolicy: index === 0 ? "STORYLINE_START" : "PREVIOUS_NODE_TRANSITION",
    completionPolicy: "REFERENCE_COMPLETION",
    completionGuidance: "",
    transitionPolicy: "COMPLETE_STORYLINE",
    triggerMode: "ANY",
    triggers: [],
    openWorldGuidance: "",
    pressureGuidance: "",
    enabled: true,
  };
}

export function normalizeStorylineDefaultTransitionPolicy(value) {
  return normalizeEnum(
    value,
    STORYLINE_NON_TERMINAL_TRANSITION_POLICIES,
    "OPEN_WORLD_UNTIL_TRIGGER"
  );
}

export function normalizeStorylineNode(
  node,
  index = 0,
  total = 1,
  { defaultTransitionPolicy = "OPEN_WORLD_UNTIL_TRIGGER" } = {}
) {
  const source = normalizeObject(node);
  const reference = normalizeStorylineReference(
    source.reference || source.asset || source.creation || source
  );
  const isLast = index === total - 1;
  const normalizedDefaultTransition =
    normalizeStorylineDefaultTransitionPolicy(defaultTransitionPolicy);
  const requestedTransition = normalizeEnum(
    source.transitionPolicy,
    STORYLINE_TRANSITION_POLICIES,
    isLast ? "COMPLETE_STORYLINE" : normalizedDefaultTransition
  );
  const transitionPolicy = isLast
    ? "COMPLETE_STORYLINE"
    : requestedTransition === "COMPLETE_STORYLINE"
      ? normalizedDefaultTransition
      : requestedTransition;

  return {
    contractVersion: STORYLINE_NODE_CONTRACT_VERSION,
    id: normalizeString(source.id) || makeLocalId("storyline_node"),
    order: index,
    referenceType: reference.referenceType,
    reference,
    entryPolicy:
      index === 0 ? "STORYLINE_START" : "PREVIOUS_NODE_TRANSITION",
    completionPolicy:
      normalizeString(source.completionPolicy).toUpperCase() ||
      "REFERENCE_COMPLETION",
    completionGuidance: normalizeString(source.completionGuidance),
    transitionPolicy,
    triggerMode: normalizeEnum(
      source.triggerMode,
      STORYLINE_TRIGGER_MODES,
      "ANY"
    ),
    triggers: normalizeArray(source.triggers)
      .slice(0, MAX_TRIGGERS_PER_NODE)
      .map(createStorylineTrigger),
    openWorldGuidance: normalizeString(source.openWorldGuidance),
    pressureGuidance: normalizeString(source.pressureGuidance),
    enabled: source.enabled !== false,
  };
}

export function normalizeStorylineNodeSequence(
  nodes,
  { defaultTransitionPolicy = "OPEN_WORLD_UNTIL_TRIGGER" } = {}
) {
  const rawNodes = normalizeArray(nodes).slice(0, MAX_STORYLINE_NODES);
  const normalizedDefaultTransition =
    normalizeStorylineDefaultTransitionPolicy(defaultTransitionPolicy);

  return rawNodes.map((node, index) =>
    normalizeStorylineNode(node, index, rawNodes.length, {
      defaultTransitionPolicy: normalizedDefaultTransition,
    })
  );
}

export function normalizeStorylineData(data = {}) {
  const source = normalizeObject(data);
  const openWorld = normalizeObject(source.openWorld);
  const defaultTransitionPolicy =
    normalizeStorylineDefaultTransitionPolicy(
      openWorld.defaultTransitionPolicy
    );
  const nodes = normalizeStorylineNodeSequence(
    source.nodes || source.ordered_nodes,
    { defaultTransitionPolicy }
  );

  return {
    ...source,
    contractVersion: STORYLINE_AUTHORING_CONTRACT_VERSION,
    builder: "STORYLINE_BUILDER",
    builderVersion: "1.0",
    creationKind: "STORYLINE",
    nodes,
    ordered_nodes: nodes,
    entryNodeId: nodes[0]?.id || null,
    openWorld: {
      contractVersion: STORYLINE_OPEN_WORLD_POLICY_VERSION,
      enabled: openWorld.enabled !== false,
      preserveChatContinuity: true,
      preserveParticipants: true,
      preserveWorldState: true,
      preserveMemory: true,
      defaultTransitionPolicy,
      guidance: normalizeString(openWorld.guidance),
      pressureCadenceGuidance: normalizeString(
        openWorld.pressureCadenceGuidance
      ),
    },
  };
}

export function validateStorylineData(data, { strict = false } = {}) {
  const normalized = normalizeStorylineData(data);
  const errors = [];
  const warnings = [];
  const nodeIds = new Set();
  const referenceIds = new Set();

  if (!normalized.nodes.length) {
    (strict ? errors : warnings).push(
      "Add at least one Story or Scenario node."
    );
  }

  normalized.nodes.forEach((node, index) => {
    const label = `Node ${index + 1}`;

    if (!node.id || nodeIds.has(node.id)) {
      errors.push(`${label} must have a unique node id.`);
    }
    nodeIds.add(node.id);

    if (!STORYLINE_REFERENCE_TYPES.includes(node.referenceType)) {
      errors.push(`${label} must reference a Story or Scenario.`);
    }

    if (!UUID_PATTERN.test(node.reference.id)) {
      errors.push(`${label} must reference a saved Crestfall creation.`);
    }

    if (referenceIds.has(node.reference.id)) {
      errors.push(
        `${label} duplicates a Story or Scenario already used in this Storyline.`
      );
    }
    referenceIds.add(node.reference.id);

    if (
      ["OPEN_WORLD_UNTIL_TRIGGER", "OPTIONAL"].includes(
        node.transitionPolicy
      ) &&
      index < normalized.nodes.length - 1 &&
      !node.triggers.some((trigger) => trigger.enabled)
    ) {
      (strict ? errors : warnings).push(
        `${label} waits in open world but has no enabled next-node trigger.`
      );
    }

    if (
      index < normalized.nodes.length - 1 &&
      node.transitionPolicy === "COMPLETE_STORYLINE"
    ) {
      errors.push(`${label} cannot complete the Storyline before the final node.`);
    }

    if (
      index === normalized.nodes.length - 1 &&
      node.transitionPolicy !== "COMPLETE_STORYLINE"
    ) {
      errors.push(`${label} must complete the Storyline because it is final.`);
    }
  });

  return {
    data: normalized,
    errors,
    warnings,
    valid: errors.length === 0,
    runtimeReady: errors.length === 0 && warnings.length === 0,
  };
}

export function createEmptyStoryAuthoring() {
  return {
    contractVersion: STORY_AUTHORING_CONTRACT_VERSION,
    branchingPolicy: "ALLOW_RUNTIME_BRANCHES",
    completionPolicy: "SCENARIO_COMPLETION",
    completionGuidance: "",
    phases: STORY_CIRCLE_PHASE_IDS.map((phaseId) => ({
      id: phaseId,
      objective: "",
      pressures: [],
      consequences: [],
      reentryHooks: [],
      beatSuggestions: [],
    })),
  };
}

export function normalizeStoryAuthoring(value = {}) {
  const source = normalizeObject(value);
  const sourcePhases = normalizeArray(source.phases);
  const byId = new Map(
    sourcePhases
      .map((phase) => normalizeObject(phase))
      .map((phase) => [normalizeString(phase.id).toLowerCase(), phase])
  );

  return {
    contractVersion: STORY_AUTHORING_CONTRACT_VERSION,
    branchingPolicy: normalizeEnum(
      source.branchingPolicy,
      STORY_BRANCHING_POLICIES,
      "ALLOW_RUNTIME_BRANCHES"
    ),
    completionPolicy: normalizeEnum(
      source.completionPolicy,
      STORY_COMPLETION_POLICIES,
      "SCENARIO_COMPLETION"
    ),
    completionGuidance: normalizeString(source.completionGuidance),
    phases: STORY_CIRCLE_PHASE_IDS.map((phaseId) => {
      const phase = normalizeObject(byId.get(phaseId));

      return {
        id: phaseId,
        objective: normalizeString(phase.objective),
        pressures: splitGuidanceLines(phase.pressures),
        consequences: splitGuidanceLines(phase.consequences),
        reentryHooks: splitGuidanceLines(phase.reentryHooks),
        beatSuggestions: splitGuidanceLines(phase.beatSuggestions),
      };
    }),
  };
}

export function buildStorylineCreationPayload({
  title,
  description,
  visibility = "PRIVATE",
  contentRating = "SFW",
  tags = [],
  data = {},
}) {
  const normalizedTitle = normalizeString(title) || "Untitled Storyline";
  const normalizedData = normalizeStorylineData(data);

  return {
    type: "STORYLINE",
    title: normalizedTitle,
    description:
      normalizeString(description) || "A continuing Crestfall Storyline.",
    visibility: normalizeString(visibility).toUpperCase() || "PRIVATE",
    content_rating:
      normalizeString(contentRating).toUpperCase() || "SFW",
    data: {
      ...normalizedData,
      title: normalizedTitle,
      description: normalizeString(description),
      tags: splitGuidanceLines(tags),
    },
  };
}
