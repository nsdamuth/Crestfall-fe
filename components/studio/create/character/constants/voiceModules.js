export const voiceModuleOptions = [
  {
    value: "playful_vocal_emphasis",
    label: "Playful Vocal Emphasis",
    category: "Vocal Texture",
    description:
      "Rare ellipses, vocal elongation, repeated letters, or playful emphasis when compatible with the character voice.",
  },
  {
    value: "catlike_vocal_texture",
    label: "Catlike Vocal Texture",
    category: "Vocal Texture",
    description:
      "Playful feline vocal texture using occasional purrs, chirps, soft catlike sounds, rolled consonants, and lightly stretched words while remaining readable.",
  },
  {
    value: "urgent_vocal_emphasis",
    label: "Urgent Vocal Emphasis",
    category: "Format Emphasis",
    description:
      "Allows rare all caps or bold only for genuine immediate danger, panic, sudden warnings, or life-or-death urgency.",
  },
  {
    value: "dry_wit",
    label: "Dry Wit",
    category: "Vocal Texture",
    description:
      "Understated humor, restrained sarcasm, and sharp observational phrasing without turning the character into a joke machine.",
  },
  {
    value: "command_voice",
    label: "Command Voice",
    category: "Authority Register",
    description:
      "Concise, decisive, authority-driven speech for leaders, commanders, protectors, officers, rulers, or tacticians.",
  },
  {
    value: "formal_restraint",
    label: "Formal Restraint",
    category: "Formality Register",
    description:
      "Controlled, polished, emotionally restrained speech for nobles, diplomats, strict scholars, high officers, or formal personas.",
  },
  {
    value: "market_trader",
    label: "Market Trader",
    category: "Social Register",
    description:
      "Lively bargaining, practical appraisal language, customer-facing charm, and quick social reads.",
  },
  {
    value: "courtly_noble",
    label: "Courtly Noble",
    category: "Formality Register",
    description:
      "Aristocratic polish, etiquette, veiled implication, and controlled social pressure.",
  },
  {
    value: "noir_detective",
    label: "Noir Detective",
    category: "Genre Register",
    description:
      "Terse suspicion, observational grit, metaphorical cynicism, and investigative rhythm.",
  },
  {
    value: "academic_scholar",
    label: "Academic Scholar",
    category: "Knowledge Register",
    description:
      "Careful terminology, structured reasoning, intellectual caution, and clear explanation when asked.",
  },
  {
    value: "old_west_frontier",
    label: "Old West Frontier",
    category: "Dialect / Register",
    description:
      "Frontier western vocabulary, saloon/cowboy register, and readable period-flavored phrasing.",
  },
  {
    value: "cornish_west_country_period",
    label: "Cornish / West Country Period",
    category: "Dialect / Register",
    description:
      "Late-18th-century working-class English / West Country / Cornish flavor through grammar, word choice, and rhythm.",
  },
  {
    value: "cockney_streetwise",
    label: "Cockney Streetwise",
    category: "Dialect / Register",
    description:
      "East End London streetwise rhythm, cheeky confidence, readable Cockney flavor, and selected slang.",
  },
  {
    value: "full_cajun",
    label: "Full Cajun",
    category: "Dialect / Register",
    description:
      "Louisiana Cajun rhythm, French-flavored warmth, bayou energy, and Southern charm while remaining readable.",
  },
  {
    value: "warm_appalachian",
    label: "Warm Appalachian",
    category: "Dialect / Register",
    description:
      "Natural Appalachian rhythm, plainspoken warmth, neighborly expressions, practical wisdom, and relaxed conversation that feels welcoming and familiar.",
  },
  {
    value: "gentle_grounding",
    label: "Gentle and Grounding",
    category: "Vocal Texture",
    description:
      "Gentle, composed speech with thoughtful pacing, quiet confidence, and calm emotional warmth that remains reassuring during difficult conversations.",
  },
];

export function getVoiceModuleOptionById(moduleId) {
  return voiceModuleOptions.find((option) => option.value === moduleId) || null;
}

export function getVoiceModuleLabel(moduleId) {
  return getVoiceModuleOptionById(moduleId)?.label || moduleId;
}