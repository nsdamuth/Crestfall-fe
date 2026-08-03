export const CHARACTER_COLOR_PALETTE_VERSION =
  "seasonal_character_palettes_v1";

export const DEFAULT_CHARACTER_COLOR_PALETTE_ID = "CRESTFALL_DEFAULT";

export const CHARACTER_COLOR_PALETTES = Object.freeze([
  {
    id: DEFAULT_CHARACTER_COLOR_PALETTE_ID,
    label: "Crestfall Default",
    family: "Crestfall",
    description:
      "Warm parchment, antique gold, and restrained neutral accents designed for Crestfall's default dark interface.",
    colors: {
      dialogue: "#F5E7C7",
      narration: "#C89B5A",
      emphasis: "#E2B96F",
      strong: "#FFD99A",
      whisper: "#AFA08A",
      speaker: "#D6B36A",
      border: "#8A6A3C",
    },
  },
  {
    id: "BRIGHT_WINTER",
    label: "Bright Winter",
    family: "Winter",
    description:
      "Clear icy blues with electric magenta highlights and sharp, high-contrast energy.",
    colors: {
      dialogue: "#F3F8FF",
      narration: "#5FC6FF",
      emphasis: "#D77CFF",
      strong: "#FF5FA2",
      whisper: "#93A8C7",
      speaker: "#78D7FF",
      border: "#315E8A",
    },
  },
  {
    id: "COOL_WINTER",
    label: "Cool Winter",
    family: "Winter",
    description:
      "Cool sapphire, violet, and cyan tones with crisp, polished contrast.",
    colors: {
      dialogue: "#F0F5FF",
      narration: "#91A7FF",
      emphasis: "#C89CFF",
      strong: "#6EE7FF",
      whisper: "#8E99B5",
      speaker: "#A7B7FF",
      border: "#4A5680",
    },
  },
  {
    id: "DEEP_WINTER",
    label: "Deep Winter",
    family: "Winter",
    description:
      "Dark jewel tones with violet, teal, and berry accents for dramatic presence.",
    colors: {
      dialogue: "#F6F1FF",
      narration: "#A06CFF",
      emphasis: "#3DD7D0",
      strong: "#E65AA8",
      whisper: "#8B839B",
      speaker: "#C18CFF",
      border: "#55386F",
    },
  },
  {
    id: "BRIGHT_SPRING",
    label: "Bright Spring",
    family: "Spring",
    description:
      "Vivid coral, golden yellow, and fresh green accents with lively clarity.",
    colors: {
      dialogue: "#FFF7E6",
      narration: "#FF8A3D",
      emphasis: "#FFD23F",
      strong: "#FF4F7B",
      whisper: "#B59A78",
      speaker: "#FFA54F",
      border: "#8A4C28",
    },
  },
  {
    id: "WARM_SPRING",
    label: "Warm Spring",
    family: "Spring",
    description:
      "Sunlit amber, warm coral, and fresh yellow-green tones with welcoming warmth.",
    colors: {
      dialogue: "#FFF4DE",
      narration: "#E89A3C",
      emphasis: "#E7C75B",
      strong: "#F06D46",
      whisper: "#A98A68",
      speaker: "#F0B45A",
      border: "#7B512A",
    },
  },
  {
    id: "LIGHT_SPRING",
    label: "Light Spring",
    family: "Spring",
    description:
      "Soft peach, mint, and butter-yellow accents with a light, optimistic feel.",
    colors: {
      dialogue: "#FFF9EF",
      narration: "#F3A7A0",
      emphasis: "#9ED9B4",
      strong: "#F5C65D",
      whisper: "#B1A99A",
      speaker: "#F1B6A5",
      border: "#8F7266",
    },
  },
  {
    id: "LIGHT_SUMMER",
    label: "Light Summer",
    family: "Summer",
    description:
      "Airy lavender, powder blue, and cool rose accents with gentle contrast.",
    colors: {
      dialogue: "#F8F7FF",
      narration: "#A8B8E8",
      emphasis: "#D4A7CF",
      strong: "#8FCAC6",
      whisper: "#A6A7B4",
      speaker: "#B5BCE4",
      border: "#676F8C",
    },
  },
  {
    id: "COOL_SUMMER",
    label: "Cool Summer",
    family: "Summer",
    description:
      "Muted blue, cool mauve, and sea-glass tones with refined softness.",
    colors: {
      dialogue: "#F3F5FF",
      narration: "#8EA4D8",
      emphasis: "#B58AC7",
      strong: "#6BB7B0",
      whisper: "#8E95A8",
      speaker: "#A2B0DD",
      border: "#56637F",
    },
  },
  {
    id: "SOFT_SUMMER",
    label: "Soft Summer",
    family: "Summer",
    description:
      "Dusty plum, muted rose, and softened teal accents with low-key elegance.",
    colors: {
      dialogue: "#F5F1F4",
      narration: "#9A8FB0",
      emphasis: "#B78F9B",
      strong: "#7FA3A0",
      whisper: "#8E878D",
      speaker: "#A99CB3",
      border: "#625A68",
    },
  },
  {
    id: "SOFT_AUTUMN",
    label: "Soft Autumn",
    family: "Autumn",
    description:
      "Muted clay, olive, and warm sand tones with relaxed earthy softness.",
    colors: {
      dialogue: "#F6EBDD",
      narration: "#B7865A",
      emphasis: "#B9A05D",
      strong: "#C76F52",
      whisper: "#9A8875",
      speaker: "#C09268",
      border: "#70513A",
    },
  },
  {
    id: "WARM_AUTUMN",
    label: "Warm Autumn",
    family: "Autumn",
    description:
      "Burnished orange, ochre, and warm russet tones with rich seasonal warmth.",
    colors: {
      dialogue: "#F8E8CF",
      narration: "#C57A32",
      emphasis: "#D2A23A",
      strong: "#D8613B",
      whisper: "#9B8065",
      speaker: "#D18A42",
      border: "#7B4725",
    },
  },
  {
    id: "DEEP_AUTUMN",
    label: "Deep Autumn",
    family: "Autumn",
    description:
      "Deep bronze, forest gold, and dark terracotta tones with grounded intensity.",
    colors: {
      dialogue: "#F3E4CF",
      narration: "#AD713B",
      emphasis: "#B68B3D",
      strong: "#C45735",
      whisper: "#8C7866",
      speaker: "#C07B3C",
      border: "#664124",
    },
  },
]);

const PALETTE_BY_ID = new Map(
  CHARACTER_COLOR_PALETTES.map((palette) => [palette.id, palette])
);

export function getCharacterColorPalette(paletteId) {
  return (
    PALETTE_BY_ID.get(String(paletteId || "").trim().toUpperCase()) ||
    PALETTE_BY_ID.get(DEFAULT_CHARACTER_COLOR_PALETTE_ID)
  );
}

export function getCharacterColorPaletteLabel(paletteId) {
  return getCharacterColorPalette(paletteId).label;
}
