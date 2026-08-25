import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import LocationRegistryBuilder from "@/components/studio/create/location-registry/LocationRegistryBuilder";

export default function CreateLocationRegistryPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=worlds" label="Back to Full Studio" />

      <StudioPageHeader eyebrow="Place Spine" title="Location Registry">
        Create a reusable location-continuity spine for story rooms, narrators,
        districts, sublocations, and place relationships.
      </StudioPageHeader>

      <LocationRegistryBuilder />
    </div>
  );
}