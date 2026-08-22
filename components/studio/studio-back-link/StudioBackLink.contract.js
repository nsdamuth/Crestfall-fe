export const STUDIO_BACK_LINK_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable Studio back-link contract.
 *
 * @typedef {Object} StudioBackLinkViewProps
 * @property {string} [href] Destination supplied by the owning route.
 * @property {string} [label] Visible link label.
 * @property {string} [className] Optional presentation classes supplied by the host.
 * @property {import("react").ElementType} [LinkComponent] doc-only addition
 *   (ED1G sw12): link/anchor component injected by the host, defaults to
 *   "a" in the View. Already read by the View, undeclared here. No
 *   version bump.
 */

export const STUDIO_BACK_LINK_VIEW_DEFAULTS = Object.freeze({
  href: "/studio",
  label: "Back",
  className: "",
});
