export const PLAYER_CHARACTER_CREATOR_VIEW_CONTRACT_VERSION = "1.0.0";

export const PLAYER_CHARACTER_STEPS = Object.freeze([
  { id: "identity", label: "Identity", iconKey: "identity" },
  { id: "appearance", label: "Appearance", iconKey: "appearance" },
  { id: "body", label: "Body", iconKey: "body" },
  { id: "profile", label: "Profile", iconKey: "profile" },
  { id: "review", label: "Review", iconKey: "review" },
]);

export const PLAYER_CHARACTER_ROLE_ARCHETYPE_OPTIONS = Object.freeze([
  { value: "", label: "None", pinned: true },
  { value: "CUSTOM", label: "Custom", pinned: true },
  { value: "ADVENTURER", label: "Adventurer", group: "Fantasy" },
  { value: "ARTIFICER", label: "Artificer", group: "Fantasy" },
  { value: "BARBARIAN", label: "Barbarian", group: "Fantasy" },
  { value: "BARD", label: "Bard", group: "Fantasy" },
  { value: "CLERIC", label: "Cleric", group: "Fantasy" },
  { value: "MAGE", label: "Mage", group: "Fantasy" },
  { value: "PALADIN", label: "Paladin", group: "Fantasy" },
  { value: "RANGER", label: "Ranger", group: "Fantasy" },
  { value: "ROGUE", label: "Rogue", group: "Fantasy" },
  { value: "SCHOLAR", label: "Scholar", group: "Fantasy" },
  { value: "ARTIST", label: "Artist", group: "Modern" },
  { value: "DETECTIVE", label: "Detective", group: "Modern" },
  { value: "DOCTOR", label: "Doctor", group: "Modern" },
  { value: "EXECUTIVE", label: "Executive", group: "Modern" },
  { value: "JOURNALIST", label: "Journalist", group: "Modern" },
  { value: "PERFORMER", label: "Performer", group: "Modern" },
  { value: "PROFESSOR", label: "Professor", group: "Modern" },
  { value: "SECURITY", label: "Security", group: "Modern" },
  { value: "ANDROID", label: "Android", group: "Sci-Fi" },
  { value: "CYBORG", label: "Cyborg", group: "Sci-Fi" },
  { value: "HACKER", label: "Hacker", group: "Sci-Fi" },
  { value: "PILOT", label: "Pilot", group: "Sci-Fi" },
  { value: "SMUGGLER", label: "Smuggler", group: "Sci-Fi" },
  { value: "TECHNOMANCER", label: "Technomancer", group: "Sci-Fi" },
]);

export const PLAYER_CHARACTER_BODY_TYPE_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen", description: "Leave body type undefined." },
  { value: "SLIM", label: "Slim", description: "Narrow, light, slender silhouette." },
  { value: "ATHLETIC", label: "Athletic", description: "Fit, active, capable build." },
  { value: "CURVY", label: "Curvy", description: "Soft, rounded, pronounced curves." },
  { value: "MUSCULAR", label: "Muscular", description: "Strong, visibly powerful physique." },
  { value: "HEAVYSET", label: "Heavyset", description: "Larger, heavier physical presence." },
  { value: "LITHE", label: "Lithe", description: "Flexible, agile, graceful body line." },
  { value: "LEAN", label: "Lean", description: "Trim, wiry, low-bulk physique." },
  { value: "STOCKY", label: "Stocky", description: "Compact, sturdy, solid frame." },
  { value: "CUSTOM", label: "Custom", description: "Write your own body type." },
]);

export const PLAYER_CHARACTER_HEIGHT_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen", description: "Leave height undefined." },
  { value: "SHORT", label: "Short", description: "Below average adult height." },
  { value: "AVERAGE", label: "Average", description: "Typical adult height." },
  { value: "ABOVE_AVERAGE", label: "Above Average", description: "Somewhat taller than average." },
  { value: "TALL", label: "Tall", description: "Clearly tall adult silhouette." },
  { value: "VERY_TALL", label: "Very Tall", description: "Strikingly tall adult silhouette." },
]);

export const PLAYER_CHARACTER_BUILD_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen", description: "Leave build undefined." },
  { value: "DELICATE", label: "Delicate", description: "Fine-boned, light, fragile-looking." },
  { value: "BALANCED", label: "Balanced", description: "Proportional and neutral." },
  { value: "BROAD", label: "Broad", description: "Wide shoulders or broad frame." },
  { value: "POWERFUL", label: "Powerful", description: "Strong, imposing, forceful build." },
  { value: "GRACEFUL", label: "Graceful", description: "Elegant, poised, flowing physicality." },
  { value: "COMPACT", label: "Compact", description: "Shorter, dense, efficient frame." },
  { value: "CUSTOM", label: "Custom", description: "Write your own build." },
]);

export const PLAYER_CHARACTER_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
]);

export const PLAYER_CHARACTER_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

export const PLAYER_CHARACTER_RENDERING_STYLE_OPTIONS = Object.freeze([
  { value: "EITHER", label: "Either / Auto" },
  { value: "ANIME", label: "Anime" },
  { value: "REALISTIC", label: "Realistic" },
]);

/**
 * Portable View contract.
 *
 * The View receives normalized step/form state, semantic callbacks, and
 * application-owned character field slots. It must not build persistence
 * payloads, call APIs, navigate, or import another Crestfall Binding Shell.
 */
export const PLAYER_CHARACTER_CREATOR_VIEW_CONTRACT = Object.freeze({
  activeStep: "identity | appearance | body | profile | review",
  activeIndex: "number",
  stepItems: "array of normalized step presentation items",
  form: "normalized player-character form",
  progress: "number",
  saveStatus: "idle | saving | saved | error",
  saveMessage: "string",
  saveDisabled: "boolean",
  options: {
    roleArchetypeOptions: "array",
    visibilityOptions: "array",
    contentRatingOptions: "array",
    renderingStyleOptions: "array",
  },
  slots: {
    characterColorPaletteContent: "ReactNode | null",
    skinToneContent: "ReactNode | null",
    eyeColorContent: "ReactNode | null",
    hairColorContent: "ReactNode | null",
    hairStyleContent: "ReactNode | null",
    defaultClothingContent: "ReactNode | null",
    bodyTypeContent: "ReactNode | null",
    heightContent: "ReactNode | null",
    buildContent: "ReactNode | null",
  },
  onSelectStep: "function(stepId)",
  onUpdateField: "function(field, value)",
  onNormalizeAdultAge: "function()",
  onBack: "function()",
  onNext: "function()",
  onSave: "function()",
});
