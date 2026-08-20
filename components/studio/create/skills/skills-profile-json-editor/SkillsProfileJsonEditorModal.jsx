"use client";

import SkillsProfileJsonEditorModalView from "./SkillsProfileJsonEditorModal.view";
import { useSkillsProfileJsonEditorViewModel } from "./useSkillsProfileJsonEditorViewModel";

export default function SkillsProfileJsonEditorModal(props) {
  const viewProps = useSkillsProfileJsonEditorViewModel(props);
  return <SkillsProfileJsonEditorModalView {...viewProps} />;
}
