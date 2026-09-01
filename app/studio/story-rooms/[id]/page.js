import StoryChatPage from "@/app/studio/v2/stories/[id]/StoryChatPage";

/**
 * Compatibility route for existing Story Room bookmarks and inbound links.
 * The V2 route owns Story Chat; both routes mount the exact same implementation.
 */
export default async function LegacyStoryRoomRoute({ params }) {
  const { id } = await params;

  return <StoryChatPage id={id} />;
}
