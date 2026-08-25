import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StructuredRegistryBuilder from "@/components/studio/create/structured-registry/StructuredRegistryBuilder";

export default function CreateOrganizationRegistryPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=worlds" label="Back to Full Studio" />

      <StudioPageHeader eyebrow="Institution Spine" title="Organization Registry">
        Create a reusable organization spine for companies, agencies, clubs,
        schools, churches, teams, departments, branches, shell companies, and
        formal groups.
      </StudioPageHeader>

      <StructuredRegistryBuilder registryType="ORGANIZATION_REGISTRY" />
    </div>
  );
}