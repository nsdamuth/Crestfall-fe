const BASE = Object.freeze({
  eyebrow: "Actor Mechanics",
  title: "Actor Mechanics Profile",
  body:
    "Attach one reusable Actor Mechanics Profile to this actor. The profile defines which mechanics domains belong to the actor while mutable state remains isolated to this actor.",
  addLabel: "Attach Actor Mechanics Profile",
  emptyLabel: "No Actor Mechanics Profile attached.",
  runtimeNote:
    "This step saves the actor-to-profile relationship only. Runtime hydration and activation are introduced separately.",
  attachment: null,
  errorMessage: "",
  warningMessage: "",
  disabled: false,
  onOpenPicker: () => {},
  onRemoveAttachment: () => {},
  onChangeAttachmentNotes: () => {},
});

export const actorMechanicsProfileAttachmentFixtures = Object.freeze({
  emptyCharacter: {
    ...BASE,
    body:
      "Attach one reusable Actor Mechanics Profile to this Character. The profile may be an unbound Character template or a profile already bound to this Character.",
  },
  attachedPlayerCharacter: {
    ...BASE,
    attachment: {
      id: "actor_profile_link_1",
      title: "Full Adventurer Profile",
      typeLabel: "Actor Mechanics Profile",
      description:
        "A complete Player Character mechanics package with owner-scoped state.",
      imageUrl: "",
      presetLabel: "Full Player Character",
      ownerLabel: "Player Character template",
      enabledDomainLabels: [
        "Stats",
        "Progression",
        "Skills",
        "Magic",
        "Abilities",
        "Wallet",
        "Inventory",
      ],
      notes: "Use the campaign's standard progression curve.",
      removeAriaLabel: "Remove Full Adventurer Profile",
    },
  },
  attachedBeyondScale: {
    ...BASE,
    attachment: {
      id: "actor_profile_link_2",
      title: "Beyond Scale Sovereign",
      typeLabel: "Actor Mechanics Profile",
      description:
        "Narrative-only unrestricted capability with a deterministic working manifestation.",
      imageUrl: "",
      presetLabel: "Beyond Scale",
      ownerLabel: "Bound Character",
      enabledDomainLabels: ["Abilities"],
      notes: "Use Level 100 Equivalent only for the working manifestation.",
      removeAriaLabel: "Remove Beyond Scale Sovereign",
    },
    warningMessage:
      "Beyond Scale profiles only permit ordinary opposed resolution through an explicit working mode.",
  },
  incompatibleSelection: {
    ...BASE,
    errorMessage:
      "That profile targets a Player Character and cannot be attached to this Character.",
  },
  disabled: {
    ...BASE,
    disabled: true,
    warningMessage:
      "This actor is locked and its mechanics attachment cannot be changed.",
  },
});

export default actorMechanicsProfileAttachmentFixtures;
