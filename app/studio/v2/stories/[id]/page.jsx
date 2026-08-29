import { redirect } from "next/navigation";

export default async function StoryChatV2Page({ params }) {
  const { id } = await params;

  redirect(`/studio/story-rooms/${encodeURIComponent(id)}`);
}
