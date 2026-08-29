"use client";

import CreationPickerView from "@/components/studio/creation-picker/creation-picker/CreationPicker.view";
import { useCreationPickerViewModel } from "@/components/studio/creation-picker/creation-picker/useCreationPickerViewModel";
import TimelineBuilderView from "./timeline-builder/TimelineBuilder.view";
import { useTimelineBuilderViewModel } from "./timeline-builder/useTimelineBuilderViewModel";

function TimelineLorePicker({ creations, onSelect, onClose, onCreateNew }) {
  const viewProps = useCreationPickerViewModel({
    creations,
    title: "Add Lore to Timeline",
    onSelect,
    onClose,
    onCreateNew,
  });

  return <CreationPickerView {...viewProps} emptyCreateLabel="Write Lore" />;
}

export default function TimelineBuilderShell({ timelineId = null } = {}) {
  const viewProps = useTimelineBuilderViewModel({ timelineId });

  return (
    <TimelineBuilderView
      {...viewProps}
      lorePickerSlot={
        viewProps.pickerOpen ? (
          <TimelineLorePicker
            creations={viewProps.pickerCreations}
            onSelect={viewProps.onAddLore}
            onClose={viewProps.onCloseLorePicker}
            onCreateNew={viewProps.onWriteLore}
          />
        ) : null
      }
    />
  );
}
