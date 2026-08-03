import StudioPageHeader from "@/components/studio/StudioPageHeader";
import CreationStudioExperience from "@/components/studio/create/CreationStudioExperience";

export default function CreatePage() {
  return (
    <>
      <StudioPageHeader
        eyebrow="Create"
        title="Creation Studio"
        description="Choose a focused starting point, follow a recommended build path, or open the complete Crestfall creation toolkit. Creations start private by default and can later be shared, published, or submitted for canon review."
      />

      <CreationStudioExperience />
    </>
  );
}
