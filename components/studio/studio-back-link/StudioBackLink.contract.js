export const STUDIO_BACK_LINK_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable Studio back-link contract.
 *
 * @typedef {Object} StudioBackLinkViewProps
 * @property {string} [href] Destination supplied by the owning route.
 * @property {string} [label] Visible link label.
 * @property {string} [className] Optional presentation classes supplied by the host.
 */

export const STUDIO_BACK_LINK_VIEW_DEFAULTS = Object.freeze({
  href: "/studio",
  label: "Back",
  className: "",
});
