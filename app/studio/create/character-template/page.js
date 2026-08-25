import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import CharacterTemplateBuilder from "@/components/studio/create/character-template/CharacterTemplateBuilder";

export default function CreateCharacterTemplatePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=templates" label="Back to Full Studio" />

      <StudioPageHeader eyebrow="Reusable Blueprint" title="Character Template">
        Build a reusable character template that can prefill character creation
        fields later.
      </StudioPageHeader>

      <CharacterTemplateBuilder />
    </div>
  );
}