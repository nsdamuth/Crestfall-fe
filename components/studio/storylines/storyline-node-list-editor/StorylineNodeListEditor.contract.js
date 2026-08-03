export const STORYLINE_NODE_LIST_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable LOOM boundary for Storyline sequence and transition authoring.
 *
 * The View receives display-ready nodes, validation messages, legal option
 * lists, semantic callbacks, and an optional reference-picker slot. It does
 * not normalize Storyline JSONB, validate authoring data, construct nodes or
 * triggers, decide terminal-node behavior, reorder arrays, or import the
 * application reference picker.
 *
 * @typedef {Object} StorylineEditorOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} StorylineEditorTrigger
 * @property {string} id
 * @property {number} index
 * @property {string} type
 * @property {string} label
 * @property {string} description
 *
 * @typedef {Object} StorylineEditorNode
 * @property {string} id
 * @property {number} index
 * @property {string} positionLabel
 * @property {string} referenceTypeLabel
 * @property {string} finalNodeLabel
 * @property {string} title
 * @property {string} subtitle
 * @property {boolean} isFirst
 * @property {boolean} isLast
 * @property {string} completionGuidance
 * @property {string} transitionPolicy
 * @property {StorylineEditorOption[]} transitionOptions
 * @property {string} transitionDescription
 * @property {boolean} needsTriggers
 * @property {string} triggerMode
 * @property {StorylineEditorOption[]} triggerModeOptions
 * @property {StorylineEditorOption[]} triggerTypeOptions
 * @property {StorylineEditorTrigger[]} triggers
 * @property {boolean} showOpenWorldGuidance
 * @property {string} openWorldGuidance
 * @property {string} pressureGuidance
 *
 * @typedef {Object} StorylineNodeListEditorViewProps
 * @property {string} headerEyebrow
 * @property {string} headerDescription
 * @property {string} nodeCountLabel
 * @property {string} addReferenceLabel
 * @property {boolean} showStructureControls
 * @property {boolean} showTransitionControls
 * @property {string} loadError
 * @property {string} emptyStateMessage
 * @property {StorylineEditorNode[]} nodes
 * @property {string[]} validationErrors
 * @property {string[]} visibleWarnings
 * @property {string} errorsTitle
 * @property {string} warningsTitle
 * @property {() => void} onOpenReferencePicker
 * @property {(nodeIndex: number) => void} onMoveNodeUp
 * @property {(nodeIndex: number) => void} onMoveNodeDown
 * @property {(nodeIndex: number) => void} onRemoveNode
 * @property {(nodeIndex: number, value: string) => void} onChangeCompletionGuidance
 * @property {(nodeIndex: number, value: string) => void} onChangeTransitionPolicy
 * @property {(nodeIndex: number, value: string) => void} onChangeTriggerMode
 * @property {(nodeIndex: number) => void} onAddTrigger
 * @property {(nodeIndex: number, triggerIndex: number, value: string) => void} onChangeTriggerType
 * @property {(nodeIndex: number, triggerIndex: number, value: string) => void} onChangeTriggerLabel
 * @property {(nodeIndex: number, triggerIndex: number, value: string) => void} onChangeTriggerDescription
 * @property {(nodeIndex: number, triggerIndex: number) => void} onRemoveTrigger
 * @property {(nodeIndex: number, value: string) => void} onChangeOpenWorldGuidance
 * @property {(nodeIndex: number, value: string) => void} onChangePressureGuidance
 * @property {import("react").ReactNode} referencePickerSlot
 */

export {};
