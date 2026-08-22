import KitModalFrame from "@/components/kit/KitModalFrame";

// ED1d Defect 5: migrated off a hand-rolled fixed overlay onto
// KitModalFrame at the ruled standard size (StorylineReferencePickerModal.view.jsx's
// `max-w-4xl` + `max-h-[100dvh] ... min-[700px]:max-h-[92dvh]`
// pattern), which also gains the ruled A4 bottom-anchor-at-content-
// height behavior under 700px this shell previously had no mobile
// behavior for at all. Shared by every NPC Registry entry/relationship/
// knowledge/alias modal; content below is unchanged.
export default function ModalShellView({
  title = "NPC Registry",
  onClose = null,
  children = null,
}) {
  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabel={title}
      panelClassName="w-full max-w-4xl"
    >
      <div className="flex max-h-[100dvh] flex-col min-[700px]:max-h-[92dvh]">
        <div className="p-[var(--space-5)] pr-[var(--space-16)]">
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            NPC Registry
          </p>
          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {title}
          </h2>
        </div>
        {/* B1 fade divider, never edge-to-edge; replaces the prior
            hardcoded border-white/10 literal. */}
        <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />

        <div className="min-h-0 flex-1 overflow-y-auto px-[var(--space-5)] pt-[var(--space-5)] pb-[var(--space-6)]">
          {children}
        </div>
      </div>
    </KitModalFrame>
  );
}
