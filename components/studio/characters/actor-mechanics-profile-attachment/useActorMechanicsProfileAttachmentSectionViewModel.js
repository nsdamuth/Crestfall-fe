"use client";

import { useMemo, useState } from "react";

import { createLinkedCreationLink } from "@/components/studio/registries/structuredRegistryUtils";

export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_CONTRACT_VERSION =
  "actor_mechanics_profile_attachment_v0";

const DEFAULT_COPY = Object.freeze({
  eyebrow: "Actor Mechanics",
  title: "Actor Mechanics Profile",
  body:
    "Attach one reusable Actor Mechanics Profile to this actor. The profile defines which mechanics domains belong to the actor while mutable state remains isolated to this actor.",
  addLabel: "Attach Actor Mechanics Profile",
  emptyLabel: "No Actor Mechanics Profile attached.",
  runtimeNote:
    "This step saves the actor-to-profile relationship only. Runtime hydration and activation are introduced separately.",
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
    bindingMode: normalizeString(
      owner.bindingMode || owner.binding_mode
    ).toUpperCase() || "UNBOUND_TEMPLATE",
    ownerType: normalizeString(
      owner.ownerType || owner.owner_type
    ).toUpperCase() || "CHARACTER",
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

function normalizeAttachmentLink(value = {}) {
  const source = normalizeObject(value);
  const creationId = normalizeString(
    source.creationId || source.creation_id || source.id
  );

  if (!creationId) return null;

  return {
    id:
      normalizeString(source.id) ||
      `actor_mechanics_profile_${creationId}`,
    creationId,
    title: normalizeString(source.title) || creationId,
    type: "ACTOR_MECHANICS_PROFILE",
    description: normalizeString(source.description),
    imageUrl: normalizeString(source.imageUrl || source.image_url),
    notes: normalizeString(source.notes),
    profileContractVersion: normalizeString(
      source.profileContractVersion || source.profile_contract_version
    ),
    presetId: normalizeString(
      source.presetId || source.preset_id
    ).toUpperCase(),
    ownerBindingMode: normalizeString(
      source.ownerBindingMode || source.owner_binding_mode
    ).toUpperCase(),
    ownerType: normalizeString(
      source.ownerType || source.owner_type
    ).toUpperCase(),
    ownerId: normalizeString(source.ownerId || source.owner_id),
    ownerTitle: normalizeString(
      source.ownerTitle || source.owner_title
    ),
    enabledDomains: [
      ...new Set(
        normalizeArray(
          source.enabledDomains || source.enabled_domains
        )
          .map((domain) => normalizeString(domain).toUpperCase())
          .filter(Boolean)
      ),
    ],
  };
}

function getAttachment(data = {}) {
  const source = normalizeObject(data);
  const link = normalizeAttachmentLink(
    source.actorMechanicsProfileLink ||
      source.actor_mechanics_profile_link
  );

  if (link) return link;

  const creationId = normalizeString(
    source.actorMechanicsProfileId ||
      source.actor_mechanics_profile_id
  );

  return creationId
    ? normalizeAttachmentLink({ creationId, title: creationId })
    : null;
}

function buildAttachmentLink(creation = {}) {
  const profile = getProfileData(creation);
  const owner = getProfileOwner(profile);
  const base = createLinkedCreationLink(creation);

  return normalizeAttachmentLink({
    ...base,
    type: "ACTOR_MECHANICS_PROFILE",
    profileContractVersion: normalizeString(profile.contractVersion),
    presetId: normalizeString(profile.presetId).toUpperCase(),
    ownerBindingMode: owner.bindingMode,
    ownerType: owner.ownerType,
    ownerId: owner.ownerId,
    ownerTitle: owner.ownerTitle,
    enabledDomains: getEnabledDomains(profile),
  });
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

    if (normalizedActorId && owner.ownerId !== normalizedActorId) {
      return "That profile is already bound to a different actor.";
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
    enabledDomainLabels: link.enabledDomains.map(humanize),
    notes: link.notes || "",
    removeAriaLabel: `Remove ${
      link.title || "attached Actor Mechanics Profile"
    }`,
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
  const attachment = getAttachment(data);

  const selectedCreationIds = useMemo(
    () => (attachment?.creationId ? [attachment.creationId] : []),
    [attachment?.creationId]
  );

  function persist(nextAttachment) {
    const normalized = normalizeAttachmentLink(nextAttachment);

    updateDataField?.(
      "actorMechanicsProfileAttachmentContractVersion",
      ACTOR_MECHANICS_PROFILE_ATTACHMENT_CONTRACT_VERSION
    );
    updateDataField?.(
      "actorMechanicsProfileId",
      normalized?.creationId || ""
    );
    updateDataField?.("actorMechanicsProfileLink", normalized);
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

    persist(buildAttachmentLink(creation));
    setSelectionError("");
    setIsPickerOpen(false);
  }

  function handleRemove() {
    persist(null);
    setSelectionError("");
  }

  function handleNotesChange(notes) {
    if (!attachment) return;

    persist({
      ...attachment,
      notes,
    });
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
