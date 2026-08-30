export const STUDIO_SHELL_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the studio canvas frame that wraps all 54 studio
 * routes (docs/SHELL-INVENTORY.md).
 *
 * The View owns the canvas background, the sidebar/content flex layout,
 * and page padding. It does not own account context, auth, or the data
 * behind the sidebar, mobile nav, or top bar; those render into slots
 * supplied by the Binding Shell.
 *
 * @typedef {Object} StudioShellViewProps
 * @property {import("react").ReactNode} sidebarSlot
 * @property {import("react").ReactNode} mobileNavSlot
 * @property {import("react").ReactNode} topBarSlot
 * @property {boolean} reserveMobileDockSpace Whether mobile page content reserves the bottom-dock clearance. Story Chat disables it because the composer replaces the dock.
 * @property {import("react").ReactNode} children
 */

export {};
