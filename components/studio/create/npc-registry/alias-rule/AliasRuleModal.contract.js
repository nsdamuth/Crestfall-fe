export const ALIAS_RULE_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} AliasIdentityOption
 * @property {string} id
 * @property {string} label
 */

/**
 * Stable UI boundary for the portable Alias Rule modal View.
 *
 * The View receives display-ready labels, values, and identity options. It
 * must not know NPC registry draft field names or how alias rules are stored.
 *
 * @typedef {Object} AliasRuleModalViewProps
 * @property {string} modalTitle
 * @property {string} trueIdentityLabel
 * @property {string} selectedIdentityId
 * @property {AliasIdentityOption[]} identityOptions
 * @property {string} publicIdentityLabel
 * @property {string} publicIdentityValue
 * @property {string} ruleLabel
 * @property {string} ruleValue
 * @property {string} rulePlaceholder
 * @property {number} ruleRows
 * @property {string} saveLabel
 * @property {(() => void)|null} onClose
 * @property {((identityId: string) => void)|null} onChooseTrueIdentity
 * @property {((value: string) => void)|null} onChangePublicIdentity
 * @property {((value: string) => void)|null} onChangeRule
 * @property {(() => void)|null} onSave
 */

export {};
