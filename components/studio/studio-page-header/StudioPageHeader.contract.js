export const STUDIO_PAGE_HEADER_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Portable Studio page-header contract.
 *
 * 1.1.0 (R7 page-heading-law hardening, 10 Aug 2026): text-only
 * children render through the description branch (below the title,
 * left aligned to the content edge) instead of the beside-title
 * action slot, so description-as-children misuse can no longer
 * produce heading drift. Element children keep the action slot.
 * Additive presentation change; the prop surface is unchanged.
 *
 * @typedef {Object} StudioPageHeaderViewProps
 * @property {string} [eyebrow] Optional uppercase section label.
 * @property {string} [title] Primary page heading.
 * @property {string} [description] Optional supporting description.
 *   Wins over text children when both are supplied.
 * @property {import("react").ReactNode} [children] Optional page-level
 *   actions (element children). Text-only children are treated as a
 *   description, never as actions.
 */

export const STUDIO_PAGE_HEADER_VIEW_DEFAULTS = Object.freeze({
  eyebrow: "",
  title: "",
  description: "",
  children: null,
});
