import { assetBuilderConfigs } from "../assetBuilderConfigs";
import {
  ASSET_CONTENT_RATING_OPTIONS,
  ASSET_IMAGE_COUNT_OPTIONS,
  ASSET_RENDERING_STYLE_OPTIONS,
  ASSET_VISIBILITY_OPTIONS,
} from "./AssetBuilder.contract";
import {
  ASSET_BUILDER_INITIAL_FORM,
  ASSET_BUILDER_INITIAL_LOCATION_DATA,
  getCreationTypeFromAssetConfig,
} from "./useAssetBuilderViewModel";

function buildFixture(config, overrides = {}) {
  const creationType = getCreationTypeFromAssetConfig(config);
  const form = {
    ...ASSET_BUILDER_INITIAL_FORM,
    name: `${config.typeLabel} Example`,
    description: `Fixture description for a reusable ${config.typeLabel.toLowerCase()} asset.`,
    prompt: config.promptPlaceholder,
    tags: "fixture, reusable, visual",
  };
  const extraValues = Object.fromEntries(
    (config.extraFields || []).map((field) => [
      field.id,
      field.options?.find((option) => option.value)?.value || "",
    ])
  );

  return {
    config: {
      typeLabel: config.typeLabel,
      title: config.title,
      description: config.description,
      promptLabel: config.promptLabel,
      promptPlaceholder: config.promptPlaceholder,
    },
    creationType,
    form,
    extraFields: config.extraFields || [],
    extraValues,
    candidates: Array.from({ length: 4 }, (_, index) => ({
      id: `candidate-${index + 1}`,
      label: `Candidate ${index + 1}`,
    })),
    selectedCover: "candidate-1",
    supportsImagePromptFields: [
      "OUTFIT",
      "LOCATION",
      "IMAGE_PRESET",
    ].includes(creationType),
    parentLocation: {
      id: "",
      title: "",
      imageUrl: "",
      scale: "",
      spaceType: "",
    },
    visibilityOptions: ASSET_VISIBILITY_OPTIONS,
    contentRatingOptions: ASSET_CONTENT_RATING_OPTIONS,
    renderingStyleOptions: ASSET_RENDERING_STYLE_OPTIONS,
    imageCountOptions: ASSET_IMAGE_COUNT_OPTIONS,
    locationRuntimeContent: null,
    locationRegistryContent: null,
    parentPickerContent: null,
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    onUpdateField: () => {},
    onUpdateExtra: () => {},
    onSelectCover: () => {},
    onOpenParentPicker: () => {},
    onClearParentLocation: () => {},
    onSave: () => {},
    ...overrides,
  };
}

export const assetBuilderOutfitFixture = buildFixture(
  assetBuilderConfigs.outfit,
  {
    form: {
      ...ASSET_BUILDER_INITIAL_FORM,
      name: "Roadsworn Ember Armor",
      description: "A durable layered travel-and-combat outfit.",
      prompt:
        "Layered leather, engraved brass, ember-red cloth, reinforced boots, and weathered travel straps.",
      image_prompt:
        "Standalone catalogue view of layered ember-red fantasy travel armor.",
      negative_prompt: "modern logos, sneakers, plastic armor",
      tags: "armor, travel, fantasy",
    },
  }
);

export const assetBuilderPoseFixture = buildFixture(assetBuilderConfigs.pose, {
  form: {
    ...ASSET_BUILDER_INITIAL_FORM,
    name: "Measured Duelist Stance",
    description: "A balanced, alert sword-ready pose.",
    prompt:
      "Standing three-quarter stance, balanced weight, sword held low, alert shoulders, controlled tension.",
    tags: "duelist, standing, combat-ready",
  },
});

export const assetBuilderImagePresetFixture = buildFixture(
  assetBuilderConfigs.imagePreset,
  {
    form: {
      ...ASSET_BUILDER_INITIAL_FORM,
      name: "Aurora Noir",
      description: "A reusable luminous noir rendering preset.",
      prompt:
        "High-contrast noir lighting, aurora edge glow, atmospheric haze, restrained jewel tones.",
      image_prompt:
        "Cinematic aurora noir visual treatment with luminous edges and deep shadow.",
      negative_prompt: "flat daylight, washed-out contrast",
      tags: "noir, cinematic, aurora",
    },
  }
);

export const assetBuilderLocationFixture = buildFixture(
  assetBuilderConfigs.location,
  {
    extraValues: {
      ...ASSET_BUILDER_INITIAL_LOCATION_DATA,
      space_type: "CITY",
      locationScale: "DISTRICT",
      mood: "MYSTERIOUS",
    },
    parentLocation: {
      id: "fixture-city",
      title: "Crestfall City",
      imageUrl: "",
      scale: "CITY",
      spaceType: "CITY",
    },
  }
);

export const assetBuilderEmptyFixture = buildFixture(assetBuilderConfigs.outfit, {
  form: { ...ASSET_BUILDER_INITIAL_FORM },
  selectedCover: null,
});

export const assetBuilderSavingFixture = buildFixture(assetBuilderConfigs.outfit, {
  saveStatus: "saving",
  saveDisabled: true,
});

export const assetBuilderSavedFixture = buildFixture(assetBuilderConfigs.outfit, {
  saveStatus: "saved",
  saveMessage: "Draft saved.",
});

export const assetBuilderErrorFixture = buildFixture(assetBuilderConfigs.outfit, {
  saveStatus: "error",
  saveMessage: "Outfit draft could not be saved.",
});
