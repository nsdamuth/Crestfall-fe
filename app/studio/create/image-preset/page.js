import StudioPageHeader from "@/components/studio/StudioPageHeader";
import AssetBuilderShell from "@/components/studio/create/assets/AssetBuilderShell";
import { assetBuilderConfigs } from "@/components/studio/create/assets/assetBuilderConfigs";
import StudioBackLink from "@/components/studio/StudioBackLink";

export default function CreateImagePresetPage() {
  const config = assetBuilderConfigs.imagePreset;

  return (
    <div className="space-y-6">
        <StudioBackLink href="/studio/create" label="Back to Create" />
      <StudioPageHeader eyebrow={config.eyebrow} title={config.title}>
        {config.description}
      </StudioPageHeader>
      <AssetBuilderShell config={config} />
    </div>
  );
}