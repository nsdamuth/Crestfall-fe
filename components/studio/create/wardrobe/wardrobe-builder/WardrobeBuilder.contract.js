export const WARDROBE_BUILDER_VIEW_CONTRACT_VERSION =
  "wardrobe-builder.view.v1";

export const WARDROBE_BUILDER_TABS = Object.freeze([
  Object.freeze({ id: "overview", label: "Overview", iconKey: "overview" }),
  Object.freeze({ id: "entries", label: "Entries", iconKey: "entries" }),
  Object.freeze({
    id: "rules",
    label: "Selection Rules",
    iconKey: "rules",
  }),
]);

export const WARDROBE_BUILDER_TAB_IDS = Object.freeze(
  WARDROBE_BUILDER_TABS.map((tab) => tab.id)
);

export function buildWardrobeBuilderTabs(activeTab) {
  return WARDROBE_BUILDER_TABS.map((tab) => ({
    ...tab,
    active: tab.id === activeTab,
  }));
}
