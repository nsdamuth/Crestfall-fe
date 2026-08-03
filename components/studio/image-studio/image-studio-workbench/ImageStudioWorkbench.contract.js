export const IMAGE_STUDIO_WORKBENCH_VIEW_CONTRACT_VERSION =
  "image-studio-workbench.view.v1";

/**
 * @typedef {Object} ImageStudioWorkbenchViewProps
 * @property {"IMAGE"|"VIDEO"} mode
 * @property {boolean} mobileComposerOpen
 * @property {boolean} canGenerateImage
 * @property {() => void} onOpenMobileComposer
 * @property {() => void} onCloseMobileComposer
 * @property {(event: import("react").MouseEvent) => void} onQuickGenerate
 * @property {Object} mediaHistoryProps
 * @property {Object} composerProps
 * @property {Object|null} pickerModalProps
 * @property {Object|null} savePresetModalProps
 * @property {import("react").ElementType} MediaHistoryGridComponent
 * @property {import("react").ElementType} ImageStudioComposerComponent
 * @property {import("react").ElementType} IngredientPickerModalComponent
 * @property {import("react").ElementType} SaveIngredientPresetModalComponent
 */

export const IMAGE_STUDIO_WORKBENCH_PORTABILITY_RULES = Object.freeze({
  ownsStudioAccountContext: "Binding Shell",
  ownsApplicationChildBindings: "Binding Shell",
  ownsGenerationAndHistoryHooks: "ViewModel",
  ownsCreationPresetClient: "ViewModel",
  ownsGenerationPayloadComposition: "ViewModel",
  ownsIngredientMutualExclusion: "ViewModel",
  ownsResponsiveWorkbenchMarkup: "Portable View",
  ownsModalVisibilityProjection: "ViewModel",
});
