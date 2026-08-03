export const LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION =
  "location-registry-builder.view.v1";

export const LOCATION_REGISTRY_BUILDER_TABS = Object.freeze([
  Object.freeze({ id: "overview", label: "Overview", iconKey: "overview" }),
  Object.freeze({ id: "entries", label: "Locations", iconKey: "entries" }),
  Object.freeze({
    id: "connections",
    label: "Connections",
    iconKey: "connections",
  }),
  Object.freeze({
    id: "presence",
    label: "People & Presence",
    iconKey: "presence",
  }),
  Object.freeze({
    id: "weather",
    label: "Weather Scope",
    iconKey: "weather",
  }),
  Object.freeze({
    id: "runtime",
    label: "Runtime Rules",
    iconKey: "runtime",
  }),
]);

export function buildLocationRegistryBuilderTabs(activeTab) {
  return LOCATION_REGISTRY_BUILDER_TABS.map((tab) => ({
    ...tab,
    active: tab.id === activeTab,
  }));
}
