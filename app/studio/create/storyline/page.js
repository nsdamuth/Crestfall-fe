import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StorylineBuilderShell from "@/components/studio/storylines/StorylineBuilderShell";

export default function CreateStorylinePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=stories" label="Back to Full Studio" />
      <StudioPageHeader eyebrow="Create" title="Create Storyline">
        Link Stories and Scenarios into an authored continuity path. Each completed
        node may return the same chat to open-world play until the next trigger is
        satisfied.
      </StudioPageHeader>
      <StorylineBuilderShell />
    </div>
  );
}
