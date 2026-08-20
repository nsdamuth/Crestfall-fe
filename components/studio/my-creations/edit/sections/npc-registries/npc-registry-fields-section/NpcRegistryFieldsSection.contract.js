export const NPC_REGISTRY_FIELDS_SECTION_VIEW_CONTRACT_VERSION = "1.3.0";

/**
 * Stable UI boundary for the portable NPC Registry Fields View.
 *
 * The View receives normalized registry metadata, display-ready cards, and
 * semantic callbacks. It must not inspect a Creation form, know NPC Registry
 * JSONB storage keys, load linked creations, or import application modals.
 *
 * @typedef {Object} NpcRegistryFieldsSectionViewProps
 * @property {"overview"|"entries"|"relationships"|"knowledge"|"aliases"} activeSection
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} registryTitleValue
 * @property {string} scopeValue
 * @property {string} descriptionValue
 * @property {string} descriptionPlaceholder
 * @property {string} creationTypeValue
 * @property {string} entryCountValue
 * @property {string} relationshipCountValue
 * @property {string} knowledgeRuleCountValue
 * @property {string} primaryActionLabel
 * @property {boolean} primaryActionDisabled
 * @property {string} helperMessage
 * @property {Array<{id:string, eyebrow:string, title:string, body:string, imageUrl:string, registryNotes:string, meta:string, footer:string, referenceWarning:string, onEdit:(Function|null), onDelete:(Function|null)}>} cards
 * @property {string} emptyMessage
 * @property {string} loadError
 * @property {((value: string) => void)|null} onChangeRegistryTitle
 * @property {((value: string) => void)|null} onChangeScope
 * @property {((value: string) => void)|null} onChangeDescription
 * @property {Function|null} onPrimaryAction
 */

export const NPC_REGISTRY_FIELDS_SECTION_APPLICATION_BOUNDARY = Object.freeze({
  applicationOwnedControls: [
    "NpcEntryModal",
    "RelationshipModal",
    "KnowledgeRuleModal",
    "AliasRuleModal",
  ],
  storageFields: [
    "scope",
    "entries",
    "relationships",
    "knowledge_rules",
    "aliases",
  ],
});

export {};
