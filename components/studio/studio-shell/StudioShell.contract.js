export const STUDIO_SHELL_VIEW_CONTRACT_VERSION = "1.4.0";

/**
 * Stable UI boundary for the studio canvas frame that wraps all 54 studio
 * routes (docs/SHELL-INVENTORY.md).
 *
 * The View owns the canvas background, the sidebar/content flex layout,
 * and page padding. It does not own account context, auth, or the data
 * behind the sidebar, mobile nav, or top bar; those render into slots
 * supplied by the Binding Shell.
 *
 * 1.3.0, package MOBILE-SHELLS, additive and prop-free: the root <main>
 * carries the data-studio-shell attribute, the scope hook for the mobile
 * shell law in app/design-system.css. No prop changed.
 *
 * 1.4.0, fe/chat-studio item 1 (12 Sep 2026), additive: `flush` drops
 * every gutter and the dock clearance from the content section and
 * makes it a min-h-0 flex column, so a full-screen workspace (story
 * chat) sits flush to the viewport edges. The Binding Shell also
 * mounts StudioChromeProvider (one left panel at a time) inside the
 * account provider. Off is byte-identical to 1.3.0.
 *
 * @typedef {Object} StudioShellViewProps
 * @property {import("react").ReactNode} sidebarSlot
 * @property {import("react").ReactNode} mobileNavSlot
 * @property {import("react").ReactNode} topBarSlot
 * @property {boolean} reserveMobileDockSpace Whether mobile page content reserves the bottom-dock clearance. Story Chat disables it because the composer replaces the dock.
 * @property {boolean} flush Whether the content section drops its gutters and dock clearance for a full-screen workspace (story chat).
 * @property {"dark"|"light"} themeMode Studio presentation mode; light is the Eggshell theme.
 * @property {import("react").ReactNode} children
 */

export {};
