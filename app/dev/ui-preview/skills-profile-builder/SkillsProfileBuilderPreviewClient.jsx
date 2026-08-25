"use client";

import SkillsProfileBuilderView from "@/components/studio/create/skills/skills-profile-builder/SkillsProfileBuilder.view";
import SkillsProfileEditor from "@/components/studio/create/skills/SkillsProfileEditor";
import { createSkillsProfileBuilderDraft } from "@/components/studio/create/skills/skills-profile-builder/SkillsProfileBuilder.contract";

export default function SkillsProfileBuilderPreviewClient() {
  const draft = createSkillsProfileBuilderDraft();
  return (
    <div className="mx-auto max-w-7xl p-8">
      <SkillsProfileBuilderView
        title={draft.title}
        description={draft.description}
        visibility={draft.visibility}
        contentRating={draft.contentRating}
        visibilityOptions={[{ value: "PRIVATE", label: "Private" }]}
        contentRatingOptions={[{ value: "SFW", label: "SFW" }]}
        editor={<SkillsProfileEditor value={draft.skillsProfile} onChange={() => {}} />}
        warningCount={0}
        errorCount={0}
      />
    </div>
  );
}
