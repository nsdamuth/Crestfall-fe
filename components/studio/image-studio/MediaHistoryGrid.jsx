"use client";

import MediaHistoryGridSkin from "./MediaHistoryGridSkin";
import { useMediaHistoryGridViewModel } from "./media-history-grid/useMediaHistoryGridViewModel";

export default function MediaHistoryGrid(props) {
  const viewProps = useMediaHistoryGridViewModel(props);

  return (
    <MediaHistoryGridSkin
      {...viewProps}
      mobilePrimaryActionLabel={props.mobilePrimaryActionLabel}
      onMobilePrimaryAction={props.onMobilePrimaryAction}
    />
  );
}
