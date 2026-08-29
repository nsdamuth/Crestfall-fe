"use client";

import StoryStatusSurfacesView from "./StoryStatusSurfaces.view.jsx";
import useStoryStatusSurfacesViewModel from "./useStoryStatusSurfacesViewModel.js";

export default function StoryStatusSurfaces(props) {
  return <StoryStatusSurfacesView {...useStoryStatusSurfacesViewModel(props)} />;
}
