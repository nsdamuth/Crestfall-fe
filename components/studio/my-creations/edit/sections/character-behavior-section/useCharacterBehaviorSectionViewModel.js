import {
  eastAsianZodiacOptions,
  interestOptions,
  mbtiTypeOptions,
  movementStyleOptions,
  speechStyleOptions,
  westernZodiacOptions,
} from "@/components/studio/create/character/constants/constants";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Character Editor",
  sectionTitle: "Behavior",
  sectionDescription:
    "Edit how this character speaks, moves, thinks, and expresses themselves using the same guided controls from character creation.",
  outwardPersonalityLabel: "Outward Personality",
  internalPersonalityLabel: "Internal Personality",
  personalityFrameworksEyebrow: "Optional Personality Frameworks",
  personalityFrameworksDescription:
    "These provide soft narrative flavor when the composer needs more characterization. They are optional and never override explicit personality choices, behavior settings, or creator notes.",
  mbtiLabel: "MBTI Personality Type",
  mbtiDescription:
    "Choose an optional MBTI-style archetype for supplemental personality flavor only.",
  westernZodiacLabel: "Western Zodiac",
  westernZodiacDescription:
    "Choose an optional Western zodiac archetype for supplemental narrative flavor only.",
  eastAsianZodiacLabel: "East Asian Zodiac",
  eastAsianZodiacDescription:
    "Choose an optional East Asian zodiac animal for supplemental narrative flavor only.",
  speechStyleLabel: "Speech Style",
  speechStyleDescription: "How the character tends to speak in dialogue.",
  movementStyleLabel: "Movement Style",
  movementStyleDescription:
    "How the character physically carries themselves in scenes.",
  voiceModulesDescription:
    "Attach one or more reusable tone, emphasis, accent, or dialogue modules. These modify expression without replacing the character’s core voice.",
  verbosityLabel: "Verbosity",
  verbosityDescription:
    "Controls how talkative the character should be during scenes.",
  interestsLabel: "Interests",
  interestsDescription:
    "Core subjects, goals, or fascinations the character naturally gravitates toward.",
  philosophyLabel: "Philosophy",
  philosophyPlaceholder:
    "What does this character believe about the world, people, power, duty, freedom, love, fear, or survival?",
});

export const CHARACTER_VERBOSITY_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "1", label: "1 · Terse" },
  { value: "2", label: "2 · Concise" },
  { value: "3", label: "3 · Balanced" },
  { value: "4", label: "4 · Expressive" },
  { value: "5", label: "5 · Highly Verbose" },
]);

export function normalizeCharacterInterests(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export function normalizeVoiceModuleIds(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

export function getCharacterBehaviorSectionViewProps({
  form = {},
  updateDataField = null,
  creationType = "",
} = {}) {
  const data = form?.data || {};
  const normalizedCreationType = String(creationType || form?.type || "").toUpperCase();
  const isPlayerCharacter = normalizedCreationType === "PLAYER_CHARACTER";
  const behaviorData = {
    ...data,
    interests: normalizeCharacterInterests(data.interests),
  };

  return {
    ...DEFAULT_COPY,
    sectionDescription: isPlayerCharacter
      ? "Describe how your Player Character tends to speak, move, think, and express themselves. These preferences guide Crestfall presentation without taking control away from the player."
      : DEFAULT_COPY.sectionDescription,
    personalityFrameworksDescription: isPlayerCharacter
      ? "These provide optional narrative flavor when Crestfall needs supplemental characterization. They never override your choices, explicit personality settings, or creator notes."
      : DEFAULT_COPY.personalityFrameworksDescription,
    verbosityDescription: isPlayerCharacter
      ? "A presentation preference for generated dialogue or portrayal. It does not limit what you type or choose for your Player Character."
      : DEFAULT_COPY.verbosityDescription,
    behaviorData,
    outwardPersonalityField: "outward_personality",
    internalPersonalityField: "internal_personality",
    mbtiField: "mbti_type",
    westernZodiacField: "western_zodiac_sign",
    eastAsianZodiacField: "east_asian_zodiac_sign",
    speechStyleField: "speech_style",
    movementStyleField: "movement_style",
    interestsField: "interests",
    mbtiOptions: mbtiTypeOptions,
    westernZodiacOptions,
    eastAsianZodiacOptions,
    speechStyleOptions,
    movementStyleOptions,
    interestOptions,
    voiceModuleIds: normalizeVoiceModuleIds(data.voice_module_ids),
    verbosityValue: data.verbosity_level || "",
    verbosityOptions: CHARACTER_VERBOSITY_OPTIONS,
    philosophyValue: data.philosophy || "",
    onChangeCharacterField: (field, value) =>
      updateDataField?.(field, value),
    onChangeVoiceModuleIds: (nextVoiceModuleIds) =>
      updateDataField?.(
        "voice_module_ids",
        normalizeVoiceModuleIds(nextVoiceModuleIds)
      ),
    onSelectVerbosity: (value) =>
      updateDataField?.("verbosity_level", value),
    onChangePhilosophy: (value) => updateDataField?.("philosophy", value),
  };
}

export function useCharacterBehaviorSectionViewModel(props = {}) {
  return getCharacterBehaviorSectionViewProps(props);
}
