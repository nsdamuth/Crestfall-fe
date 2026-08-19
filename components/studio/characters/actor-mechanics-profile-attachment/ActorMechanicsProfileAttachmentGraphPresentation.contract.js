export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_PRESENTATION_CONTRACT_VERSION =
  "actor_mechanics_profile_attachment_graph.presentation.v1";

export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_CONTRACT_VERSION =
  "actor_mechanics_profile_attachment_graph_v0";

export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_CONTRACT_VERSION =
  "actor_mechanics_profile_attachment_draft_v0";

export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_AUTHORITIES = Object.freeze({
  GRAPH: "CREATION_GRAPH",
  UNSAVED_DRAFT: "UNSAVED_DRAFT",
  UNSAVED_PICKER_SELECTION: "UNSAVED_PICKER_SELECTION",
  NONE: "NONE",
});

export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_STATES = Object.freeze({
  NONE: "NONE",
  PENDING_LINK: "PENDING_LINK",
  PENDING_REMOVAL: "PENDING_REMOVAL",
});

export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_CALLBACK_KEYS = Object.freeze([
  "onOpenPicker",
  "onRemoveAttachment",
  "onChangeAttachmentNotes",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function upper(value) {
  return text(value).toUpperCase();
}

function humanize(value) {
  return text(value)
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeAuthority(value) {
  const normalized = upper(value);

  return Object.values(
    ACTOR_MECHANICS_PROFILE_ATTACHMENT_AUTHORITIES
  ).includes(normalized)
    ? normalized
    : ACTOR_MECHANICS_PROFILE_ATTACHMENT_AUTHORITIES.NONE;
}

function normalizeDraftState(value) {
  const normalized = upper(value);

  return Object.values(
    ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_STATES
  ).includes(normalized)
    ? normalized
    : ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_STATES.NONE;
}

function projectAttachment(value = {}) {
  const source = object(value);
  const creationId = text(
    source.creationId || source.creation_id || source.id
  );

  if (!creationId) return null;

  const ownerBindingMode =
    upper(
      source.ownerBindingMode ||
        source.owner_binding_mode
    ) || "UNBOUND_TEMPLATE";
  const ownerType =
    upper(source.ownerType || source.owner_type) ||
    "CHARACTER";
  const presetId =
    upper(source.presetId || source.preset_id) ||
    "CUSTOM";
  const enabledDomains = [
    ...new Set(
      array(
        source.enabledDomains ||
          source.enabled_domains
      )
        .map(upper)
        .filter(Boolean)
    ),
  ];

  return {
    id:
      text(source.id) ||
      `actor_mechanics_profile_${creationId}`,
    creationId,
    title:
      text(source.title) ||
      "Attached Actor Mechanics Profile",
    typeLabel: "Actor Mechanics Profile",
    description: text(source.description),
    imageUrl: text(
      source.imageUrl || source.image_url
    ),
    presetId,
    presetLabel: humanize(presetId),
    ownerBindingMode,
    ownerType,
    ownerId: text(
      source.ownerId || source.owner_id
    ),
    ownerTitle: text(
      source.ownerTitle || source.owner_title
    ),
    ownerLabel:
      ownerBindingMode === "BOUND_ACTOR"
        ? `Bound ${humanize(ownerType || "actor")}`
        : `${humanize(ownerType || "actor")} template`,
    enabledDomains,
    enabledDomainLabels:
      enabledDomains.map(humanize),
    notes: text(source.notes),
    removeAriaLabel:
      `Remove ${
        text(source.title) ||
        "attached Actor Mechanics Profile"
      }`,
  };
}

export function projectActorMechanicsProfileAttachmentGraphPresentation({
  attachment = null,
  attachmentAuthority = "NONE",
  draftState = "NONE",
  actorType = "CHARACTER",
  actorTitle = "",
  selectionError = "",
  disabled = false,
  callbacks = {},
} = {}) {
  const projectedAttachment =
    projectAttachment(attachment);
  const authority =
    projectedAttachment
      ? normalizeAuthority(attachmentAuthority)
      : ACTOR_MECHANICS_PROFILE_ATTACHMENT_AUTHORITIES.NONE;
  const normalizedDraftState =
    normalizeDraftState(draftState);
  const normalizedActorType =
    upper(actorType) || "CHARACTER";
  const callbackSource = object(callbacks);

  const warningMessage =
    projectedAttachment?.presetId === "BEYOND_SCALE"
      ? "Beyond Scale profiles only permit ordinary opposed resolution through an explicit working mode."
      : "";

  const draftMessage =
    normalizedDraftState === "PENDING_LINK"
      ? "This attachment change is not saved yet."
      : normalizedDraftState === "PENDING_REMOVAL"
        ? "This attachment will be removed when the actor is saved."
        : "";

  return {
    contractVersion:
      ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_PRESENTATION_CONTRACT_VERSION,

    chassisContracts: {
      graph:
        ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_CONTRACT_VERSION,
      draft:
        ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_CONTRACT_VERSION,
    },

    eyebrow: "Actor Mechanics",
    title: "Actor Mechanics Profile",
    body:
      "Attach one reusable Actor Mechanics Profile to this actor. The relationship is stored in Crestfall's creation graph while mutable state remains isolated to this actor.",
    addLabel: "Attach Actor Mechanics Profile",
    emptyLabel:
      "No Actor Mechanics Profile attached.",
    runtimeNote:
      "The saved relationship is graph-authoritative. Profile identity, description, ownership policy, and enabled domains are resolved from the linked creation instead of copied into this actor.",

    attachment: projectedAttachment,
    attachmentAuthority: authority,
    attachmentAuthorityLabel:
      authority === "CREATION_GRAPH"
        ? "Saved graph relationship"
        : authority === "UNSAVED_PICKER_SELECTION"
          ? "Unsaved picker selection"
          : authority === "UNSAVED_DRAFT"
            ? "Unsaved attachment draft"
            : "",

    draftState: normalizedDraftState,
    draftMessage,

    errorMessage: text(selectionError),
    warningMessage,
    disabled: Boolean(disabled),

    picker: {
      title: "Attach Actor Mechanics Profile",
      body:
        `Choose an owned Actor Mechanics Profile compatible with ${
          text(actorTitle) ||
          `this ${humanize(normalizedActorType)}`
        }. Unbound templates and profiles already bound to this actor are accepted.`,
      allowedTypes: ["ACTOR_MECHANICS_PROFILE"],
      selectedCreationIds:
        projectedAttachment?.creationId
          ? [projectedAttachment.creationId]
          : [],
      compatibilityAuthority: "CHASSIS_APPLICATION_VIEWMODEL",
      compatibilityRulesSummary: [
        "The selected creation must contain a saved Actor Mechanics Profile contract.",
        `The profile owner type must match ${humanize(normalizedActorType)}.`,
        "A profile bound to an actor is accepted only when it is already bound to this actor.",
      ],
    },

    callbacks: {
      onOpenPicker:
        callbackSource.onOpenPicker || null,
      onRemoveAttachment:
        callbackSource.onRemoveAttachment || null,
      onChangeAttachmentNotes:
        callbackSource.onChangeAttachmentNotes || null,
    },

    architecture: {
      graphAuthorityOwnedByChassis: true,
      draftPersistenceOwnedByChassis: true,
      profileResolutionOwnedByChassis: true,
      compatibilityEnforcementOwnedByChassis: true,
      mutableActorStateExcludedFromAttachment: true,
      lightweightNpcEntryUsesSeparateEmbeddedContract: true,
    },
  };
}
