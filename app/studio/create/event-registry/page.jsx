import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StructuredRegistryBuilder from "@/components/studio/create/structured-registry/StructuredRegistryBuilder";

export default function CreateEventRegistryPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=worlds" label="Back to Full Studio" />

      <StudioPageHeader eyebrow="Continuity Ledger" title="Event Registry">
        Create a reusable event ledger for incidents, scandals, holidays,
        conflicts, consequences, discoveries, and world-shaping history.
      </StudioPageHeader>

      <StructuredRegistryBuilder registryType="EVENT_REGISTRY" />
    </div>
  );
}