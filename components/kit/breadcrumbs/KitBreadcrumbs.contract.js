export const KIT_BREADCRUMBS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared breadcrumb kit piece,
 * RULED 12 Sep 2026 (eight-fix package, FIX 4). One row on every v2
 * page deeper than a primary sidebar page: the section name linking
 * to the section page, then the current page title. It renders in
 * the page header between the description line and the divider
 * (StudioPageHeader 1.3.0 `breadcrumbs` prop) or, on a page with its
 * own header recipe, directly above that header.
 *
 * The View does not know the route tree, the current pathname, or
 * how a section is chosen; the caller supplies display-ready items.
 * The last item is always the current page and never renders as a
 * link, whatever `href` it carries.
 *
 * Every crumb is a 44px tap target (`--control-md`). The row is one
 * line at every width: link crumbs cap their width and truncate, the
 * current crumb takes the remaining width and truncates with an
 * ellipsis, so a long title never wraps and never causes horizontal
 * scroll.
 *
 * @typedef {Object} KitBreadcrumbsItem
 * @property {string} label display text
 * @property {string} [href] link target; ignored on the last item
 *
 * @typedef {Object} KitBreadcrumbsViewProps
 * @property {KitBreadcrumbsItem[]} items in path order, root first;
 *   fewer than one valid item renders nothing
 * @property {string} [ariaLabel] nav landmark label, default
 *   "Breadcrumb"
 * @property {import("react").ElementType} [LinkComponent] the anchor
 *   element for link crumbs; the shell injects next/link, the
 *   portable View defaults to "a"
 */

export {};
