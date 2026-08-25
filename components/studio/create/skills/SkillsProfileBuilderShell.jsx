"use client";

import SkillsProfileBuilderView from "./skills-profile-builder/SkillsProfileBuilder.view";
import { useSkillsProfileBuilderViewModel } from "./skills-profile-builder/useSkillsProfileBuilderViewModel";

export default function SkillsProfileBuilderShell(props) {
  const viewProps = useSkillsProfileBuilderViewModel(props);
  return <SkillsProfileBuilderView {...viewProps} />;
}
