export const ITEM_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION =
  "item-registry-builder.view.v1";

export const ITEM_REGISTRY_BUILDER_TABS = Object.freeze([
  Object.freeze({ id: "overview", label: "Overview", iconKey: "overview" }),
  Object.freeze({ id: "entries", label: "Entries", iconKey: "entries" }),
  Object.freeze({
    id: "associations",
    label: "Associations",
    iconKey: "associations",
  }),
  Object.freeze({ id: "tracking", label: "Tracking", iconKey: "tracking" }),
  Object.freeze({ id: "prompt", label: "Prompt Guidance", iconKey: "prompt" }),
  Object.freeze({ id: "review", label: "Review", iconKey: "review" }),
]);

export const ITEM_REGISTRY_BUILDER_TAB_IDS = Object.freeze(
  ITEM_REGISTRY_BUILDER_TABS.map((tab) => tab.id)
);

export function buildItemRegistryBuilderTabs(activeTab) {
  return ITEM_REGISTRY_BUILDER_TABS.map((tab) => ({
    ...tab,
    active: tab.id === activeTab,
  }));
}
