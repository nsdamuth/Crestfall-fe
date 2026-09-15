"use client";

// Re-export shim (ASSET-FOLDERS AF2, 14 Sep 2026): the glyph and its
// bare icon class moved unchanged to the Kit as KitPanelToggle 1.0.0
// (components/kit/panel-toggle). This path stays so the chat shell
// and the sidebar collapse toggle keep their existing import lines
// and render byte-identical.
export { default, BARE_ICON_BUTTON_CLASS } from "@/components/kit/panel-toggle/KitPanelToggle.view";
