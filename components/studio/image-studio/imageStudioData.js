import {
  MapPin,
  Shirt,
  Sparkles,
  Theater,
  User,
  Users,
} from "lucide-react";

export const ingredientSlots = [
  {
    id: "character",
    label: "Character",
    required: true,
    icon: Users,
    allowedTypes: ["CHARACTER"],
    allowCustom: true,
    allowCreatePreset: false,
  },
  {
    id: "playerCharacter",
    label: "Player Character",
    required: false,
    icon: User,
    allowedTypes: ["PLAYER_CHARACTER"],
    allowCustom: true,
    allowCreatePreset: false,
  },
  {
    id: "pose",
    label: "Pose",
    required: false,
    icon: Theater,
    allowedTypes: ["POSE"],
    allowCustom: true,
    allowCreatePreset: true,
  },
  {
    id: "outfit",
    label: "Clothing Source",
    required: false,
    icon: Shirt,
    allowedTypes: ["OUTFIT", "WARDROBE"],
    allowCustom: true,
    allowCreatePreset: true,
  },
  {
    id: "location",
    label: "Location / Scene",
    required: false,
    icon: MapPin,
    allowedTypes: ["LOCATION"],
    allowCustom: true,
    allowCreatePreset: true,
  },
  {
    id: "preset",
    label: "Rendering Preset",
    required: false,
    icon: Sparkles,
    allowedTypes: ["IMAGE_PRESET"],
    allowCustom: true,
    allowCreatePreset: true,
  },
];
export const cameraPresetOptions = [
  { value: "AUTO", label: "Auto / No Camera Filter" },
  { value: "FACE_CLOSEUP", label: "Face Close-Up" },
  { value: "HEAD_SHOULDERS", label: "Head & Shoulders" },
  { value: "BUST", label: "Bust / Chest-Up" },
  { value: "WAIST_UP", label: "Waist-Up" },
  { value: "THREE_QUARTER", label: "Three-Quarter Body" },
  { value: "FULL_BODY", label: "Full Body" },
];
export const wardrobeThemeOptions = [
  { value: "AUTO", label: "Auto / Wardrobe Default" },
  { value: "DEFAULT", label: "Default" },
  { value: "CASUAL", label: "Casual" },
  { value: "FORMAL", label: "Formal" },
  { value: "WORK", label: "Work" },
  { value: "TRAVEL", label: "Travel" },
  { value: "COMBAT", label: "Combat" },
  { value: "SLEEPWEAR", label: "Sleepwear" },
  { value: "CEREMONIAL", label: "Ceremonial" },
  { value: "DISGUISE", label: "Disguise" },
  { value: "SEASONAL", label: "Seasonal" },
  { value: "SPECIAL", label: "Special" },
];
export const mockHistory = [
  { id: "history-1", type: "IMAGE", title: "Generated image placeholder" },
  { id: "history-2", type: "IMAGE", title: "Character portrait placeholder" },
  { id: "history-3", type: "IMAGE", title: "Location scene placeholder" },
  { id: "history-4", type: "IMAGE", title: "Outfit test placeholder" },
  { id: "history-5", type: "IMAGE", title: "Pose study placeholder" },
  { id: "history-6", type: "VIDEO", title: "Video placeholder" },
];

export const renderStyleOptions = [
  { value: "auto", label: "Auto / Character Default" },
  { value: "crestfall_fantasy", label: "Crestfall Fantasy" },
  { value: "crestfall_realistic", label: "Crestfall Realistic" },
  { value: "crestfall_anime_anime", label: "Crestfall Anime / Anime" },
  {
    value: "crestfall_fantasy_realistic",
    label: "Crestfall Fantasy → Realistic",
  },
  {
    value: "crestfall_realistic_fantasy",
    label: "Crestfall Realistic → Fantasy",
  },
];

export const aspectRatioOptions = [
  { value: "PORTRAIT_4_5", label: "Portrait 4:5" },
  { value: "LANDSCAPE_5_4", label: "Landscape 5:4" },
  { value: "PORTRAIT_9_16", label: "9:16" },
  { value: "LANDSCAPE_16_9", label: "16:9" },
  { value: "SQUARE_1_1", label: "1:1" },
];

export const imageCountOptions = [
  { value: "1", label: "1 image" },
  { value: "2", label: "2 images" },
  { value: "4", label: "4 images" },
];

export const videoDurationOptions = [
  { value: "4", label: "4 seconds" },
  { value: "8", label: "8 seconds" },
  { value: "12", label: "12 seconds" },
];

export const videoAspectRatioOptions = [
  { value: "PORTRAIT", label: "Portrait 9:16" },
  { value: "SQUARE", label: "Square 1:1" },
  { value: "LANDSCAPE", label: "Landscape 16:9" },
];

export const videoMotionStyleOptions = [
  { value: "SUBTLE", label: "Subtle motion" },
  { value: "CINEMATIC", label: "Cinematic motion" },
  { value: "ACTION", label: "Action motion" },
  { value: "EMOTIVE", label: "Emotive motion" },
];

export const videoToolCards = [
  {
    id: "scene-video",
    title: "Scene Video",
    eyebrow: "Room Moment",
    body: "Generate a short video from the selected character, location, outfit, pose, and prompt.",
  },
  {
    id: "character-motion",
    title: "Character Motion",
    eyebrow: "Character Test",
    body: "Preview a character with simple motion, expression, or pose changes.",
  },
  {
    id: "room-recap",
    title: "Room Recap Clip",
    eyebrow: "Story",
    body: "Create a short recap-style clip from a recent room scene once room state exists.",
  },
  {
    id: "avatar-motion",
    title: "Avatar Motion Test",
    eyebrow: "Profile Media",
    body: "Create a lightweight animated profile or character media test from saved assets.",
  },
];

