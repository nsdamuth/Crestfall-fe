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
export const cameraPresetGroups = Object.freeze([
  Object.freeze({ id: "shot-size", label: "Shot Size" }),
  Object.freeze({ id: "camera-angle", label: "Camera Angle" }),
  Object.freeze({ id: "camera-movement", label: "Camera Movement" }),
  Object.freeze({ id: "lens", label: "Lens" }),
  Object.freeze({ id: "focus", label: "Focus" }),
  Object.freeze({ id: "lighting-direction", label: "Lighting Direction" }),
  Object.freeze({ id: "specialized", label: "Specialized" }),
]);

export const cameraPresetCatalog = Object.freeze([
  Object.freeze({
    value: "AUTO",
    label: "Auto / No Camera Filter",
    groupId: "auto",
    description: "Let the image model choose framing and camera treatment.",
    prompt: "",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "EXTREME_WIDE_SHOT",
    label: "Extreme Wide Shot (EWS)",
    groupId: "shot-size",
    description: "Establishing view with the character small in the environment.",
    prompt:
      "extreme_wide_shot, full_body, character_small_in_frame, establishing_view, landscape_setting, distance_shot",
    legacyCameraPreset: "FULL_BODY",
  }),
  Object.freeze({
    value: "WIDE_SHOT",
    label: "Wide Shot (WS)",
    groupId: "shot-size",
    description: "Full figure visible from head to toe.",
    prompt:
      "wide_shot, full_body, full_figure, head_to_toe, standing_pose, character_visible",
    legacyCameraPreset: "FULL_BODY",
  }),
  Object.freeze({
    value: "MEDIUM_WIDE_SHOT",
    label: "Medium Wide Shot (MWS)",
    groupId: "shot-size",
    description: "Character-focused full-body framing, generally from the knees up.",
    prompt:
      "medium_wide_shot, full_body, knees_up, medium_shot, character_focused",
    legacyCameraPreset: "THREE_QUARTER",
  }),
  Object.freeze({
    value: "MEDIUM_SHOT",
    label: "Medium Shot (MS)",
    groupId: "shot-size",
    description: "Waist-up framing centered on the upper body.",
    prompt:
      "medium_shot, waist_up, upper_body, torso_shot, from_waist_up",
    legacyCameraPreset: "WAIST_UP",
  }),
  Object.freeze({
    value: "MEDIUM_CLOSE_UP",
    label: "Medium Close-Up (MCU)",
    groupId: "shot-size",
    description: "Chest-up framing for expression and upper-torso detail.",
    prompt:
      "medium_close_up, chest_up, bust_shot, upper_torso, head_and_shoulders",
    legacyCameraPreset: "BUST",
  }),
  Object.freeze({
    value: "CLOSE_UP",
    label: "Close-Up (CU)",
    groupId: "shot-size",
    description: "Face-focused framing with detailed features and expression.",
    prompt:
      "close_up, head_shot, face_focused, detailed_features, expression_focus",
    legacyCameraPreset: "FACE_CLOSEUP",
  }),
  Object.freeze({
    value: "EXTREME_CLOSE_UP",
    label: "Extreme Close-Up (ECU)",
    groupId: "shot-size",
    description: "Macro-style intimate detail such as the eyes or a texture.",
    prompt:
      "extreme_close_up, eye_shot, detailed_texture, macro_view, intimate_view",
    legacyCameraPreset: "FACE_CLOSEUP",
  }),
  Object.freeze({
    value: "LOW_ANGLE_SHOT",
    label: "Low Angle Shot",
    groupId: "camera-angle",
    description: "Looks upward to make the subject feel imposing or heroic.",
    prompt:
      "low_angle, worm's_eye_view, looking_up, hero_shot, imposing_figure",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "HIGH_ANGLE_SHOT",
    label: "High Angle Shot",
    groupId: "camera-angle",
    description: "Looks down from above for a vulnerable or observational perspective.",
    prompt:
      "high_angle, bird's_eye_view, looking_down, vulnerable_perspective",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "DUTCH_ANGLE",
    label: "Dutch Angle / Dutch Tilt",
    groupId: "camera-angle",
    description: "Tilts the horizon for an off-kilter dynamic composition.",
    prompt:
      "dutch_angle, tilted_horizon, diagonal_composition, off_kilter, dynamic_angle",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "POINT_OF_VIEW_SHOT",
    label: "Point of View (POV) Shot",
    groupId: "camera-angle",
    description: "First-person framing from the character's perspective.",
    prompt:
      "point_of_view, first_person_view, character_perspective, immersive_shot",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "OVER_THE_SHOULDER_SHOT",
    label: "Over-the-Shoulder Shot",
    groupId: "camera-angle",
    description: "Frames the scene from behind a foreground shoulder.",
    prompt:
      "over_shoulder, behind_character, shoulder_in_foreground, focused_ahead",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "TRACKING_SHOT",
    label: "Tracking Shot",
    groupId: "camera-movement",
    description: "Follows movement with a smooth lateral or dolly feel.",
    prompt:
      "tracking_shot, following_movement, smooth_motion, camera_dolly, lateral_movement",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "CRANE_SHOT",
    label: "Crane Shot",
    groupId: "camera-movement",
    description: "Elevated sweeping view with a sense of grand scale.",
    prompt:
      "crane_shot, aerial_view, elevated_perspective, sweeping_movement, grand_scale",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "HANDHELD_SHOT",
    label: "Handheld Shot",
    groupId: "camera-movement",
    description: "Natural documentary-style movement with a raw feel.",
    prompt:
      "handheld, camera_shake, natural_movement, documentary_style, raw_feel",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "ZOOM_SHOT",
    label: "Zoom Shot",
    groupId: "camera-movement",
    description: "Dynamic focal change and perspective shift.",
    prompt:
      "zoom_in, zoom_effect, focal_change, perspective_shift, dynamic_zoom",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "WIDE_ANGLE_LENS",
    label: "Wide Angle Lens",
    groupId: "lens",
    description: "Expansive environmental view with exaggerated depth.",
    prompt:
      "wide_angle_lens, distorted_perspective, exaggerate_depth, environmental_context, expansive_view",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "TELEPHOTO_LENS",
    label: "Telephoto Lens",
    groupId: "lens",
    description: "Compressed space with selective focus and background blur.",
    prompt:
      "telephoto_lens, compressed_space, flat_perspective, background_blur, selective_focus",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "FISH_EYE_LENS",
    label: "Fish Eye Lens",
    groupId: "lens",
    description: "Surreal circular framing with strong barrel distortion.",
    prompt:
      "fish_eye_lens, extreme_distortion, circular_image, barrel_distortion, surreal_view",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "SHALLOW_DEPTH_OF_FIELD",
    label: "Shallow Depth of Field",
    groupId: "focus",
    description: "Isolates the subject against a soft blurred background.",
    prompt:
      "shallow_depth_of_field, bokeh, blurred_background, selective_focus, subject_isolated",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "DEEP_FOCUS",
    label: "Deep Focus",
    groupId: "focus",
    description: "Keeps foreground through background sharp and detailed.",
    prompt:
      "deep_focus, everything_sharp, foreground_to_background, detailed_environment, clarity",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "RACK_FOCUS",
    label: "Rack Focus",
    groupId: "focus",
    description: "Suggests a dramatic focal shift that guides attention.",
    prompt:
      "rack_focus, focus_shift, changing_focal_point, dramatic_transition, attention_guiding",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "BACKLIT_SHOT",
    label: "Backlit Shot",
    groupId: "lighting-direction",
    description: "Rim light, silhouette, and halo effects from behind.",
    prompt:
      "backlit, rim_lighting, silhouette, halo_effect, contre_jour",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "SIDE_LIT_SHOT",
    label: "Side Lit Shot",
    groupId: "lighting-direction",
    description: "Dimensional side light with dramatic shadow and texture.",
    prompt:
      "side_lighting, dramatic_shadows, texture_highlight, chiaroscuro, dimensional_lighting",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "FRONT_LIT_SHOT",
    label: "Front Lit Shot",
    groupId: "lighting-direction",
    description: "Even frontal illumination with minimal shadow.",
    prompt:
      "front_lighting, flat_lighting, shadowless, even_illumination, commercial_lighting",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "DUTCH_PAN",
    label: "Dutch Pan",
    groupId: "specialized",
    description: "Rotating tilt-and-pan treatment for a cinematic sweep.",
    prompt:
      "dutch_pan, rotating_angle, tilt_and_pan, dynamic_sweep, cinematic_movement",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "VERTIGO_SHOT",
    label: "Vertigo Shot / Dolly Zoom",
    groupId: "specialized",
    description: "Dolly-zoom perspective distortion for a dizzy cinematic effect.",
    prompt:
      "vertigo_shot, dolly_zoom, dizzy_effect, perspective_distortion, cinematic_technique",
    legacyCameraPreset: "AUTO",
  }),
  Object.freeze({
    value: "THROUGH_VIEWFINDER",
    label: "Through the Viewfinder",
    groupId: "specialized",
    description: "A restricted frame-within-frame camera viewpoint.",
    prompt:
      "through_viewfinder, frame_within_frame, camera_point_of_view, restricted_viewfinder",
    legacyCameraPreset: "AUTO",
  }),
]);

export const cameraPresetLegacyAliases = Object.freeze({
  FACE_CLOSEUP: "CLOSE_UP",
  HEAD_SHOULDERS: "MEDIUM_CLOSE_UP",
  BUST: "MEDIUM_CLOSE_UP",
  WAIST_UP: "MEDIUM_SHOT",
  THREE_QUARTER: "MEDIUM_WIDE_SHOT",
  FULL_BODY: "WIDE_SHOT",
});

export function normalizeCameraPresetValue(value) {
  const normalized = String(value || "AUTO").trim().toUpperCase();
  return cameraPresetLegacyAliases[normalized] || normalized || "AUTO";
}

export function getCameraPresetDefinition(value) {
  const normalized = normalizeCameraPresetValue(value);
  return (
    cameraPresetCatalog.find((preset) => preset.value === normalized) ||
    cameraPresetCatalog[0]
  );
}

export function getCameraPresetPrompt(value) {
  return getCameraPresetDefinition(value).prompt;
}

export function getLegacyCameraPresetValue(value) {
  return getCameraPresetDefinition(value).legacyCameraPreset || "AUTO";
}

// Legacy composer compatibility: the V2 Images surface uses the full
// cameraPresetCatalog through its Kit picker. Keep the older compact
// select list stable for any legacy composer still mounted during convergence.
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

