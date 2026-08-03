"use client";

import StorylineNodeListEditor from "@/components/studio/storylines/StorylineNodeListEditor";
import StorylineOpenWorldSettings from "@/components/studio/storylines/StorylineOpenWorldSettings";

import StorylineBuilderShellView from "./storyline-builder-shell/StorylineBuilderShell.view";
import { useStorylineBuilderShellViewModel } from "./storyline-builder-shell/useStorylineBuilderShellViewModel";

export default function StorylineBuilderShell(props) {
  const {
    viewProps,
    nodeEditorProps,
    openWorldSettingsProps,
  } = useStorylineBuilderShellViewModel(props);

  return (
    <StorylineBuilderShellView
      {...viewProps}
      nodeEditorSlot={<StorylineNodeListEditor {...nodeEditorProps} />}
      openWorldSettingsSlot={
        <StorylineOpenWorldSettings {...openWorldSettingsProps} />
      }
    />
  );
}
