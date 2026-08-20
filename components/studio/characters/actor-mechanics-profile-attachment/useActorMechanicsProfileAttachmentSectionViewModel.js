"use client";

import { useMemo, useState } from "react";

export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_CONTRACT_VERSION =
  "actor_mechanics_profile_attachment_graph_v0";
export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_VERSION =
  "actor_mechanics_profile_attachment_draft_v0";

const DEFAULT_COPY = Object.freeze({
  eyebrow: "Actor Mechanics",
  title: "Actor Mechanics Profile",
  body:
    "Attach one reusable Actor Mechanics Profile to this actor. The relationship is stored in Crestfall's creation graph while mutable state remains isolated to this actor.",
  addLabel: "Attach Actor Mechanics Profile",
  emptyLabel: "No Actor Mechanics Profile attached.",
  runtimeNote:
    "The saved relationship is graph-authoritative. Profile identity, description, ownership policy, and enabled domains are resolved from the linked creation instead of copied into this actor.",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function humanize(value) {
  return normalizeString(value)
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getProfileData(creation = {}) {
  const data = normalizeObject(creation.data);

  return normalizeObject(
    data.actor_mechanics_profile ||
      data.actorMechanicsProfile ||
      data.mechanics_loadout ||
      data.mechanicsLoadout
  );
}

function getProfileOwner(profile = {}) {
  const owner = normalizeObject(profile.owner);

  return {
    bindingMode:
      normalizeString(owner.bindingMode || owner.binding_mode).toUpperCase() ||
      "UNBOUND_TEMPLATE",
    ownerType:
      normalizeString(owner.ownerType || owner.owner_type).toUpperCase() ||
      "CHARACTER",
    ownerId: normalizeString(owner.ownerId || owner.owner_id),
    ownerTitle: normalizeString(owner.ownerTitle || owner.owner_title),
  };
}

function getEnabledDomains(profile = {}) {
  return [
    ...new Set(
      normalizeArray(profile.bindings)
        .filter((binding) => normalizeObject(binding).enabled !== false)
        .map((binding) =>
          normalizeString(normalizeObject(binding).domain).toUpperCase()
        )
        .filter(Boolean)
    ),
  ];
}

function getGraphProjection(data = {}) {
  const source = normalizeObject(data);
  const projection = normalizeObject(
    source.actorMechanicsProfileAttachmentGraph ||
      source.actor_mechanics_profile_attachment_graph
  );
  const profile = normalizeObject(projection.profile);
  const profileCreationId = normalizeString(
    projection.profileCreationId ||
      projection.profile_creation_id ||
      profile.id
  );

  if (!profileCreationId) return null;

  return {
    id: `actor_mechanics_profile_${profileCreationId}`,
    creationId: profileCreationId,
    title: normalizeString(profile.title) || "Actor Mechanics Profile",
    type: "ACTOR_MECHANICS_PROFILE",
    description: normalizeString(profile.description),
    imageUrl: "",
    notes: normalizeString(projection.notes),
    profileContractVersion: normalizeString(profile.profileContractVersion),
    presetId: normalizeString(profile.presetId).toUpperCase() || "CUSTOM",
    ownerBindingMode:
      normalizeString(profile.ownerBindingMode).toUpperCase() ||
      "UNBOUND_TEMPLATE",
    ownerType: normalizeString(profile.ownerType).toUpperCase(),
    ownerId: normalizeString(profile.ownerId),
    ownerTitle: normalizeString(profile.ownerTitle),
    enabledDomains: [
      ...new Set(
        normalizeArray(profile.enabledDomains)
          .map((domain) => normalizeString(domain).toUpperCase())
          .filter(Boolean)
      ),
    ],
    authority: normalizeString(projection.authority),
  };
}

function getDraft(data = {}) {
  const source = normalizeObject(data);
  const hasDraft =
    Object.prototype.hasOwnProperty.call(
      source,
      "actorMechanicsProfileAttachmentDraft"
    ) ||
    Object.prototype.hasOwnProperty.call(
      source,
      "actor_mechanics_profile_attachment_draft"
    );

  if (!hasDraft) return null;

  const draft = normalizeObject(
    source.actorMechanicsProfileAttachmentDraft ||
      source.actor_mechanics_profile_attachment_draft
  );

  return {
    version:
      normalizeString(draft.version) ||
      ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_VERSION,
    profileCreationId: normalizeString(
      draft.profileCreationId || draft.profile_creation_id
    ),
    notes: normalizeString(draft.notes),
  };
}

function buildAttachmentFromCreation(creation = {}, notes = "") {
  const profile = getProfileData(creation);
  const owner = getProfileOwner(profile);
  const creationId = normalizeString(creation.id || creation.creationId);

  if (!creationId) return null;

  return {
    id: `actor_mechanics_profile_${creationId}`,
    creationId,
    title:
      normalizeString(creation.title) ||
      normalizeString(profile.title) ||
      "Actor Mechanics Profile",
    type: "ACTOR_MECHANICS_PROFILE",
    description:
      normalizeString(profile.summary) || normalizeString(creation.description),
    imageUrl: "",
    notes: normalizeString(notes),
    profileContractVersion: normalizeString(profile.contractVersion),
    presetId: normalizeString(profile.presetId).toUpperCase() || "CUSTOM",
    ownerBindingMode: owner.bindingMode,
    ownerType: owner.ownerType,
    ownerId: owner.ownerId,
    ownerTitle: owner.ownerTitle,
    enabledDomains: getEnabledDomains(profile),
    authority: "UNSAVED_PICKER_SELECTION",
  };
}

function getCompatibilityError({ creation, actorType, actorId }) {
  const profile = getProfileData(creation);
  const owner = getProfileOwner(profile);
  const normalizedActorType = normalizeString(actorType).toUpperCase();
  const normalizedActorId = normalizeString(actorId);

  if (!Object.keys(profile).length) {
    return "That creation does not contain a saved Actor Mechanics Profile contract.";
  }

  if (owner.ownerType !== normalizedActorType) {
    return `That profile targets a ${humanize(
      owner.ownerType
    )} and cannot be attached to this ${humanize(normalizedActorType)}.`;
  }

  if (owner.bindingMode === "BOUND_ACTOR") {
    if (!owner.ownerId) {
      return "That bound profile does not contain an actor owner reference.";
    }

    if (!normalizedActorId || owner.ownerId !== normalizedActorId) {
      return "That profile is bound to a different actor.";
    }
  }

  return "";
}

function toViewAttachment(link) {
  if (!link) return null;

  const ownerLabel =
    link.ownerBindingMode === "BOUND_ACTOR"
      ? `Bound ${humanize(link.ownerType || "actor")}`
      : `${humanize(link.ownerType || "actor")} template`;

  return {
    id: link.id,
    title: link.title || "Attached Actor Mechanics Profile",
    typeLabel: "Actor Mechanics Profile",
    description: link.description || "",
    imageUrl: link.imageUrl || "",
    presetLabel: humanize(link.presetId || "CUSTOM"),
    ownerLabel,
    enabledDomainLabels: normalizeArray(link.enabledDomains).map(humanize),
    notes: link.notes || "",
    removeAriaLabel: `Remove ${
      link.title || "attached Actor Mechanics Profile"
    }`,
  };
}

function buildDraft(profileCreationId = "", notes = "") {
  return {
    version: ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_VERSION,
    profileCreationId: normalizeString(profileCreationId),
    notes: normalizeString(notes),
  };
}

export function useActorMechanicsProfileAttachmentSectionViewModel({
  data = {},
  updateDataField = null,
  actorType = "CHARACTER",
  actorId = "",
  actorTitle = "",
  disabled = false,
  eyebrow = DEFAULT_COPY.eyebrow,
  title = DEFAULT_COPY.title,
  body = DEFAULT_COPY.body,
  addLabel = DEFAULT_COPY.addLabel,
  emptyLabel = DEFAULT_COPY.emptyLabel,
  runtimeNote = DEFAULT_COPY.runtimeNote,
} = {}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const [pendingProfileCreation, setPendingProfileCreation] = useState(null);

  const graphAttachment = getGraphProjection(data);
  const draft = getDraft(data);
  const attachment = draft
    ? draft.profileCreationId
      ? pendingProfileCreation
        ? buildAttachmentFromCreation(pendingProfileCreation, draft.notes)
        : graphAttachment?.creationId === draft.profileCreationId
          ? { ...graphAttachment, notes: draft.notes }
          : {
              id: `actor_mechanics_profile_${draft.profileCreationId}`,
              creationId: draft.profileCreationId,
              title: "Pending Actor Mechanics Profile",
              type: "ACTOR_MECHANICS_PROFILE",
              description: "",
              imageUrl: "",
              notes: draft.notes,
              profileContractVersion: "",
              presetId: "CUSTOM",
              ownerBindingMode: "UNBOUND_TEMPLATE",
              ownerType: normalizeString(actorType).toUpperCase(),
              ownerId: "",
              ownerTitle: "",
              enabledDomains: [],
              authority: "UNSAVED_DRAFT",
            }
      : null
    : graphAttachment;

  const selectedCreationIds = useMemo(
    () => (attachment?.creationId ? [attachment.creationId] : []),
    [attachment?.creationId]
  );

  function persistDraft(profileCreationId, notes = "") {
    updateDataField?.(
      "actorMechanicsProfileAttachmentDraft",
      buildDraft(profileCreationId, notes)
    );
  }

  function handleSelect(creation) {
    const compatibilityError = getCompatibilityError({
      creation,
      actorType,
      actorId,
    });

    if (compatibilityError) {
      setSelectionError(compatibilityError);
      setIsPickerOpen(false);
      return;
    }

    const currentNotes = draft?.notes || graphAttachment?.notes || "";
    setPendingProfileCreation(creation);
    persistDraft(creation.id, currentNotes);
    setSelectionError("");
    setIsPickerOpen(false);
  }

  function handleRemove() {
    setPendingProfileCreation(null);
    persistDraft("", "");
    setSelectionError("");
  }

  function handleNotesChange(notes) {
    if (!attachment?.creationId) return;

    persistDraft(attachment.creationId, notes);
  }

  const warningMessage =
    attachment?.presetId === "BEYOND_SCALE"
      ? "Beyond Scale profiles only permit ordinary opposed resolution through an explicit working mode."
      : "";

  return {
    viewProps: {
      eyebrow,
      title,
      body,
      addLabel,
      emptyLabel,
      runtimeNote,
      attachment: toViewAttachment(attachment),
      errorMessage: selectionError,
      warningMessage,
      disabled,
      onOpenPicker: () => {
        setSelectionError("");
        setIsPickerOpen(true);
      },
      onRemoveAttachment: handleRemove,
      onChangeAttachmentNotes: handleNotesChange,
    },
    pickerProps: isPickerOpen
      ? {
          title: "Attach Actor Mechanics Profile",
          body: `Choose an owned Actor Mechanics Profile compatible with ${
            actorTitle || `this ${humanize(actorType)}`
          }. Unbound templates and profiles already bound to this actor are accepted.`,
          allowedTypes: ["ACTOR_MECHANICS_PROFILE"],
          selectedCreationIds,
          onClose: () => setIsPickerOpen(false),
          onSelect: handleSelect,
        }
      : null,
  };
}
