"use client";

import CreationPickerView from "@/components/studio/creation-picker/creation-picker/CreationPicker.view";
import { useCreationPickerViewModel } from "@/components/studio/creation-picker/creation-picker/useCreationPickerViewModel";
import TimelineBuilderView from "./timeline-builder/TimelineBuilder.view";
import { useTimelineBuilderViewModel } from "./timeline-builder/useTimelineBuilderViewModel";

function TimelineLorePicker({ creations, onSelect, onClose }) {
  const viewProps = useCreationPickerViewModel({
    creations,
    title: "Add Lore to Timeline",
    onSelect,
    onClose,
  });

  return <CreationPickerView {...viewProps} />;
}

export default function TimelineBuilderShell({
  timelineId = null,
  initialCreation = null,
  backHref = "/studio/v2/lore",
} = {}) {
  const viewProps = useTimelineBuilderViewModel({
    timelineId,
    initialCreation,
    backHref,
  });

  return (
    <TimelineBuilderView
      {...viewProps}
      lorePickerSlot={
        viewProps.pickerOpen ? (
          <TimelineLorePicker
            creations={viewProps.pickerCreations}
            onSelect={viewProps.onAddLore}
            onClose={viewProps.onCloseLorePicker}
          />
        ) : null
      }
    />
  );
}
