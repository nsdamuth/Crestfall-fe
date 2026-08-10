// Fixture states per docs/SPRINT-E-PLAN.md section 4: default,
// saving, longest content.
const noop = () => {};

const HELPER_TEXT =
  "Saving creates a private SFW draft and selects it for the current Image Studio request. Using it once does not create a saved asset.";
const INTRO_TEXT =
  "Save this custom guidance as a private reusable draft. You can return to it later from My Creations or select it again from the Image Studio picker.";

export const kitSaveIngredientPresetFixtures = [
  {
    id: "default",
    label: "Default",
    props: {
      presetTypeLabel: "Pose",
      introText: INTRO_TEXT,
      helperText: HELPER_TEXT,
      nameValue: "",
      onChangeName: noop,
      descriptionValue: "",
      onChangeDescription: noop,
      promptValue: "",
      onChangePrompt: noop,
      tagsValue: "",
      onChangeTags: noop,
      isSaving: false,
      canSave: false,
      onSavePreset: noop,
      onUseOnce: noop,
      onClose: noop,
    },
  },
  {
    id: "saving",
    label: "Saving",
    props: {
      presetTypeLabel: "Clothing Source",
      introText: INTRO_TEXT,
      helperText: HELPER_TEXT,
      nameValue: "Dockside Coat, Weathered",
      onChangeName: noop,
      descriptionValue: "A worn oilskin coat, salt-stained at the hem.",
      onChangeDescription: noop,
      promptValue: "A long weathered oilskin coat, salt-stained, dockside worker cut.",
      onChangePrompt: noop,
      tagsValue: "coastal, worn, practical",
      onChangeTags: noop,
      isSaving: true,
      canSave: true,
      onSavePreset: noop,
      onUseOnce: noop,
      onClose: null,
    },
  },
  {
    id: "longestContent",
    label: "Longest content",
    props: {
      presetTypeLabel: "Location / Scene",
      introText: INTRO_TEXT,
      helperText: HELPER_TEXT,
      nameValue: "The Lantern-Keeper's Watch Above the Vermillion Coast, Third Cycle Study",
      onChangeName: noop,
      descriptionValue:
        "A deliberately long description written to stress the field's wrapping behavior across many lines, describing a cliffside watch post above a working harbor, lantern towers spaced along the headland, and the kind of weather that keeps a keeper indoors more nights than not.",
      onChangeDescription: noop,
      promptValue:
        "A deliberately long prompt fragment written to stress the field's wrapping behavior across many lines: a cliffside lantern-keeper's watch above a working harbor at dusk, storm clouds gathering offshore, gulls scattering ahead of the first gust, lantern towers spaced along the headland each just beginning to catch light, right up against the field's practical limits so the layout is exercised honestly rather than guessed at from a short fixture.",
      onChangePrompt: noop,
      tagsValue: "coastal, cliffside, dusk, storm-light, lantern-tower, harbor-view, weathered, third-cycle",
      onChangeTags: noop,
      isSaving: false,
      canSave: true,
      onSavePreset: noop,
      onUseOnce: noop,
      onClose: noop,
    },
  },
];
