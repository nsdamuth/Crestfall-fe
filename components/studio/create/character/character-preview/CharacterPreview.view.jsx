export default function CharacterPreviewView({
  displayInitial = "C",
  characterName = "Unnamed Character",
  characterSubtitle = "Private Draft",
  speciesLabel = "Species not chosen yet.",
  genderPresentationLabel = "Gender presentation not chosen yet.",
  clothingStyleLabel = "Clothing style not chosen yet.",
} = {}) {
  return (
    <aside className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
      <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-black/70 to-[var(--muted-gold)]/10">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <p className="font-display text-5xl text-[var(--muted-gold)]">
              {displayInitial}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              Preview Pending
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-6 font-display text-4xl">{characterName}</h2>

      <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        {characterSubtitle}
      </p>

      <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--muted)]">
        <p>{speciesLabel}</p>
        <p>{genderPresentationLabel}</p>
        <p>{clothingStyleLabel}</p>
      </div>
    </aside>
  );
}
