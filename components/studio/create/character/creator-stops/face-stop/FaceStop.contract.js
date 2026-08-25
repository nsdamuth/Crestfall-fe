export const FACE_STOP_VIEW_CONTRACT_VERSION = "face-stop.view.v1";

/* Swatch colors and chip labels are read verbatim from the draft
   (design-system/proof/modal.js, the D data object). */
export const SKIN_OPTIONS = Object.freeze([
  { value: "PORCELAIN", label: "Porcelain", color: "#f1e3d3" },
  { value: "FAIR", label: "Fair", color: "#ecd2b8" },
  { value: "LIGHT", label: "Light", color: "#e0b896" },
  { value: "WARM_TAN", label: "Warm Tan", color: "#c98f5f" },
  { value: "BROWN", label: "Brown", color: "#9c6b3f" },
  { value: "DEEP_BROWN", label: "Deep Brown", color: "#6b4426" },
  { value: "LAVENDER", label: "Lavender", color: "#b9a3d6" },
  { value: "BLUE", label: "Blue", color: "#7f9cc4" },
  { value: "GREEN", label: "Green", color: "#8fae8b" },
  { value: "GRAY", label: "Gray", color: "#9a9a9a" },
  { value: "PITCH_BLACK", label: "Pitch Black", color: "#151515" },
  { value: "CUSTOM", label: "Custom", color: "" },
]);

export const EYE_OPTIONS = Object.freeze([
  { value: "BROWN", label: "Brown", color: "#5d3a1e" },
  { value: "BLUE", label: "Blue", color: "#4a7fc1" },
  { value: "GREEN", label: "Green", color: "#4f8f5c" },
  { value: "GOLD", label: "Gold", color: "#e0ab5e" },
  { value: "AMBER", label: "Amber", color: "#d08a2e" },
  { value: "GRAY", label: "Gray", color: "#8f959c" },
  { value: "SILVER", label: "Silver", color: "#c9ccd2" },
  { value: "RED", label: "Red", color: "#b23a2e" },
  { value: "VIOLET", label: "Violet", color: "#8a5fc1" },
  { value: "GLOWING", label: "Glowing", color: "#7de3ff" },
  {
    value: "HETEROCHROMIA",
    label: "Heterochromia",
    color: "linear-gradient(90deg,#4a7fc1 50%,#d08a2e 50%)",
  },
  { value: "CUSTOM", label: "Custom", color: "" },
]);

export const HAIR_COLOR_OPTIONS = Object.freeze([
  { value: "BLACK", label: "Black", color: "#141210" },
  { value: "BROWN", label: "Brown", color: "#5d3a1e" },
  { value: "AUBURN", label: "Auburn", color: "#8a3b1c" },
  { value: "GOLDEN", label: "Golden", color: "#c99733" },
  { value: "COPPER", label: "Copper", color: "#b0552a" },
  { value: "SILVER", label: "Silver", color: "#c7ccd4" },
  { value: "WHITE", label: "White", color: "#efeff2" },
  { value: "VIOLET", label: "Violet", color: "#6a3fae" },
  { value: "CUSTOM", label: "Custom", color: "" },
]);

/* The draft's own "More hair" fold shows only five Length and five
   Style labels each. The live app carries more of each (constants in
   hair/useHairModalViewModel.js) plus a Texture section the draft does
   not render at all. Full counts are used here per the gate's field
   allocation, flagged: this is a placement decision, not a draft fact. */
export const HAIR_LENGTH_OPTIONS = Object.freeze([
  "Bald / Shaved",
  "Very Short",
  "Short",
  "Shoulder Length",
  "Medium Length",
  "Long",
  "Very Long",
  "Floor Length",
  "Custom",
]);

export const HAIR_TEXTURE_OPTIONS = Object.freeze([
  "Straight",
  "Wavy",
  "Curly",
  "Coily",
  "Messy",
  "Wild",
  "Floating",
  "Voluminous",
  "Spiky",
  "Custom",
]);

export const HAIR_STYLE_OPTIONS = Object.freeze([
  "Loose",
  "Bangs",
  "Side Bangs",
  "Ponytail",
  "Twin Tails",
  "Braided",
  "Bun",
  "Bob",
  "Pixie",
  "Hime Cut",
  "Undercut",
  "Custom",
]);

/* Not present anywhere in the draft's seven stops. Assigned to this stop
   by construction: it is Appearance-scoped in the live app, and at 15
   nominal text values with no visual comparison, is the one field here
   that genuinely fits the inline-dropdown rule (long or nominal value).
   Descriptions are read verbatim from
   components/studio/create/character/constants/constants.js and carried
   as the tooltip copy for each option row. */
export const ETHNIC_APPEARANCE_OPTIONS = Object.freeze([
  {
    value: "",
    label: "Unspecified",
    description:
      "Do not add an ethnic appearance cue. You can describe it manually elsewhere if needed.",
  },
  {
    value: "WHITE_EUROPEAN",
    label: "White / European",
    description: "Use a white or broadly European visual appearance.",
  },
  {
    value: "BLACK_AFRICAN",
    label: "Black / African",
    description: "Use a Black or broadly African visual appearance.",
  },
  {
    value: "CHINESE",
    label: "Chinese",
    description: "Use a Chinese visual appearance.",
  },
  {
    value: "JAPANESE",
    label: "Japanese",
    description: "Use a Japanese visual appearance.",
  },
  {
    value: "KOREAN",
    label: "Korean",
    description: "Use a Korean visual appearance.",
  },
  {
    value: "SOUTH_ASIAN",
    label: "South Asian",
    description:
      "Use a broadly South Asian visual appearance, such as Indian, Pakistani, Bangladeshi, Nepali, or Sri Lankan.",
  },
]);

export const CUSTOM_VALUE_MAX_LENGTH = 240;
