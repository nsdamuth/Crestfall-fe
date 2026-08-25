import StudioPageHeader from "@/components/studio/StudioPageHeader";
import LocationBuilderShell from "@/components/studio/create/location/LocationBuilderShell";
import { assetBuilderConfigs } from "@/components/studio/create/assets/assetBuilderConfigs";
import StudioBackLink from "@/components/studio/StudioBackLink";

export default function CreateLocationPage() {
  const config = assetBuilderConfigs.location;

  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=worlds" label="Back to Full Studio" />

      <StudioPageHeader eyebrow={config.eyebrow} title={config.title}>
        {config.description}
      </StudioPageHeader>

      <LocationBuilderShell />
    </div>
  );
}