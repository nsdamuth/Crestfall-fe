"use client";

import { useState } from "react";

import TimelineReaderView from "@/components/studio/timelines/timeline-reader/TimelineReader.view";
import {
  timelineReaderEmptyFixture,
  timelineReaderFixture,
} from "@/components/studio/timelines/timeline-reader/TimelineReader.fixtures";

export default function TimelineReaderPreviewClient() {
  const [mode, setMode] = useState("filled");
  const fixture = mode === "empty" ? timelineReaderEmptyFixture : timelineReaderFixture;

  return (
    <div className="space-y-5 p-5 sm:p-8">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="cf-btn" onClick={() => setMode("filled")}>Filled</button>
        <button type="button" className="cf-btn" onClick={() => setMode("empty")}>Empty</button>
      </div>
      <TimelineReaderView {...fixture} />
    </div>
  );
}
