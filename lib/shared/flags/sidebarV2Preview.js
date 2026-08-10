// Sidebar v2 preview flag, documented in docs/FRONTEND-SOP.md. Gates
// the nine-destination journey-order preview nav (CRESTFALL-PRODUCT-
// MODEL-UXUI.md section 2) on the live studio sidebar. On by default
// for dev and staging, off in production; NEXT_PUBLIC_SIDEBAR_V2_PREVIEW
// overrides either direction explicitly.
export const SIDEBAR_V2_PREVIEW_ENV_VAR = "NEXT_PUBLIC_SIDEBAR_V2_PREVIEW";

export function isSidebarV2PreviewEnabled() {
  const override = process.env.NEXT_PUBLIC_SIDEBAR_V2_PREVIEW;
  if (override === "true") return true;
  if (override === "false") return false;
  return process.env.NODE_ENV !== "production";
}
