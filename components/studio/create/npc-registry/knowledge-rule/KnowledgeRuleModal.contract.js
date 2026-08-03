export const KNOWLEDGE_RULE_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} KnowledgeIdentityOption
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} KnowledgeLevelOption
 * @property {string} id
 * @property {string} label
 */

/**
 * Stable UI boundary for the portable Knowledge Rule modal View.
 *
 * The View receives display-ready labels, values, identity options, and
 * semantic actions. It must not know NPC registry draft field names or how
 * knowledge rules are persisted.
 *
 * @typedef {Object} KnowledgeRuleModalViewProps
 * @property {string} modalTitle
 * @property {string} knowledgeTopicLabel
 * @property {string} knowledgeTopicValue
 * @property {string} knowledgeLevelLabel
 * @property {string} selectedKnowledgeLevelId
 * @property {KnowledgeLevelOption[]} knowledgeLevelOptions
 * @property {string} knownByTitle
 * @property {string} suspectedByTitle
 * @property {KnowledgeIdentityOption[]} identityOptions
 * @property {string[]} knownByIdentityIds
 * @property {string[]} suspectedByIdentityIds
 * @property {string} falseBeliefLabel
 * @property {string} falseBeliefValue
 * @property {number} falseBeliefRows
 * @property {string} notesLabel
 * @property {string} notesValue
 * @property {number} notesRows
 * @property {string} notesPlaceholder
 * @property {string} saveLabel
 * @property {(() => void)|null} onClose
 * @property {((value: string) => void)|null} onChangeKnowledgeTopic
 * @property {((knowledgeLevelId: string) => void)|null} onChooseDefaultKnowledge
 * @property {((identityId: string) => void)|null} onToggleKnownIdentity
 * @property {((identityId: string) => void)|null} onToggleSuspectedIdentity
 * @property {((value: string) => void)|null} onChangeFalseBeliefNotes
 * @property {((value: string) => void)|null} onChangeKnowledgeNotes
 * @property {(() => void)|null} onSave
 */

export {};
