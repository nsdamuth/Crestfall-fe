"use client";

import AbilitySpellProfileEditorView from "./ability-spell-profile-editor/AbilitySpellProfileEditor.view";
import { useAbilitySpellProfileEditorViewModel } from "./ability-spell-profile-editor/useAbilitySpellProfileEditorViewModel";
import AbilitySpellProfileJsonEditorModal from "./ability-spell-profile-json-editor/AbilitySpellProfileJsonEditorModal";

export default function AbilitySpellProfileEditor(props) {
  const { viewProps, jsonEditorProps } = useAbilitySpellProfileEditorViewModel(props);
  return (
    <>
      <AbilitySpellProfileEditorView {...viewProps} />
      {jsonEditorProps ? <AbilitySpellProfileJsonEditorModal {...jsonEditorProps} /> : null}
    </>
  );
}
