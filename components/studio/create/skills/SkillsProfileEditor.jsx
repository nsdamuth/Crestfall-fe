"use client";

import SkillsProfileEditorView from "./skills-profile-editor/SkillsProfileEditor.view";
import { useSkillsProfileEditorViewModel } from "./skills-profile-editor/useSkillsProfileEditorViewModel";
import SkillsProfileJsonEditorModal from "./skills-profile-json-editor/SkillsProfileJsonEditorModal";

export default function SkillsProfileEditor(props) {
  const { viewProps, jsonEditorProps } = useSkillsProfileEditorViewModel(props);
  return (
    <>
      <SkillsProfileEditorView {...viewProps} />
      {jsonEditorProps ? <SkillsProfileJsonEditorModal {...jsonEditorProps} /> : null}
    </>
  );
}
