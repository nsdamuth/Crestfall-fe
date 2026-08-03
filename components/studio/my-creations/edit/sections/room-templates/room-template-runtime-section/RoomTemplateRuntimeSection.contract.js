export const ROOM_TEMPLATE_RUNTIME_SECTION_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the portable Story runtime-context View.
 *
 * The View must not know raw Story data fields, Rules Codex or registry attachment storage,
 * picker configuration, linked-creation payloads, Rules Codex activation, registry priority rules,
 * saving, or persistence. It renders a direct registry-attachments View
 * contract plus display-ready private guidance and emits semantic text intent.
 *
 * @typedef {Object} RoomTemplateRuntimeSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {Object} rulesCodexAttachments
 * @property {Object} registryAttachments
 * @property {string} privateGuidanceLabel
 * @property {string} privateGuidance
 * @property {string} privateGuidancePlaceholder
 * @property {((value: string) => void)|null} onChangePrivateGuidance
 */

export {};
