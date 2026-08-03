import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StatsPoolsBuilderShell from "@/components/studio/create/stats-pools/StatsPoolsBuilderShell";

export default function CreateStatsPoolsProfilePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />
      <StudioPageHeader
        eyebrow="Actor State Definitions"
        title="Create Stats & Pools Profile"
      >
        Define reusable Stats, HP, Stamina, Mana, modifiers, and conditions for
        later attachment through an Actor Mechanics Profile.
      </StudioPageHeader>
      <StatsPoolsBuilderShell />
    </div>
  );
}
