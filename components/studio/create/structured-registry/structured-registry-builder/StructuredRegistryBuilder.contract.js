export const STRUCTURED_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION =
  "structured-registry-builder.view.v1";

export const STRUCTURED_REGISTRY_BUILDER_TABS = Object.freeze([
  Object.freeze({ id: "overview", label: "Overview", iconKey: "overview" }),
  Object.freeze({ id: "entries", label: "Entries", iconKey: "entries" }),
  Object.freeze({
    id: "relationships",
    label: "Relationships",
    iconKey: "relationships",
  }),
  Object.freeze({ id: "rules", label: "Rules", iconKey: "rules" }),
  Object.freeze({
    id: "prompt",
    label: "Prompt Guidance",
    iconKey: "prompt",
  }),
  Object.freeze({ id: "review", label: "Review", iconKey: "review" }),
]);

export const STRUCTURED_REGISTRY_BUILDER_TAB_IDS = Object.freeze(
  STRUCTURED_REGISTRY_BUILDER_TABS.map((tab) => tab.id)
);

export function buildStructuredRegistryBuilderTabs(activeTab) {
  return STRUCTURED_REGISTRY_BUILDER_TABS.map((tab) => ({
    ...tab,
    active: tab.id === activeTab,
  }));
}
