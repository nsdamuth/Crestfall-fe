export const CHARACTER_TEMPLATE_GALLERY_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the bounded Character Template gallery.
 *
 * The View owns template-card, disabled-action, empty-state, and sidebar
 * presentation. It does not own template discovery, creation, duplication,
 * permissions, routes, APIs, service behavior, or persistence.
 *
 * @typedef {Object} CharacterTemplateGalleryItem
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} description
 *
 * @typedef {Object} CharacterTemplateGalleryViewProps
 * @property {CharacterTemplateGalleryItem[]} templates
 * @property {string} createTemplateHref
 * @property {string} createTemplateLabel
 * @property {string} sidebarEyebrow
 * @property {string} sidebarTitle
 * @property {string} sidebarBody
 * @property {string} useTemplateLabel
 * @property {string} duplicateLabel
 * @property {import("react").ElementType} [LinkComponent] doc-only addition
 *   (ED1G sw12): link/anchor component injected by the host, defaults to
 *   "a" in the View. Already read by the View, undeclared here. No
 *   version bump.
 */

export {};
