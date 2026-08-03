import { Search, UserRound, X } from "lucide-react";

export default function DefaultPlayerCharacterPickerModalView({
  searchQuery = "",
  playerCharacters = [],
  isLoading = false,
  errorMessage = "",
  onSearchQueryChange = null,
  onClose = null,
  onChoosePlayerCharacter = null,
}) {
  const showEmptyState =
    !isLoading && !errorMessage && playerCharacters.length === 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              Account Default
            </p>

            <h2 className="mt-2 font-display text-4xl">
              Choose Default Player Character
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              This is your preferred player identity for new story rooms. Public
              Player Characters remain vanity/showcase objects to everyone else;
              only the owner can use them as a playable identity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-5">
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChange?.(event.target.value)
              }
              placeholder="Search your player characters..."
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </label>

          {isLoading ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
              Loading player characters...
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
              No Player Character creations found.
            </p>
          ) : null}

          {playerCharacters.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {playerCharacters.map((playerCharacter, index) => (
                <button
                  key={playerCharacter?.id || index}
                  type="button"
                  onClick={() =>
                    onChoosePlayerCharacter?.(playerCharacter?.id)
                  }
                  className={`overflow-hidden rounded-2xl border bg-black/35 text-left transition hover:border-[var(--muted-gold)]/45 ${
                    playerCharacter?.isSelected
                      ? "border-[var(--muted-gold)]/60"
                      : "border-white/10"
                  }`}
                >
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${playerCharacter?.displayImageUrl || ""})`,
                    }}
                    role="img"
                    aria-label={
                      playerCharacter?.imageAltText ||
                      "Player Character portrait"
                    }
                  />

                  <div className="p-4">
                    <p className="font-display text-2xl">
                      {playerCharacter?.title || "Untitled PC"}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                      {playerCharacter?.description || "No description."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        <UserRound size={11} />
                        Player Character
                      </span>

                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        {playerCharacter?.isSelected
                          ? "Current Default"
                          : "Selectable"}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
