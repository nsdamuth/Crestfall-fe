/**
 * 1.3.0, eight-fix package FIX 4 (12 Sep 2026), additive: optional
 * `breadcrumbs` items render the shared KitBreadcrumbs row between the
 * description line and the header divider. Absent or empty, nothing
 * renders and every 1.2.0 consumer is pixel-stable.
 *
 * 1.2.0, package MOBILE-SHELLS, additive and prop-free: the page title
 * takes the mobile type step below md and its desktop size from md up,
 * and the actions slot can shrink below lg instead of being shrink-0 at
 * every width. No prop was added, removed, or changed in meaning.
 */
export const STUDIO_PAGE_HEADER_VIEW_CONTRACT_VERSION = "1.3.0";

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
 * @property {Array<{label: string, href?: string}>} [breadcrumbs]
 *   added 1.3.0, default []. Section crumb linking to the section
 *   page, then the current page title; see
 *   components/kit/breadcrumbs/KitBreadcrumbs.contract.js.
 */

export const STUDIO_PAGE_HEADER_VIEW_DEFAULTS = Object.freeze({
  eyebrow: "",
  title: "",
  description: "",
  children: null,
  breadcrumbs: [],
});
