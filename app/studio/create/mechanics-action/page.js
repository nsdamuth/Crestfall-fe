import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StudioBackLink from "@/components/studio/StudioBackLink";
import MechanicsActionBuilderShell from "@/components/studio/create/mechanics-action/MechanicsActionBuilderShell";

export default function CreateMechanicsActionPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=mechanics" label="Back to Full Studio" />
      <StudioPageHeader eyebrow="Executable Rule" title="Create Mechanics Action">
        Create a reusable, actor-agnostic Action with authoritative value bindings,
        deterministic or dice resolution, and typed effects. Actions are not Mechanics Modules.
      </StudioPageHeader>
      <MechanicsActionBuilderShell />
    </div>
  );
}
