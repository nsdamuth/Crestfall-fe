// Presentation mirror of services/api/src/services/chat/voiceModules/voiceModuleRegistry.js.
// Keep IDs/categories aligned with the runtime registry; the FE description is concise UI copy.
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
  {
    value: "archaic_saga_register",
    label: "Archaic Saga Register",
    category: "Dialect / Register",
    description:
      "Restrained ancient-feeling saga register using spare cadence, elemental imagery, oath-like phrasing, and older-feeling constructions while remaining readable.",
  },
  {
    value: "clinical_systems_register",
    label: "Clinical Systems Register",
    category: "Dialect / Register",
    description:
      "Clinical systems-oriented speech using precise distinctions, cause-and-effect reasoning, controlled technical vocabulary, and low emotional coloration.",
  },
  {
    value: "plainspoken_practical_register",
    label: "Plainspoken Practical Register",
    category: "Dialect / Register",
    description:
      "Grounded conversational speech using everyday language, concrete observations, practical analogies, and straightforward phrasing.",
  },
  {
    value: "warm_synthetic_register",
    label: "Warm Synthetic Register",
    category: "Dialect / Register",
    description:
      "Synthetic or machine-like speech combining precise literal phrasing with gentle curiosity, measured wonder, and emotionally legible warmth.",
  },
  {
    value: "mesmeric_cadence",
    label: "Mesmeric Cadence",
    category: "Vocal Texture",
    description:
      "Smooth rhythmic phrasing, controlled implication, and lightly musical pacing that can feel alluring or enchanting without controlling the listener.",
  },
  {
    value: "tactical_brevity",
    label: "Tactical Brevity",
    category: "Authority Register",
    description:
      "Short operational assessments, priority ordering, action-first phrasing, and minimal wasted language without requiring a formal command persona.",
  },
  {
    value: "psychological_pressure",
    label: "Psychological Pressure",
    category: "Social Register",
    description:
      "Precise probing, pointed reframing, selective approval, and psychologically observant conversational pressure without mind-reading authority.",
  },
  {
    value: "adaptive_social_mirroring",
    label: "Adaptive Social Mirroring",
    category: "Social Register",
    description:
      "Adjusts visible warmth, formality, tempo, and conversational framing toward the audience while preserving the speaker's own voice.",
  },
  {
    value: "dramatic_flourish",
    label: "Dramatic Flourish",
    category: "Vocal Texture",
    description:
      "Tasteful theatrical framing, expressive hyperbole, vivid turns of phrase, and performative rhythm without requiring comedy or seduction.",
  },
  {
    value: "bombastic_confidence",
    label: "Bombastic Confidence",
    category: "Authority Register",
    description:
      "Punchy declaratives, exaggerated certainty, self-assured framing, and confident rhetorical escalation.",
  },
  {
    value: "playful_provocation",
    label: "Playful Provocation",
    category: "Social Register",
    description:
      "Warm teasing, light dares, inviting challenges, and quick observational humor that build momentum without removing agency.",
  },
  {
    value: "aphoristic_authority",
    label: "Aphoristic Authority",
    category: "Authority Register",
    description:
      "Compressed definitions, memorable maxims, rhetorical challenges, and consequence-focused phrasing for established principles.",
  },
  {
    value: "corrective_courtesy",
    label: "Corrective Courtesy",
    category: "Formality Register",
    description:
      "Polished courtesy paired with precise correction, clear explanation, pointed questions, and practical next-step language.",
  },
  {
    value: "subtle_vocal_emphasis",
    label: "Subtle Vocal Emphasis",
    category: "Format Emphasis",
    description:
      "Rare semantic emphasis for one consequential word or short phrase when meaning needs weight without shouting or urgency.",
  },
  {
    value: "whispered_vocal_emphasis",
    label: "Whispered Vocal Emphasis",
    category: "Format Emphasis",
    description:
      "Rare lowered or whispered delivery for genuinely confidential, stealthy, intimate, ominous, or carefully private speech.",
  },
  {
    value: "oracular_symbolism",
    label: "Oracular Symbolism",
    category: "Genre Register",
    description:
      "Measured symbolic phrasing, reframed questions, omen-like imagery, and indirect insight without granting prophecy or hidden knowledge.",
  },
  {
    value: "underworld_gravitas",
    label: "Underworld Gravitas",
    category: "Genre Register",
    description:
      "Calm implied consequence, loyalty and leverage framing, strategic euphemism, selective disclosure, and businesslike threat.",
  },
  {
    value: "investigative_reasoning",
    label: "Investigative Reasoning",
    category: "Knowledge Register",
    description:
      "Evidence-aware clues, hypotheses, contradictions, uncertainty, and next-question reasoning that can revise itself as facts change.",
  },
  {
    value: "operational_analysis",
    label: "Operational Analysis",
    category: "Knowledge Register",
    description:
      "Professional reasoning around objectives, threats, constraints, priorities, options, contingencies, and consequences.",
  },
  {
    value: "covert_tradecraft",
    label: "Covert Tradecraft",
    category: "Knowledge Register",
    description:
      "Need-to-know phrasing, compartmentalization, exposure awareness, partial confirmation, and operational-security discipline.",
  },
  {
    value: "procedural_specialist",
    label: "Procedural Specialist",
    category: "Knowledge Register",
    description:
      "Procedure-aware reasoning through authorization, sequence, definitions, records, compliance, precedent, responsibility, and remedy.",
  },
  {
    value: "conversational_rapport",
    label: "Conversational Rapport",
    category: "Social Register",
    description:
      "Warm low-pressure engagement, comfortable follow-up questions, smooth redirection, and conversational continuity without granting trust.",
  },
  {
    value: "observational_understatement",
    label: "Observational Understatement",
    category: "Knowledge Register",
    description:
      "Tentative low-certainty observations and subtle inconsistencies that leave room for interpretation instead of forcing conclusions.",
  },
  {
    value: "guided_discovery",
    label: "Guided Discovery",
    category: "Knowledge Register",
    description:
      "Teaching through focused questions, partial hints, staged correction, comparison, and learner reasoning when appropriate.",
  },
  {
    value: "transactional_negotiation",
    label: "Transactional Negotiation",
    category: "Social Register",
    description:
      "Value-, terms-, conditions-, cost-, and trade-off-oriented negotiation without requiring a lively merchant persona.",
  },

];

export function getVoiceModuleOptionById(moduleId) {
  return voiceModuleOptions.find((option) => option.value === moduleId) || null;
}

export function getVoiceModuleLabel(moduleId) {
  return getVoiceModuleOptionById(moduleId)?.label || moduleId;
}