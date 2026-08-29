import CharacterCreator from "@/components/studio/create/character/CharacterCreator";
import { CHARACTER_CREATOR_TYPES } from "@/components/studio/create/character/characterCreationMode";
import StudioBackLink from "@/components/studio/StudioBackLink";

/**
 * Historical Player Character creation URL retained as a compatibility entry
 * point. PLAYER_CHARACTER remains a distinct Creation type while presentation
 * and persistence reuse the shared Character creator stack.
 */
export default function CreatePlayerCharacterPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink
        href="/studio?mode=full&section=characters"
        label="Back to Full Studio"
      />
      <CharacterCreator creationType={CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER} />
    </div>
  );
}
