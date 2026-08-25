import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import WardrobeBuilder from "@/components/studio/create/wardrobe/WardrobeBuilder";

export default function CreateWardrobePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=characters" label="Back to Full Studio" />

      <StudioPageHeader eyebrow="Character Clothing" title="Wardrobe">
        Create a reusable wardrobe made from outfit presets. Wardrobes will be
        usable as character default clothing sources for chat continuity and
        image generation.
      </StudioPageHeader>

      <WardrobeBuilder />
    </div>
  );
}