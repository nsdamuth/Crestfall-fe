import KitModalFrame from "@/components/kit/KitModalFrame";

// ED1d Defect 5: migrated off a hand-rolled fixed overlay onto
// KitModalFrame at the ruled standard size (StorylineReferencePickerModal.view.jsx's
// `max-w-4xl` + `max-h-[100dvh] ... min-[700px]:max-h-[92dvh]`
// pattern), which also gains the ruled full-screen-under-700px
// maximize this shell previously had no mobile behavior for at all.
// Shared by every NPC Registry entry/relationship/knowledge/alias
// modal; content below is unchanged.
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
        <div className="p-5 pr-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            NPC Registry
          </p>
          <h2 className="mt-2 font-display text-4xl">{title}</h2>
        </div>
        {/* B1 fade divider, never edge-to-edge; replaces the prior
            hardcoded border-white/10 literal. */}
        <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />

        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </KitModalFrame>
  );
}
