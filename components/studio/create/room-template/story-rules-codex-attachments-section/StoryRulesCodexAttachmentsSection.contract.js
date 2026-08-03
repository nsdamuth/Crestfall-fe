export const STORY_RULES_CODEX_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION =
  "1.0.0";

/**
 * @typedef {Object} StoryRulesCodexAttachmentViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} typeLabel
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} notes
 * @property {string} removeAriaLabel
 */

/**
 * Stable UI boundary for Story-scoped Rules Codex attachments.
 *
 * The portable View must not know creation APIs, owned-creation loading,
 * RULES_CODEX type filtering, legacy ID-only storage, relationship field
 * names, deduplication, Story persistence, runtime retrieval, or prompt
 * composition. It renders display-ready attachment cards and emits semantic
 * attach, remove, and notes intent.
 *
 * @typedef {Object} StoryRulesCodexAttachmentsSectionViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} body
 * @property {string} addLabel
 * @property {string} emptyLabel
 * @property {string} runtimeNote
 * @property {StoryRulesCodexAttachmentViewItem[]} attachments
 * @property {(() => void)|null} onOpenPicker
 * @property {((attachmentId: string) => void)|null} onRemoveAttachment
 * @property {((attachmentId: string, notes: string) => void)|null} onChangeAttachmentNotes
 */

export {};
