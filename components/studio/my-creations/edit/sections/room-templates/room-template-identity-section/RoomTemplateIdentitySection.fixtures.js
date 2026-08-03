const roomModeOptions = [
  { value: "SOLO", label: "Solo / One-on-one" },
  { value: "GROUP", label: "Group Chat" },
  { value: "FLEXIBLE", label: "Flexible" },
];

const playerCharacterModeOptions = [
  { value: "DISABLED", label: "Do not use Player Character" },
  { value: "OPTIONAL", label: "Optional Player Character" },
  { value: "RECOMMENDED", label: "Recommended Player Character" },
];

const baseFixture = {
  sectionEyebrow: "Story Editor",
  sectionTitle: "Story Identity",
  sectionDescription:
    "Define how this Story behaves as a reusable playable setup.",
  roomModeLabel: "Story Mode",
  roomModeValue: "GROUP",
  roomModeOptions,
  playerCharacterModeLabel: "Player Character",
  playerCharacterModeValue: "OPTIONAL",
  playerCharacterModeOptions,
  tagsLabel: "Tags",
  tagsValue: "dark fantasy, investigation, ensemble",
  onSelectRoomMode: null,
  onSelectPlayerCharacterMode: null,
  onChangeTags: null,
};

export const roomTemplateIdentitySectionDefaultFixture = {
  ...baseFixture,
};

export const roomTemplateIdentitySectionSoloFixture = {
  ...baseFixture,
  roomModeValue: "SOLO",
  playerCharacterModeValue: "RECOMMENDED",
  tagsValue: "solo, character-driven, intimate",
};

export const roomTemplateIdentitySectionFlexibleFixture = {
  ...baseFixture,
  roomModeValue: "FLEXIBLE",
  playerCharacterModeValue: "DISABLED",
  tagsValue: "flexible, narrator-led, drop-in",
};

export const roomTemplateIdentitySectionDefaultFallbackFixture = {
  ...baseFixture,
  roomModeValue: "GROUP",
  playerCharacterModeValue: "OPTIONAL",
  tagsValue: "",
};

export const roomTemplateIdentitySectionNoOptionsFixture = {
  ...baseFixture,
  roomModeOptions: [],
  playerCharacterModeOptions: [],
};

export const roomTemplateIdentitySectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Story Identity for a Flexible Multi-Participant Chronicle with Optional Player Characters",
  sectionDescription:
    "Define how this reusable Story setup should behave across solo sessions, invited group rooms, narrator-led play, optional Player Character participation, and long-running ensemble storytelling workflows.",
  tagsValue:
    "multi-participant, flexible format, optional player character, narrator-led, long-running chronicle, collaborative storytelling, dramatic fantasy",
};

export const roomTemplateIdentitySectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Story Package",
  sectionTitle: "Session Identity",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  roomModeLabel: "Session Format",
  playerCharacterModeLabel: "Player Avatar",
  tagsLabel: "Discovery Tags",
};

export const roomTemplateIdentitySectionMissingCallbacksFixture = {
  ...baseFixture,
  onSelectRoomMode: null,
  onSelectPlayerCharacterMode: null,
  onChangeTags: null,
};
