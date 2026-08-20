export const ACTOR_MECHANICS_PROFILE_ATTACHMENT_VIEW_CONTRACT = Object.freeze({
  id: "actor_mechanics_profile_attachment_section",
  version: "0.3.0",
  description:
    "Portable presentation contract for an Actor Mechanics Profile relationship. Character and Player Character persistence is graph-authoritative; lightweight NPC Registry Entries use their separate embedded-entry contract.",
});

/**
 * @typedef {Object} ActorMechanicsProfileAttachmentCard
 * @property {string} id
 * @property {string} title
 * @property {string} typeLabel
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} presetLabel
 * @property {string} ownerLabel
 * @property {string[]} enabledDomainLabels
 * @property {string} notes
 * @property {string} removeAriaLabel
 */

/**
 * @typedef {Object} ActorMechanicsProfileAttachmentSectionViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} body
 * @property {string} addLabel
 * @property {string} emptyLabel
 * @property {string} runtimeNote
 * @property {ActorMechanicsProfileAttachmentCard|null} attachment
 * @property {string} errorMessage
 * @property {string} warningMessage
 * @property {boolean} disabled
 * @property {Function|null} onOpenPicker
 * @property {Function|null} onRemoveAttachment
 * @property {Function|null} onChangeAttachmentNotes
 */

export default ACTOR_MECHANICS_PROFILE_ATTACHMENT_VIEW_CONTRACT;
