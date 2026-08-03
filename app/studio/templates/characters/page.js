import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import CharacterTemplateGallery from "@/components/studio/templates/CharacterTemplateGallery";

export default function CharacterTemplatesPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />

      <StudioPageHeader eyebrow="Templates" title="Character Templates">
        Browse built-in and creator-made character templates.
      </StudioPageHeader>

      <CharacterTemplateGallery />
    </div>
  );
}