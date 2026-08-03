import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StructuredRegistryBuilder from "@/components/studio/create/structured-registry/StructuredRegistryBuilder";

export default function CreateQuestRegistryPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />

      <StudioPageHeader eyebrow="Objective Spine" title="Quest Registry">
        Create a reusable quest spine for hooks, tasks, leads, requirements,
        branches, rewards, unresolved objectives, and soft side-quest logic.
      </StudioPageHeader>

      <StructuredRegistryBuilder registryType="QUEST_REGISTRY" />
    </div>
  );
}