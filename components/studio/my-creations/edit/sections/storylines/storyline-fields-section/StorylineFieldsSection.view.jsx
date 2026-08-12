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
      <SectionHeader
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      {editorSlot || (
        <div className="rounded-[var(--radius-md)] border border-dashed border-white/15 bg-black/20 p-8 text-center text-sm leading-6 text-[var(--ink-dim)]">
          Storyline editor content is provided by the application shell.
        </div>
      )}
    </div>
  );
}

function SectionHeader({ eyebrow, title, body }) {
  return (
    <div>
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      {body ? (
        <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-dim)]">
          {body}
        </p>
      ) : null}
    </div>
  );
}
