export const STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION =
  "story_character_lifecycle_v0";

export const STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS = Object.freeze({
  STORY_PINNED: "STORY_PINNED",
  OPENING_TEMPORARY: "OPENING_TEMPORARY",
});

export const STORY_CHARACTER_LIFECYCLE_AUTHORING_OPTIONS = Object.freeze([
  Object.freeze({
    value: STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED,
    label: "Persistent Story Cast",
    description:
      "Loads at Story start and remains active until another Story/runtime system changes its presence.",
  }),
  Object.freeze({
    value: STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY,
    label: "Opening Only",
    description:
      "Loads for the opening and releases automatically when the initial Story phase exits.",
  }),
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function normalizeStoryCharacterLifecycleAuthoringKind(selection = {}) {
  const source = normalizeObject(selection);
  const lifecycle = normalizeObject(
    source.lifecycle || source.storyLifecycle || source.story_lifecycle
  );
  const rawKind = normalizeUpper(
    lifecycle.kind ||
      lifecycle.type ||
      source.lifecycleKind ||
      source.lifecycle_kind ||
      source.lifecyclePolicy ||
      source.lifecycle_policy
  );

  if (
    ["OPENING", "OPENING_ONLY", "OPENING_TEMPORARY", "SETUP_TEMPORARY"].includes(
      rawKind
    )
  ) {
    return STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY;
  }

  return STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED;
}

export function getStoryCharacterLifecycleAuthoringOption(selection = {}) {
  const kind = normalizeStoryCharacterLifecycleAuthoringKind(selection);

  return (
    STORY_CHARACTER_LIFECYCLE_AUTHORING_OPTIONS.find(
      (option) => option.value === kind
    ) || STORY_CHARACTER_LIFECYCLE_AUTHORING_OPTIONS[0]
  );
}

export function patchStoryCharacterLifecycleSelection(
  selection = {},
  requestedKind = STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED
) {
  const source = normalizeObject(selection);
  const kind =
    requestedKind ===
    STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY
      ? STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY
      : STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED;

  const releasePolicy =
    kind === STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY
      ? "INITIAL_PHASE_EXIT"
      : "NEVER";

  return {
    ...source,
    lifecycle: {
      contractVersion: STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,
      kind,
      releasePolicy,
    },
  };
}
