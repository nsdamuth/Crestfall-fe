import StudioPageHeader from "@/components/studio/StudioPageHeader";
import AssetBuilderShell from "@/components/studio/create/assets/AssetBuilderShell";
import { assetBuilderConfigs } from "@/components/studio/create/assets/assetBuilderConfigs";
import StudioBackLink from "@/components/studio/StudioBackLink";

export default function CreateOutfitPage() {
  const config = assetBuilderConfigs.outfit;

  return (
    <div className="space-y-6">
        <StudioBackLink href="/studio?mode=full&section=characters" label="Back to Full Studio" />
      <StudioPageHeader eyebrow={config.eyebrow} title={config.title}>
        {config.description}
      </StudioPageHeader>
        
      <AssetBuilderShell config={config} />
    </div>
  );
}