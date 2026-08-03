"use client";

import LocationRegistryBuilder from "@/components/studio/create/location-registry/LocationRegistryBuilder";

const LOCATION_REGISTRY_TABS = new Set([
  "overview",
  "entries",
  "connections",
  "presence",
  "weather",
  "runtime",
]);

export default function LocationRegistryFieldsSection({
  section = "overview",
  form,
  updateField,
}) {
  if (String(form?.type || "").toUpperCase() !== "LOCATION_REGISTRY") {
    return null;
  }

  return (
    <LocationRegistryBuilder
      mode="edit"
      initialTitle={form.title || ""}
      initialDescription={form.description || ""}
      initialData={form.data || {}}
      activeTab={LOCATION_REGISTRY_TABS.has(section) ? section : "overview"}
      hideTabs
      onChange={({ title, description, data }) => {
        updateField("title", title);
        updateField("description", description);
        updateField("data", data);
      }}
    />
  );
}