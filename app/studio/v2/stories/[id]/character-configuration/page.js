import StoryCharacterConfigurationShell from "@/components/studio/story-rooms/story-character-configuration/StoryCharacterConfigurationShell";

export default async function StoryCharacterConfigurationV2Route({ params }) {
  const { id } = await params;

  return <StoryCharacterConfigurationShell roomId={id} />;
}
