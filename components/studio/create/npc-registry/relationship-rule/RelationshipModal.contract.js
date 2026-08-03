export const RELATIONSHIP_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} RelationshipIdentityOption
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} RelationshipChoiceOption
 * @property {string} id
 * @property {string} label
 */

/**
 * Stable UI boundary for the portable Relationship modal View.
 *
 * The View receives display-ready NPC identities, relationship choices, and
 * semantic actions. It must not know NPC registry draft field names or how
 * relationship records are stored.
 *
 * @typedef {Object} RelationshipModalViewProps
 * @property {string} modalTitle
 * @property {string} sourceIdentityLabel
 * @property {string} targetIdentityLabel
 * @property {string} selectedSourceIdentityId
 * @property {string} selectedTargetIdentityId
 * @property {RelationshipIdentityOption[]} identityOptions
 * @property {string} relationshipTypeLabel
 * @property {string} relationshipTypeValue
 * @property {string} directionLabel
 * @property {string} selectedDirectionId
 * @property {RelationshipChoiceOption[]} directionOptions
 * @property {string} strengthLabel
 * @property {string} selectedStrengthId
 * @property {RelationshipChoiceOption[]} strengthOptions
 * @property {string} ruleLabel
 * @property {string} ruleValue
 * @property {number} ruleRows
 * @property {string} rulePlaceholder
 * @property {string} saveLabel
 * @property {(() => void)|null} onClose
 * @property {((identityId: string) => void)|null} onChooseSourceIdentity
 * @property {((identityId: string) => void)|null} onChooseTargetIdentity
 * @property {((value: string) => void)|null} onChangeRelationshipType
 * @property {((directionId: string) => void)|null} onChooseDirection
 * @property {((strengthId: string) => void)|null} onChooseStrength
 * @property {((value: string) => void)|null} onChangeRelationshipRule
 * @property {(() => void)|null} onSave
 */

export {};
