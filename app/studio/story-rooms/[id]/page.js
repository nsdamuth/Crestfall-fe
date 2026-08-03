import StoryRoomChatShell from "@/components/studio/story-rooms/StoryRoomChatShell";

export default async function StoryRoomRoute({ params }) {
  const { id } = await params;

  return <StoryRoomChatShell roomId={id} />;
}