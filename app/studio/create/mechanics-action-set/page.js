import StudioPageHeader from "@/components/studio/StudioPageHeader";
import MechanicsActionSetBuilderShell from "@/components/studio/create/mechanics-action-set/MechanicsActionSetBuilderShell";

export default function CreateMechanicsActionSetPage() {
  return <><StudioPageHeader eyebrow="Reusable Availability" title="Create Mechanics Action Set" description="Group first-class Mechanics Actions into a reusable set that can be made available to Stories or actor mechanics packages."/><MechanicsActionSetBuilderShell /></>;
}
