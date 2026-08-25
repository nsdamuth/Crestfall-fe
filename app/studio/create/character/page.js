import StudioBackLink from "@/components/studio/StudioBackLink";
import CharacterCreator from "@/components/studio/create/character/CharacterCreator";

export default function CreateCharacterPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=characters" label="Back to Full Studio" />
      <CharacterCreator />
    </div>
  );
}