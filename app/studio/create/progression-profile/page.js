import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import ProgressionProfileBuilderShell from "@/components/studio/create/progression/ProgressionProfileBuilderShell";

export default function CreateProgressionProfilePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />
      <StudioPageHeader
        eyebrow="Actor Progression Definitions"
        title="Create Progression Profile"
      >
        Define reusable cumulative-experience thresholds and level tiers for
        later attachment through an Actor Mechanics Profile.
      </StudioPageHeader>
      <ProgressionProfileBuilderShell />
    </div>
  );
}
