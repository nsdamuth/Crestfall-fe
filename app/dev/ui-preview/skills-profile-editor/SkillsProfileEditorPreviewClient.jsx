"use client";

import SkillsProfileEditor from "@/components/studio/create/skills/SkillsProfileEditor";
import { skillsProfileEditorLockedFixture } from "@/components/studio/create/skills/skills-profile-editor/SkillsProfileEditor.fixtures";

export default function SkillsProfileEditorPreviewClient() {
  return (
    <div className="mx-auto max-w-7xl p-8">
      <SkillsProfileEditor value={skillsProfileEditorLockedFixture} onChange={() => {}} />
    </div>
  );
}
