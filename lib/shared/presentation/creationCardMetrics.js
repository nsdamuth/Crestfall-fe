export const CREATION_CARD_METRIC_IDS = Object.freeze({
  INTERACTIONS: "interactionCount",
  LIKES: "likeCount",
  IMAGE_USES: "imageUseCount",
  STORY_USES: "storyUseCount",
  EXTERNAL_USES: "externalCreationUseCount",
});

export const CREATION_CARD_METRIC_LABELS = Object.freeze({
  [CREATION_CARD_METRIC_IDS.INTERACTIONS]: "Messages",
  [CREATION_CARD_METRIC_IDS.LIKES]: "Likes",
  [CREATION_CARD_METRIC_IDS.IMAGE_USES]: "Image uses",
  [CREATION_CARD_METRIC_IDS.STORY_USES]: "Story uses",
  [CREATION_CARD_METRIC_IDS.EXTERNAL_USES]: "Project uses",
});

const INTERACTION_REUSE_TYPES = new Set([
  "CHARACTER",
  "NARRATOR",
]);

const STORY_INTERACTION_TYPES = new Set([
  "ROOM_TEMPLATE",
]);

const VISUAL_REUSE_TYPES = new Set([
  "PLAYER_CHARACTER",
  "LOCATION",
  "OUTFIT",
  "WARDROBE",
  "IMAGE_PRESET",
]);

const VISUAL_ONLY_TYPES = new Set([
  "POSE",
]);

const STORY_REFERENCE_TYPES = new Set([
  "SCENARIO",
  "NPC_REGISTRY",
  "LOCATION_REGISTRY",
  "FACTION_REGISTRY",
  "ORGANIZATION_REGISTRY",
  "EVENT_REGISTRY",
  "QUEST_REGISTRY",
  "ITEM_REGISTRY",
  "MECHANICS_MODULE",
  "MECHANICS_ACTION",
  "MECHANICS_ACTION_SET",
  "RULES_CODEX",
  "ACTOR_MECHANICS_PROFILE",
]);

const REUSE_REFERENCE_TYPES = new Set([
  "CHARACTER_TEMPLATE",
  "STATS_POOLS_PROFILE",
  "PROGRESSION_PROFILE",
  "SKILLS_PROFILE",
  "ABILITY_SPELL_PROFILE",
  "WALLET_PROFILE",
]);

function normalizeType(value) {
  return String(value || "").trim().toUpperCase();
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

function toMetricValue(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.trunc(number));
}

function hasMetricField(source, camel, snake) {
  return Object.prototype.hasOwnProperty.call(source, camel) ||
    Object.prototype.hasOwnProperty.call(source, snake);
}

export function getCreationCardMetricProfile(creationType) {
  const type = normalizeType(creationType);

  if (INTERACTION_REUSE_TYPES.has(type)) {
    return Object.freeze([
      CREATION_CARD_METRIC_IDS.INTERACTIONS,
      CREATION_CARD_METRIC_IDS.LIKES,
      CREATION_CARD_METRIC_IDS.EXTERNAL_USES,
    ]);
  }

  if (STORY_INTERACTION_TYPES.has(type)) {
    return Object.freeze([
      CREATION_CARD_METRIC_IDS.INTERACTIONS,
      CREATION_CARD_METRIC_IDS.LIKES,
    ]);
  }

  if (VISUAL_REUSE_TYPES.has(type)) {
    return Object.freeze([
      CREATION_CARD_METRIC_IDS.IMAGE_USES,
      CREATION_CARD_METRIC_IDS.LIKES,
      CREATION_CARD_METRIC_IDS.EXTERNAL_USES,
    ]);
  }

  if (VISUAL_ONLY_TYPES.has(type)) {
    return Object.freeze([
      CREATION_CARD_METRIC_IDS.IMAGE_USES,
      CREATION_CARD_METRIC_IDS.LIKES,
    ]);
  }

  if (STORY_REFERENCE_TYPES.has(type)) {
    return Object.freeze([
      CREATION_CARD_METRIC_IDS.STORY_USES,
      CREATION_CARD_METRIC_IDS.LIKES,
      CREATION_CARD_METRIC_IDS.EXTERNAL_USES,
    ]);
  }

  if (REUSE_REFERENCE_TYPES.has(type)) {
    return Object.freeze([
      CREATION_CARD_METRIC_IDS.LIKES,
      CREATION_CARD_METRIC_IDS.EXTERNAL_USES,
    ]);
  }

  // STORYLINE, LORE, TIMELINE and unknown/special types intentionally expose
  // only the universally meaningful Like count until they gain an explicit
  // structured usage authority suitable for a consumer-facing card.
  return Object.freeze([CREATION_CARD_METRIC_IDS.LIKES]);
}

export function normalizeCreationCardMetricEntries(metrics = []) {
  if (!Array.isArray(metrics)) return [];

  return metrics
    .map((metric) => {
      const source = normalizeObject(metric);
      const id = String(source.id || "").trim();
      const value = toMetricValue(source.value);
      if (!id || value === null) return null;

      return {
        id,
        label:
          String(source.label || CREATION_CARD_METRIC_LABELS[id] || "Usage").trim() ||
          "Usage",
        value,
      };
    })
    .filter(Boolean)
    .slice(0, 3);
}

export function buildLegacyCreationCardMetrics(stats = {}) {
  const source = normalizeObject(stats);
  const interactions = toMetricValue(
    firstDefined(source.plays, source.messages, source.interactions)
  );
  const likes = toMetricValue(firstDefined(source.hearts, source.likes));
  const metrics = [];

  if (interactions !== null) {
    metrics.push({
      id: CREATION_CARD_METRIC_IDS.INTERACTIONS,
      label: CREATION_CARD_METRIC_LABELS[CREATION_CARD_METRIC_IDS.INTERACTIONS],
      value: interactions,
    });
  }

  if (likes !== null) {
    metrics.push({
      id: CREATION_CARD_METRIC_IDS.LIKES,
      label: CREATION_CARD_METRIC_LABELS[CREATION_CARD_METRIC_IDS.LIKES],
      value: likes,
    });
  }

  // Bookmark/saves aggregate is intentionally ignored. The bookmark action is
  // private viewer state and remains a separate overlay control.
  return metrics;
}

export function buildCreationCardMetrics({
  creationType,
  usageMetrics = null,
  fallbackStats = null,
} = {}) {
  const usage = normalizeObject(usageMetrics);
  const fallback = normalizeObject(fallbackStats);
  const hasUsage = Object.keys(usage).length > 0;

  if (!hasUsage) {
    const legacy = buildLegacyCreationCardMetrics(fallback);
    const legacyById = new Map(legacy.map((metric) => [metric.id, metric]));
    const profile = getCreationCardMetricProfile(creationType);
    const projected = profile
      .map((id) => legacyById.get(id) || null)
      .filter(Boolean);

    // Like is universal. Legacy/fixture data that predates aggregate metrics
    // may not carry it at all, so expose an honest zero rather than reusing a
    // bookmark count or inventing a different metric.
    if (!projected.some((metric) => metric.id === CREATION_CARD_METRIC_IDS.LIKES)) {
      projected.push({
        id: CREATION_CARD_METRIC_IDS.LIKES,
        label: CREATION_CARD_METRIC_LABELS[CREATION_CARD_METRIC_IDS.LIKES],
        value: likesFromFallback(fallback),
      });
    }

    return normalizeCreationCardMetricEntries(projected);
  }

  const values = {
    [CREATION_CARD_METRIC_IDS.INTERACTIONS]: toMetricValue(
      firstDefined(usage.interactionCount, usage.interaction_count)
    ),
    [CREATION_CARD_METRIC_IDS.LIKES]: toMetricValue(
      firstDefined(usage.likeCount, usage.like_count)
    ),
    [CREATION_CARD_METRIC_IDS.IMAGE_USES]: toMetricValue(
      firstDefined(usage.imageUseCount, usage.image_use_count)
    ),
    [CREATION_CARD_METRIC_IDS.STORY_USES]: toMetricValue(
      firstDefined(usage.storyUseCount, usage.story_use_count)
    ),
    [CREATION_CARD_METRIC_IDS.EXTERNAL_USES]: toMetricValue(
      firstDefined(
        usage.externalCreationUseCount,
        usage.external_creation_use_count
      )
    ),
  };

  // M2 staged rollout can distinguish an unavailable metric from an
  // authoritative zero. Only render fields actually projected by the backend.
  const availability = {
    [CREATION_CARD_METRIC_IDS.INTERACTIONS]: hasMetricField(
      usage,
      "interactionCount",
      "interaction_count"
    ),
    [CREATION_CARD_METRIC_IDS.LIKES]: hasMetricField(usage, "likeCount", "like_count"),
    [CREATION_CARD_METRIC_IDS.IMAGE_USES]: hasMetricField(
      usage,
      "imageUseCount",
      "image_use_count"
    ),
    [CREATION_CARD_METRIC_IDS.STORY_USES]: hasMetricField(
      usage,
      "storyUseCount",
      "story_use_count"
    ),
    [CREATION_CARD_METRIC_IDS.EXTERNAL_USES]: hasMetricField(
      usage,
      "externalCreationUseCount",
      "external_creation_use_count"
    ),
  };

  return normalizeCreationCardMetricEntries(
    getCreationCardMetricProfile(creationType)
      .filter((id) => availability[id] && values[id] !== null)
      .map((id) => ({
        id,
        label: CREATION_CARD_METRIC_LABELS[id],
        value: values[id],
      }))
  );
}

function likesFromFallback(fallback = {}) {
  return toMetricValue(firstDefined(fallback.hearts, fallback.likes)) ?? 0;
}

function formatWithUnit(value, divisor, suffix) {
  const scaled = value / divisor;
  const rounded = scaled < 10 ? Math.round(scaled * 10) / 10 : Math.round(scaled);

  if (rounded >= 1000 && suffix === "k") {
    return formatWithUnit(value, 1_000_000, "M");
  }
  if (rounded >= 1000 && suffix === "M") {
    return formatWithUnit(value, 1_000_000_000, "B");
  }

  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(/\.0$/, "");

  return `${text}${suffix}`;
}

export function formatCreationCardMetricCount(value) {
  const normalized = toMetricValue(value) ?? 0;

  if (normalized < 1_000) return String(normalized);
  if (normalized < 1_000_000) return formatWithUnit(normalized, 1_000, "k");
  if (normalized < 1_000_000_000) {
    return formatWithUnit(normalized, 1_000_000, "M");
  }
  return formatWithUnit(normalized, 1_000_000_000, "B");
}
