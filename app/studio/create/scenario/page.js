import StudioPageHeader from "@/components/studio/StudioPageHeader";
import ScenarioBuilderShell from "@/components/studio/create/scenario/ScenarioBuilderShell";
import StudioBackLink from "@/components/studio/StudioBackLink";

export default function CreateScenarioPage() {
  return (
    <div className="space-y-6">
        <StudioBackLink href="/studio/create" label="Back to Create" />
      <StudioPageHeader eyebrow="Create" title="Create Scenario">
        Build a reusable story setup using a structured story circle, optional
        runtime guidance, and future middleware support.
      </StudioPageHeader>
        
      <ScenarioBuilderShell />
    </div>
  );
}