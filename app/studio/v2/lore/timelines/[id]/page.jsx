import { notFound } from "next/navigation";

import TimelineReaderShell from "@/components/studio/timelines/TimelineReaderShell";
import { getOwnedCreationPageData } from "@/lib/server/studio/getOwnedCreationPageData";

export default async function TimelineReaderPage({ params }) {
  const { id } = await params;
  const { creation } = await getOwnedCreationPageData(id);

  if (String(creation?.type || "").toUpperCase() !== "TIMELINE") {
    notFound();
  }

  return <TimelineReaderShell timelineId={id} initialCreation={creation} />;
}
