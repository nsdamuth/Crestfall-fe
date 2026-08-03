import StudioBackLink from "@/components/studio/StudioBackLink";
import CharacterCreator from "@/components/studio/create/character/CharacterCreator";

export default function CreateCharacterPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />
      <CharacterCreator />
    </div>
  );
}