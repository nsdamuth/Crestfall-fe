import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import SkillsProfileBuilderShell from "@/components/studio/create/skills/SkillsProfileBuilderShell";

export default function CreateSkillsProfilePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=mechanics" label="Back to Full Studio" />
      <StudioPageHeader
        eyebrow="Actor Skill Definitions"
        title="Create Skills Profile"
      >
        Define reusable Skills, proficiency ranks, point costs, prerequisites,
        and grants for attachment through an Actor Mechanics Profile.
      </StudioPageHeader>
      <SkillsProfileBuilderShell />
    </div>
  );
}
