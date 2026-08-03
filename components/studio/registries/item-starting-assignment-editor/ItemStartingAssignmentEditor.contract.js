export const ITEM_STARTING_ASSIGNMENT_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable LOOM boundary for Item Registry starting-holder and nested-placement
 * authoring.
 *
 * The View receives normalized holder state, display-ready options and placement
 * rows, semantic callbacks, and an optional application picker slot. It does
 * not normalize Item Registry JSONB, interpret legacy snake_case aliases,
 * construct placement IDs, validate linked Creation types, reorder arrays, or
 * import the application Creation picker.
 *
 * @typedef {Object} ItemStartingAssignmentOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} ItemStartingPlacementStepView
 * @property {string} id
 * @property {number} index
 * @property {number} levelNumber
 * @property {string} kind
 * @property {string} label
 * @property {boolean} isFirst
 * @property {boolean} isLast
 *
 * @typedef {Object} ItemStartingAssignmentEditorViewProps
 * @property {string} holderType
 * @property {ItemStartingAssignmentOption[]} holderTypeOptions
 * @property {string} holderTypeLabel
 * @property {boolean} usesCreation
 * @property {boolean} hasSelectedHolder
 * @property {string} selectedHolderTitle
 * @property {string} emptyHolderLabel
 * @property {string} pickerAddLabel
 * @property {boolean} showUnassignedState
 * @property {boolean} showStoryState
 * @property {boolean} showPlacement
 * @property {string} placementSpecificity
 * @property {ItemStartingAssignmentOption[]} placementSpecificityOptions
 * @property {ItemStartingAssignmentOption[]} placementStepKindOptions
 * @property {ItemStartingPlacementStepView[]} placementSteps
 * @property {string} placementNote
 * @property {boolean} canAddPlacementStep
 * @property {(holderType: string) => void} onChangeHolderType
 * @property {() => void} onOpenPicker
 * @property {() => void} onClearHolderCreation
 * @property {(specificity: string) => void} onChangePlacementSpecificity
 * @property {(stepIndex: number) => void} onMovePlacementStepUp
 * @property {(stepIndex: number) => void} onMovePlacementStepDown
 * @property {(stepId: string) => void} onDeletePlacementStep
 * @property {(stepId: string, kind: string) => void} onChangePlacementStepKind
 * @property {(stepId: string, label: string) => void} onChangePlacementStepLabel
 * @property {(stepId: string) => void} onBlurPlacementStepLabel
 * @property {() => void} onAddPlacementStep
 * @property {(note: string) => void} onChangePlacementNote
 * @property {import("react").ReactNode} pickerSlot
 */

export {};
