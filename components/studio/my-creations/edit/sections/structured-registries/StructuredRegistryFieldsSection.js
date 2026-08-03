"use client";

import StructuredRegistryBuilder from "@/components/studio/create/structured-registry/StructuredRegistryBuilder";
import { isStructuredRegistryType } from "@/components/studio/registries/structuredRegistryConfigs";

const STRUCTURED_REGISTRY_TABS = new Set([
  "overview",
  "entries",
  "relationships",
  "rules",
  "prompt",
  "review",
]);

export default function StructuredRegistryFieldsSection({
  section = "overview",
  form,
  updateField,
}) {
  const registryType = String(form?.type || "").toUpperCase();

  if (!isStructuredRegistryType(registryType)) {
    return null;
  }

  return (
    <StructuredRegistryBuilder
      registryType={registryType}
      mode="edit"
      initialTitle={form.title || ""}
      initialDescription={form.description || ""}
      initialData={form.data || {}}
      activeTab={STRUCTURED_REGISTRY_TABS.has(section) ? section : "overview"}
      hideTabs
      onChange={({ title, description, data }) => {
        updateField("title", title);
        updateField("description", description);
        updateField("data", data);
      }}
    />
  );
}