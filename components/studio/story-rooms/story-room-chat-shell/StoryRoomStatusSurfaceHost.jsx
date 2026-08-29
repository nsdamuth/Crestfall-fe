"use client";

import StoryRoomStatusSurfaceHostView from "./StoryRoomStatusSurfaceHost.view";
import useStoryRoomStatusSurfaceHostViewModel from "./useStoryRoomStatusSurfaceHostViewModel";

export default function StoryRoomStatusSurfaceHost(props) {
  return (
    <StoryRoomStatusSurfaceHostView
      {...useStoryRoomStatusSurfaceHostViewModel(props)}
    />
  );
}
