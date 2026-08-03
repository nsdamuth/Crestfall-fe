import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StoryRoomsHub from "@/components/studio/story-rooms/StoryRoomsHub";

export default function StoryRoomsPage() {
  return (
    <>
      <StudioPageHeader eyebrow="Storys" title="Storys">
        Continue active rooms, start from templates, and manage playable
        Crestfall story sessions.
      </StudioPageHeader>

      <StoryRoomsHub />
    </>
  );
}