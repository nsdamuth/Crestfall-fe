import StoryCharacterConfigurationShell from "@/components/studio/story-rooms/story-character-configuration/StoryCharacterConfigurationShell";

/**
 * Compatibility route for older Story Room Character Configuration links.
 * The canonical V2 and legacy routes mount the exact same binding shell.
 */
export default async function LegacyStoryCharacterConfigurationRoute({ params }) {
  const { id } = await params;

  return <StoryCharacterConfigurationShell roomId={id} />;
}
