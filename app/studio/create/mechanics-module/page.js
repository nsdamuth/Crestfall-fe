import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StudioBackLink from "@/components/studio/StudioBackLink";
import MechanicsModuleBuilderShell from "@/components/studio/create/mechanics-module/MechanicsModuleBuilderShell";

export default function CreateMechanicsModulePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=mechanics" label="Back to Full Studio" />

      <StudioPageHeader eyebrow="Runtime Logic" title="Create Mechanics Module">
        Create a reusable mechanics package with meters, counters, flags,
        stages, event triggers, matched commands, effects, and guards.
      </StudioPageHeader>

      <MechanicsModuleBuilderShell />
    </div>
  );
}