import StudioPageHeader from "@/components/studio/StudioPageHeader";
import PlayerCharacterCreator from "@/components/studio/create/player-character/PlayerCharacterCreator";
import StudioBackLink from "@/components/studio/StudioBackLink";

export default function CreatePlayerCharacterPage() {
  return (
    <div className="space-y-6">
        <StudioBackLink href="/studio?mode=full&section=characters" label="Back to Full Studio" />
      <StudioPageHeader eyebrow="Create" title="Create Player Character">
        Build a private or public player identity to bring into stories, rooms,
        and future image generation.
      </StudioPageHeader>
        
      <PlayerCharacterCreator />
    </div>
  );
}