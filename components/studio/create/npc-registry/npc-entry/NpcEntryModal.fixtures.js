const modeOptions = [
  { id: "lightweightNpc", label: "Lightweight NPC" },
  { id: "linkedCharacter", label: "Link Existing Character" },
];

const characterCards = [
  {
    id: "character-alyera",
    title: "Alyera Valecourt",
    subtitle: "Northern envoy and keeper of the First Oath.",
    description: "Northern envoy and keeper of the First Oath.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "/assets/characters/aethelgard/warmech/profile.png",
  },
  {
    id: "character-kaela",
    title: "Kaela Veynskald",
    subtitle: "A disciplined warrior bound to an old promise.",
    description: "A disciplined warrior bound to an old promise.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "/assets/covers/crestfall-cloak-cover.png",
  },
  {
    id: "player-character-riven",
    title: "Riven Ashfall",
    subtitle: "A player-controlled traveler with ties to the archive.",
    description: "A player-controlled traveler with ties to the archive.",
    type: "PLAYER_CHARACTER",
    contentRating: "SFW",
    imageUrl: "",
  },
];

const baseFixture = {
  modalTitle: "Person Entry",
  modeOptions,
  characterCards,
  characterSearchPlaceholder: "Search characters and player characters...",
  characterEmptyMessage: "No character assets found yet.",
  linkedCharacterMechanicsNote:
    "Linked Character entries use the Actor Mechanics Profile attached to the Character creation.",
  actorMechanicsProfileAttachmentContent: null,
  nameLabel: "Name",
  notesLabel: "Registry Notes",
  notesRows: 5,
  notesPlaceholder:
    "Continuity notes, role, behavior, restrictions, or why this person matters.",
  saveLabel: "Save Person Entry",
};

export const npcEntryLightweightFixture = {
  ...baseFixture,
  selectedModeId: "lightweightNpc",
  selectedCharacterIds: [],
  disabledCharacterIds: ["character-kaela"],
  nameValue: "Mara the Night Clerk",
  notesValue:
    "Usually works the eastern desk after midnight and knows which guests arrived without signing the registry.",
};

export const npcEntryLinkedFixture = {
  ...baseFixture,
  selectedModeId: "linkedCharacter",
  selectedCharacterIds: ["character-alyera"],
  disabledCharacterIds: ["character-kaela"],
  nameValue: "Alyera Valecourt",
  notesValue:
    "Use Alyera's existing character creation as the source of truth. In this registry she serves as the council liaison.",
};

export const npcEntryEmptyFixture = {
  ...baseFixture,
  selectedModeId: "lightweightNpc",
  selectedCharacterIds: [],
  disabledCharacterIds: [],
  nameValue: "",
  notesValue: "",
};

export const npcEntryNoCharactersFixture = {
  ...baseFixture,
  selectedModeId: "linkedCharacter",
  characterCards: [],
  selectedCharacterIds: [],
  disabledCharacterIds: [],
  nameValue: "",
  notesValue: "",
};

export const npcEntryDisabledCharactersFixture = {
  ...baseFixture,
  selectedModeId: "linkedCharacter",
  selectedCharacterIds: [],
  disabledCharacterIds: ["character-alyera", "character-kaela"],
  nameValue: "",
  notesValue:
    "Characters already used by another person entry remain visible but cannot be selected again.",
};

export const npcEntryLongContentFixture = {
  ...baseFixture,
  selectedModeId: "lightweightNpc",
  modeOptions: [
    {
      id: "lightweightNpc",
      label: "Create a Lightweight Registry-Only NPC",
    },
    {
      id: "linkedCharacter",
      label: "Link an Existing Character or Player Character Creation",
    },
  ],
  selectedCharacterIds: [],
  disabledCharacterIds: [],
  nameValue:
    "Archivist Mara Elian Voss, Third Keeper of the Western Annex and Unofficial Night Steward",
  notesValue:
    "Mara maintains the overnight accession ledger, recognizes most recurring visitors by voice, and quietly tracks inconsistencies between official appointment records and who actually enters the western archive. She should remain helpful but cautious, never volunteering protected information without a credible reason.",
};

export const npcEntryLightweightMechanicsFixture = {
  ...npcEntryLightweightFixture,
  actorMechanicsProfileAttachmentContent:
    "Actor Mechanics Profile attachment application slot",
};
