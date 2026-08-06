export default function CharacterPreviewView({
  displayInitial = "C",
  characterName = "Unnamed Character",
  characterSubtitle = "Private Draft",
  speciesLabel = "Species not chosen yet.",
  genderPresentationLabel = "Gender presentation not chosen yet.",
  clothingStyleLabel = "Clothing style not chosen yet.",
} = {}) {
  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
      <div className="flex flex-col gap-[var(--space-6)] sm:flex-row">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-gradient-to-br from-black via-black/70 to-[var(--gold-ornament)]/10 sm:w-48 sm:flex-none">
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <p className="font-display text-5xl text-[var(--gold-ornament)]">
                {displayInitial}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--ink-dim)]">
                Preview Pending
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-4xl">{characterName}</h2>

          <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            {characterSubtitle}
          </p>

          <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--ink-dim)]">
            <p>{speciesLabel}</p>
            <p>{genderPresentationLabel}</p>
            <p>{clothingStyleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
