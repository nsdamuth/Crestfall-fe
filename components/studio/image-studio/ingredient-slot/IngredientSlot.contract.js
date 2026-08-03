export const INGREDIENT_SLOT_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the Image Studio Ingredient Slot portable View.
 *
 * The View receives display-ready slot state and semantic callbacks. It does
 * not receive the raw Image Studio slot definition or selected ingredient
 * record.
 *
 * @typedef {Object} IngredientSlotViewProps
 * @property {string} label Display label for the ingredient category.
 * @property {import("react").ElementType | null} SlotIcon Visual icon supplied by the slot definition.
 * @property {boolean} isCustom Whether the selected ingredient is custom-authored.
 * @property {boolean} hasValue Whether the slot currently contains a selection.
 * @property {string} requirementLabel Display-ready required, optional, or custom label.
 * @property {string} title Selected ingredient title or empty-state prompt.
 * @property {string} subtitle Optional selected ingredient subtitle.
 * @property {string} clearLabel Accessible clear-action label.
 * @property {() => void} onOpenSlot Opens the ingredient selection workflow.
 * @property {() => void} onClearSlot Clears the current ingredient selection.
 */

export {};
