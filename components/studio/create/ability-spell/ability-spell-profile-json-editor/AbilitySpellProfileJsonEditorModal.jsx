"use client";

import AbilitySpellProfileJsonEditorModalView from "./AbilitySpellProfileJsonEditorModal.view";
import { useAbilitySpellProfileJsonEditorViewModel } from "./useAbilitySpellProfileJsonEditorViewModel";

export default function AbilitySpellProfileJsonEditorModal(props) {
  const viewProps = useAbilitySpellProfileJsonEditorViewModel(props);
  return <AbilitySpellProfileJsonEditorModalView {...viewProps} />;
}
