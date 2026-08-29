"use client";

import TimelineReaderView from "./timeline-reader/TimelineReader.view";
import { useTimelineReaderViewModel } from "./timeline-reader/useTimelineReaderViewModel";

export default function TimelineReaderShell({ timelineId, initialCreation = null }) {
  const viewProps = useTimelineReaderViewModel({ timelineId, initialCreation });
  return <TimelineReaderView {...viewProps} />;
}
