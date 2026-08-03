"use client";

import RoomTemplateSummaryView from "./room-template-summary/RoomTemplateSummary.view";
import { useRoomTemplateSummaryViewModel } from "./room-template-summary/useRoomTemplateSummaryViewModel";

export default function RoomTemplateSummary(props) {
  const viewProps = useRoomTemplateSummaryViewModel(props);

  return <RoomTemplateSummaryView {...viewProps} />;
}
