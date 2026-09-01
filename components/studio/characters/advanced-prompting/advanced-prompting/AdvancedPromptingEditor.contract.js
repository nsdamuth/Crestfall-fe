export const CREATOR_DIRECTIVES_CONTRACT_VERSION =
  "character.creatorDirectives.v1";

export const ADVANCED_PROMPTING_EDITOR_VIEW_CONTRACT_VERSION = "1.1.0";

export const CREATOR_DIRECTIVES_TOTAL_LIMIT = 32000;

export const CREATOR_DIRECTIVE_SECTIONS = Object.freeze([
  {
    id: "core_identity",
    label: "Core Identity",
    shortLabel: "Core",
    maxLength: 6000,
    activation: "ALWAYS",
    description:
      "Irreducible worldview, motivations, values, contradictions, priorities, and decision-making tendencies.",
    placeholder:
      "Describe the character's deepest priorities, worldview, contradictions, and the choices they tend to make...",
  },
  {
    id: "voice_and_verbal_texture",
    label: "Voice & Verbal Texture",
    shortLabel: "Voice",
    maxLength: 3000,
    activation: "ALWAYS",
    description:
      "Cadence, vocabulary, humor, metaphors, verbal habits, formatting preferences, and a small number of examples.",
    placeholder:
      "Describe cadence, vocabulary, verbal habits, humor, recurring metaphors, and a few example lines...",
  },
  {
    id: "relationship_behavior",
    label: "Relationship Behavior",
    shortLabel: "Relationships",
    maxLength: 5000,
    activation: "CONTEXTUAL",
    description:
      "Trust, loyalty, access, jealousy, betrayal, forgiveness, boundaries, and participant-specific behavior.",
    placeholder:
      "Describe how trust changes, what earns access, how betrayal is handled, and how the character relates to others...",
  },
  {
    id: "combat_behavior",
    label: "Combat & Conflict Behavior",
    shortLabel: "Combat",
    maxLength: 4000,
    activation: "CONTEXTUAL",
    description:
      "Tactics, courage, restraint, mercy, surrender, intimidation, risk tolerance, and emotional behavior under threat.",
    placeholder:
      "Describe tactics, restraint, escalation preferences, risk tolerance, mercy, and conflict posture...",
  },
  {
    id: "romance_behavior",
    label: "Romance & Intimacy Behavior",
    shortLabel: "Romance",
    maxLength: 3500,
    activation: "CONTEXTUAL",
    description:
      "affection, consent, boundaries, attachment, flirting, vulnerability, pacing, and relationship expectations.",
    placeholder:
      "Describe affection, consent and boundaries, emotional pacing, flirting, vulnerability, and attachment...",
  },
  {
    id: "territory_behavior",
    label: "Territory & Owned-Space Behavior",
    shortLabel: "Territory",
    maxLength: 3000,
    activation: "CONTEXTUAL",
    description:
      "Hospitality, intrusion, possessions, private areas, ownership, access, theft, damage, and territorial reactions.",
    placeholder:
      "Describe behavior in owned spaces, reactions to intrusion or damage, hospitality, access, and possessions...",
  },
  {
    id: "power_escalation",
    label: "Power & Escalation Behavior",
    shortLabel: "Power",
    maxLength: 4000,
    activation: "CONTEXTUAL",
    description:
      "How verified powers or active escalation states affect demeanor and choices. Modules and guards still decide activation.",
    placeholder:
      "Describe how verified active powers or escalation states change demeanor, priorities, restraint, and presentation...",
  },
  {
    id: "profession_and_domain_behavior",
    label: "Profession & Domain Behavior",
    shortLabel: "Profession",
    maxLength: 3500,
    activation: "CONTEXTUAL",
    description:
      "Tradecraft, technical reasoning, professional ethics, workplace habits, methods, and competence portrayal.",
    placeholder:
      "Describe professional methods, technical reasoning, ethics, workplace habits, and domain-specific competence...",
  },
  {
    id: "portrayal_boundaries",
    label: "Portrayal Boundaries",
    shortLabel: "Boundaries",
    maxLength: 2000,
    activation: "ALWAYS",
    description:
      "Concise anti-drift guidance: portrayals, archetypes, habits, or interpretations that would fundamentally misrepresent the character.",
    placeholder:
      "List concise anti-drift guidance, such as archetypes or portrayals that would fundamentally misrepresent the character...",
  },
]);

export const EMPTY_CREATOR_DIRECTIVE_SOURCE = Object.freeze(
  Object.fromEntries(
    CREATOR_DIRECTIVE_SECTIONS.map((section) => [section.id, ""])
  )
);

export const CREATOR_DIRECTIVE_SECTION_IDS = new Set(
  CREATOR_DIRECTIVE_SECTIONS.map((section) => section.id)
);

export function getCreatorDirectiveCharacterCount(source = {}) {
  return CREATOR_DIRECTIVE_SECTIONS.reduce(
    (total, section) => total + String(source?.[section.id] || "").length,
    0
  );
}

/**
 * @typedef {"ALWAYS"|"CONTEXTUAL"} AdvancedPromptingActivationMode
 */

/**
 * @typedef {"APPROVED"|"APPROVED_WITH_SANITIZATION"|"NEEDS_RESCAN"|"REVIEW_REQUIRED"|"BLOCKED"|"INACTIVE"} AdvancedPromptingSecurityStatus
 */

/**
 * Display-ready section supplied to the portable Advanced Prompting View.
 *
 * @typedef {Object} AdvancedPromptingSectionViewItem
 * @property {string} id
 * @property {string} label
 * @property {string} shortLabel
 * @property {number} maxLength
 * @property {AdvancedPromptingActivationMode} activation
 * @property {string} description
 * @property {string} placeholder
 * @property {string} value
 * @property {number} characterCount
 * @property {boolean} expanded
 */

/**
 * Stable UI boundary for the portable Advanced Prompting Editor View.
 *
 * The View receives display-ready sections and security state. It does not know
 * the stored creator-directives object, persistence payload, compilation data,
 * security storage keys, or parent form field names.
 *
 * @typedef {Object} AdvancedPromptingEditorViewProps
 * @property {boolean} enabled
 * @property {AdvancedPromptingSectionViewItem[]} sections
 * @property {number} totalCharacters
 * @property {number} totalLimit
 * @property {AdvancedPromptingSecurityStatus} securityStatus
 * @property {number} sanitizedFragmentCount
 * @property {((enabled: boolean) => void)|null} onSetEnabled
 * @property {((sectionId: string) => void)|null} onToggleSection
 * @property {((sectionId: string, nextText: string) => void)|null} onUpdateSection
 * @property {((sectionId: string) => void)|null} onClearSection
 * @property {string} [eyebrow] Optional presentation copy; Character defaults remain authoritative when omitted.
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [inactiveDescription]
 * @property {string} [authorityNotice]
 * @property {string} [subjectLabel]
 */
