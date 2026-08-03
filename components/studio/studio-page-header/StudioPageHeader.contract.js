export const STUDIO_PAGE_HEADER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable Studio page-header contract.
 *
 * @typedef {Object} StudioPageHeaderViewProps
 * @property {string} [eyebrow] Optional uppercase section label.
 * @property {string} [title] Primary page heading.
 * @property {string} [description] Optional supporting description.
 * @property {import("react").ReactNode} [children] Optional page-level actions.
 */

export const STUDIO_PAGE_HEADER_VIEW_DEFAULTS = Object.freeze({
  eyebrow: "",
  title: "",
  description: "",
  children: null,
});
