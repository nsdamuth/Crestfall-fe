import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import RulesCodexBuilderShell from "@/components/studio/create/rules-codex/RulesCodexBuilderShell";

export default function CreateRulesCodexPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />

      <StudioPageHeader eyebrow="Interpretation Layer" title="Create Rules Codex">
        Create scoped guidance that explains what verified mechanics mean and
        when world-specific rules apply. Codex guidance cannot replace
        deterministic state, guards, registries, safety, or Player Character agency.
      </StudioPageHeader>

      <RulesCodexBuilderShell />
    </div>
  );
}
