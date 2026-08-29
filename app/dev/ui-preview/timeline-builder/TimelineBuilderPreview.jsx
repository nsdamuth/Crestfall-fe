"use client";

import { useState } from "react";
import TimelineBuilderView from "@/components/studio/create/timeline/timeline-builder/TimelineBuilder.view";
import { timelineBuilderFixture } from "@/components/studio/create/timeline/timeline-builder/TimelineBuilder.fixtures";
import {
  TIMELINE_DRAFT_VISIBILITY_OPTIONS,
  TIMELINE_SORT_OPTIONS,
} from "@/components/studio/create/timeline/timeline-builder/TimelineBuilder.contract";

export default function TimelineBuilderPreview() {
  const [fixture, setFixture] = useState(timelineBuilderFixture);

  return (
    <TimelineBuilderView
      {...fixture}
      visibilityOptions={TIMELINE_DRAFT_VISIBILITY_OPTIONS}
      sortOptions={TIMELINE_SORT_OPTIONS}
      entryCount={fixture.entries.length}
      unplacedCount={fixture.entries.filter((entry) => entry.isUnplaced).length}
      saveDisabled={false}
      saveStatus="idle"
      saveMessage="Fixture-driven preview. Nothing is persisted."
      onUpdateField={(field, value) => setFixture((current) => ({ ...current, [field]: value }))}
      onOpenLorePicker={() => {}}
      onRemoveLore={(id) =>
        setFixture((current) => ({
          ...current,
          entries: current.entries.filter((entry) => entry.id !== id),
        }))
      }
      onUpdateOrderOverride={(id, value) =>
        setFixture((current) => ({
          ...current,
          entries: current.entries.map((entry) =>
            entry.id === id
              ? { ...entry, orderOverride: value === "" ? null : Number(value) }
              : entry
          ),
        }))
      }
      onSave={() => {}}
      onBackToLore={() => {}}
    />
  );
}
