import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function StorylineFieldsSectionView({
  activeSection = "sequence",
  sectionEyebrow = "Sequence",
  sectionTitle = "Ordered Stories and Scenarios",
  sectionDescription = "",
  editorSlot = null,
} = {}) {
  if (!["sequence", "transitions", "openWorld"].includes(activeSection)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      {editorSlot || (
        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-8 text-center text-sm leading-6 text-[var(--ink-dim)]">
          Storyline editor content is provided by the application shell.
        </div>
      )}
    </div>
  );
}
