import TimelineBuilderShell from "@/components/studio/create/timeline/TimelineBuilderShell";

export default async function EditTimelinePage({ params }) {
  const resolved = await params;
  return <TimelineBuilderShell timelineId={resolved?.id || null} />;
}
