export const CHARACTER_CREATOR_TYPES = Object.freeze({
  CHARACTER: "CHARACTER",
  PLAYER_CHARACTER: "PLAYER_CHARACTER",
});

const CHARACTER_CREATOR_MODE_CONFIG = Object.freeze({
  CHARACTER: Object.freeze({
    creationType: "CHARACTER",
    label: "Character",
    fallbackName: "Unnamed Character",
    fallbackDescription: "A private draft character created in Crestfall Studio.",
    builder: "CHARACTER_CREATOR",
    closeAriaLabel: "Close character creator",
    relationshipToPlayer: true,
    creatorDirectivesPlaceholder: "Instructions for how the AI should run this character",
    storyPanelTitle: "Continue into a story",
    storyPanelDescription: "Putting a saved character into a story is coming soon.",
    storyPanelMessage:
      "Story selection is not built yet. Once it exists, this will place this character into a story you pick, resumable from any device.",
  }),
  PLAYER_CHARACTER: Object.freeze({
    creationType: "PLAYER_CHARACTER",
    label: "Player Character",
    fallbackName: "Unnamed Player Character",
    fallbackDescription:
      "A private player character identity created in Crestfall Studio.",
    builder: "PLAYER_CHARACTER_CREATOR",
    closeAriaLabel: "Close Player Character creator",
    relationshipToPlayer: false,
    creatorDirectivesPlaceholder:
      "Identity and presentation guidance Crestfall should preserve around this Player Character",
    storyPanelTitle: "Use this Player Character in a Story",
    storyPanelDescription:
      "Player Characters are selected as your playable identity when starting or configuring a Story.",
    storyPanelMessage:
      "Save this Player Character, then choose it from the Story launch or Player Character selection flow.",
  }),
});

export function normalizeCharacterCreatorType(value) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();

  return normalized === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER
    ? CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER
    : CHARACTER_CREATOR_TYPES.CHARACTER;
}

export function getCharacterCreatorMode(value) {
  return CHARACTER_CREATOR_MODE_CONFIG[normalizeCharacterCreatorType(value)];
}

function normalizeMultiValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  const single = String(value || "").trim();
  return single ? [single] : [];
}

function buildCanonicalClothingSource(formState = {}) {
  const mode =
    formState.defaultClothingMode === "OUTFIT" ||
    formState.defaultClothingMode === "WARDROBE"
      ? formState.defaultClothingMode
      : "NONE";

  if (mode === "OUTFIT") {
    return {
      mode,
      outfit_id: formState.defaultOutfitId || null,
      outfit_title: formState.defaultOutfitTitle || "",
      outfit_description: formState.defaultOutfitDescription || "",
      outfit_image_url: formState.defaultOutfitImageUrl || "",
      outfit_content_rating: formState.defaultOutfitContentRating || "",
      wardrobe_id: null,
      wardrobe_title: "",
      wardrobe_description: "",
      wardrobe_image_url: "",
      wardrobe_content_rating: "",
      resolver: { strategy: "DIRECT_OUTFIT" },
    };
  }

  if (mode === "WARDROBE") {
    return {
      mode,
      outfit_id: null,
      outfit_title: "",
      outfit_description: "",
      outfit_image_url: "",
      outfit_content_rating: "",
      wardrobe_id: formState.defaultWardrobeId || null,
      wardrobe_title: formState.defaultWardrobeTitle || "",
      wardrobe_description: formState.defaultWardrobeDescription || "",
      wardrobe_image_url: formState.defaultWardrobeImageUrl || "",
      wardrobe_content_rating: formState.defaultWardrobeContentRating || "",
      resolver: {
        strategy: "WARDROBE_RULES",
        resolve_at: "SCENE_BOUNDARY",
        persist_resolution: true,
      },
    };
  }

  return {
    mode: "NONE",
    outfit_id: null,
    outfit_title: "",
    outfit_description: "",
    outfit_image_url: "",
    outfit_content_rating: "",
    wardrobe_id: null,
    wardrobe_title: "",
    wardrobe_description: "",
    wardrobe_image_url: "",
    wardrobe_content_rating: "",
    resolver: { strategy: "NONE" },
  };
}

function canonicalCharacterData(formState = {}, mode) {
  const name = String(formState.name || "").trim() || mode.fallbackName;
  const clothingSource = buildCanonicalClothingSource(formState);

  return {
    name,
    title: formState.title || "",
    species: formState.species || "",
    custom_species: formState.customSpecies || "",
    gender_presentation: formState.genderPresentation || "",
    custom_gender_presentation: formState.customGenderPresentation || "",
    short_concept: formState.shortConcept || "",
    mbti_type: formState.mbtiType || "",
    western_zodiac_sign: formState.westernZodiacSign || "",
    east_asian_zodiac_sign: formState.eastAsianZodiacSign || "",
    skin_tone: formState.skinTone || "",
    skin_custom_value: formState.skinCustomValue || "",
    eye_color: formState.eyeColor || "",
    eye_custom_value: formState.eyeCustomValue || "",
    hair_color: formState.hairColor || "",
    hair_custom_value: formState.hairCustomValue || "",
    hair_length: formState.hairLength || "",
    hair_texture: formState.hairTexture || "",
    hair_style: formState.hairStyle || "",
    visual_heritage_reference: formState.ethnicAppearance || "",
    ethnic_appearance: formState.ethnicAppearance || "",
    kibbe_identity: formState.kibbeIdentity || "",
    body_type: formState.bodyType || "",
    height: formState.height || "",
    build: formState.build || "",
    proportions: normalizeMultiValue(formState.proportions),
    hips_waist_shoulders: formState.hipsWaistShoulders || "",
    chest_bust: formState.chestBust || "",
    body_notes: formState.bodyNotes || "",
    appearance_notes: formState.appearanceNotes || "",
    clothing_source: clothingSource,
    clothing_style: formState.clothingStyle || "",
    default_clothing_mode: clothingSource.mode,
    default_outfit_id: formState.defaultOutfitId || null,
    default_outfit_title: formState.defaultOutfitTitle || "",
    default_outfit_description: formState.defaultOutfitDescription || "",
    default_outfit_image_url: formState.defaultOutfitImageUrl || "",
    default_outfit_content_rating: formState.defaultOutfitContentRating || "",
    default_wardrobe_id: formState.defaultWardrobeId || null,
    default_wardrobe_title: formState.defaultWardrobeTitle || "",
    default_wardrobe_description: formState.defaultWardrobeDescription || "",
    default_wardrobe_image_url: formState.defaultWardrobeImageUrl || "",
    default_wardrobe_content_rating: formState.defaultWardrobeContentRating || "",
    outward_personality: formState.outwardPersonality || "",
    internal_personality: formState.internalPersonality || "",
    speech_style: formState.speechStyle || "",
    movement_style: formState.movementStyle || "",
    greeting: formState.greeting || "",
    scenario: formState.scenario || "",
    backstory: formState.backstory || "",
    verbosity_level: formState.verbosityLevel || "3",
    philosophy: formState.philosophy || "",
    interests: normalizeMultiValue(formState.interests),
    relationship_to_player: mode.relationshipToPlayer
      ? formState.relationshipToPlayer || ""
      : "",
    voice_module_ids: Array.isArray(formState.voiceModuleIds)
      ? formState.voiceModuleIds
      : [],
    personality_notes: formState.personalityNotes || "",
    age: formState.age || "18",
    rendering_style: formState.renderingStyle || "auto",
    character_color_palette_id:
      formState.characterColorPaletteId || "CRESTFALL_DEFAULT",
    creator_directives: formState.creatorDirectives || "",
    extra_runtime_notes: formState.extraRuntimeNotes || "",
    builder: mode.builder,
    builder_version: "2.0",
    ...(mode.creationType === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER
      ? {
          persona_type: "PLAYER_CHARACTER",
          profile_showcase: true,
          ai_controlled: false,
        }
      : {}),
  };
}

export function buildCharacterCreatorCreationPayload(
  formState = {},
  creationType = CHARACTER_CREATOR_TYPES.CHARACTER
) {
  const mode = getCharacterCreatorMode(creationType);
  const data = canonicalCharacterData(formState, mode);

  return {
    type: mode.creationType,
    title: data.name,
    description:
      formState.shortConcept ||
      formState.title ||
      formState.species ||
      mode.fallbackDescription,
    visibility: formState.visibility || "PRIVATE",
    content_rating: formState.contentRating || "SFW",
    data,
  };
}
