import StudioPageHeader from "@/components/studio/StudioPageHeader";
import NarratorBuilderShell from "@/components/studio/create/narrator/NarratorBuilderShell";
import StudioBackLink from "@/components/studio/StudioBackLink";

export default function CreateNarratorPage() {
  return (
    <div className="space-y-6">
        <StudioBackLink href="/studio?mode=full&section=stories" label="Back to Full Studio" />
      <StudioPageHeader eyebrow="Create" title="Create Narrator">
        Create a reusable narrator voice for story rooms, scenarios, and roleplay
        sessions.
      </StudioPageHeader>
        
      <NarratorBuilderShell />
    </div>
  );
}