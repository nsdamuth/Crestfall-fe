export const actorMechanicsProfileAttachmentGraphSavedFixture =
  Object.freeze({
    attachment: {
      id:
        "actor_mechanics_profile_profile-1",
      creationId: "profile-1",
      title: "Full Adventurer Profile",
      description:
        "A complete Player Character mechanics package with owner-scoped state.",
      presetId: "FULL_PLAYER_CHARACTER",
      ownerBindingMode: "UNBOUND_TEMPLATE",
      ownerType: "PLAYER_CHARACTER",
      enabledDomains: [
        "STATS",
        "PROGRESSION",
        "SKILLS",
        "MAGIC",
        "ABILITIES",
        "WALLET",
        "INVENTORY",
      ],
      notes:
        "Use the campaign's standard progression curve.",
    },
    attachmentAuthority: "CREATION_GRAPH",
    draftState: "NONE",
    actorType: "PLAYER_CHARACTER",
    actorTitle: "Rowan",
    selectionError: "",
    disabled: false,
  });

export const actorMechanicsProfileAttachmentGraphPendingSelectionFixture =
  Object.freeze({
    attachment: {
      creationId: "profile-2",
      title: "Field Engineer",
      description:
        "Unsaved compatible profile selected from the picker.",
      presetId: "CUSTOM",
      ownerBindingMode: "UNBOUND_TEMPLATE",
      ownerType: "CHARACTER",
      enabledDomains: [
        "STATS_POOLS",
        "SKILLS",
        "ABILITY_SPELL",
      ],
      notes: "",
    },
    attachmentAuthority:
      "UNSAVED_PICKER_SELECTION",
    draftState: "PENDING_LINK",
    actorType: "CHARACTER",
    actorTitle: "Kessa Cindervell",
    selectionError: "",
    disabled: false,
  });

export const actorMechanicsProfileAttachmentGraphPendingPlaceholderFixture =
  Object.freeze({
    attachment: {
      creationId: "profile-pending",
      title: "Pending Actor Mechanics Profile",
      presetId: "CUSTOM",
      ownerBindingMode: "UNBOUND_TEMPLATE",
      ownerType: "CHARACTER",
      enabledDomains: [],
      notes: "Preserve these relationship notes.",
    },
    attachmentAuthority: "UNSAVED_DRAFT",
    draftState: "PENDING_LINK",
    actorType: "CHARACTER",
    actorTitle: "Mira Quill",
    selectionError: "",
    disabled: false,
  });

export const actorMechanicsProfileAttachmentGraphPendingRemovalFixture =
  Object.freeze({
    attachment: null,
    attachmentAuthority: "NONE",
    draftState: "PENDING_REMOVAL",
    actorType: "CHARACTER",
    actorTitle: "Mira Quill",
    selectionError: "",
    disabled: false,
  });

export const actorMechanicsProfileAttachmentGraphBeyondScaleFixture =
  Object.freeze({
    attachment: {
      creationId: "profile-beyond",
      title: "Beyond Scale Sovereign",
      description:
        "Narrative-only unrestricted capability with a deterministic working manifestation.",
      presetId: "BEYOND_SCALE",
      ownerBindingMode: "BOUND_ACTOR",
      ownerType: "CHARACTER",
      ownerId: "actor-sovereign",
      ownerTitle: "Sovereign",
      enabledDomains: ["ABILITIES"],
      notes:
        "Use Level 100 Equivalent only for the working manifestation.",
    },
    attachmentAuthority: "CREATION_GRAPH",
    draftState: "NONE",
    actorType: "CHARACTER",
    actorTitle: "Sovereign",
    selectionError: "",
    disabled: false,
  });

export const actorMechanicsProfileAttachmentGraphCompatibilityErrorFixture =
  Object.freeze({
    attachment: null,
    attachmentAuthority: "NONE",
    draftState: "NONE",
    actorType: "CHARACTER",
    actorTitle: "Kessa Cindervell",
    selectionError:
      "That profile targets a Player Character and cannot be attached to this Character.",
    disabled: false,
  });

export const actorMechanicsProfileAttachmentGraphDisabledFixture =
  Object.freeze({
    attachment:
      actorMechanicsProfileAttachmentGraphSavedFixture.attachment,
    attachmentAuthority: "CREATION_GRAPH",
    draftState: "NONE",
    actorType: "PLAYER_CHARACTER",
    actorTitle: "Rowan",
    selectionError: "",
    disabled: true,
  });
