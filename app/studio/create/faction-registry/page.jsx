import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StructuredRegistryBuilder from "@/components/studio/create/structured-registry/StructuredRegistryBuilder";

export default function CreateFactionRegistryPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />

      <StudioPageHeader eyebrow="Power Spine" title="Faction Registry">
        Create a reusable faction-continuity spine for alliances, rivalries,
        territory, influence, leadership, knowledge, and pressure.
      </StudioPageHeader>

      <StructuredRegistryBuilder registryType="FACTION_REGISTRY" />
    </div>
  );
}