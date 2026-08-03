import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import ItemRegistryBuilder from "@/components/studio/create/item-registry/ItemRegistryBuilder";

export default function CreateItemRegistryPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />

      <StudioPageHeader eyebrow="Object Continuity" title="Item Registry">
        Create a reusable item-continuity spine for inventories, signature
        objects, wardrobe sets, equipment, consumables, quest objects, location
        props, and image-generation objects.
      </StudioPageHeader>

      <ItemRegistryBuilder />
    </div>
  );
}