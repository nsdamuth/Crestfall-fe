"use client";

import StorylineOpenWorldSettingsView from "./storyline-open-world-settings/StorylineOpenWorldSettings.view";
import { useStorylineOpenWorldSettingsViewModel } from "./storyline-open-world-settings/useStorylineOpenWorldSettingsViewModel";

export default function StorylineOpenWorldSettings(props) {
  const viewProps = useStorylineOpenWorldSettingsViewModel(props);

  return <StorylineOpenWorldSettingsView {...viewProps} />;
}
