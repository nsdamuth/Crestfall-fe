import { redirect } from "next/navigation";

export default async function LegacyEditTimelineCompatibilityPage({ params }) {
  const resolved = await params;
  const timelineId = String(resolved?.id || "").trim();

  if (!timelineId) {
    redirect("/studio/v2/lore");
  }

  redirect(`/studio/v2/editor/${encodeURIComponent(timelineId)}?origin=timeline`);
}
