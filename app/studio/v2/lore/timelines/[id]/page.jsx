import { notFound } from "next/navigation";

import TimelineReaderShell from "@/components/studio/timelines/TimelineReaderShell";
import { getEditCreationPageData } from "@/lib/server/studio/getEditCreationPageData";

export default async function TimelineReaderPage({ params }) {
  const { id } = await params;
  const { creation } = await getEditCreationPageData(id);

  if (String(creation?.type || "").toUpperCase() !== "TIMELINE") {
    notFound();
  }

  return <TimelineReaderShell timelineId={id} initialCreation={creation} />;
}
