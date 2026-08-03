import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import LoreBuilderShell from "@/components/studio/create/lore/LoreBuilderShell";

export default function CreateLorePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />

      <StudioPageHeader eyebrow="World Publication" title="Create Lore Asset">
        Author a structured, shareable sourcebook page with chapters, character
        references, and images selected from the tagged characters you own.
      </StudioPageHeader>

      <LoreBuilderShell />
    </div>
  );
}
