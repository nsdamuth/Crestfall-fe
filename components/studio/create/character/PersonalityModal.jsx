"use client";

import PersonalityModalView from "./personality/PersonalityModal.view";
import { usePersonalityModalViewModel } from "./personality/usePersonalityModalViewModel";

export default function PersonalityModal(props) {
  const viewProps = usePersonalityModalViewModel(props);

  return <PersonalityModalView {...viewProps} />;
}
