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
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[2px]">
      <section className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-[var(--space-3)] border-b border-[var(--line-whisper)] py-[var(--space-3)] px-[var(--space-4)]">
          <div>
            <p className="text-[var(--text-ui)] leading-[var(--lh-ui)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Account Default
            </p>

            <h2 className="mt-2 font-display text-4xl">
              Choose Default Player Character
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              This is your preferred player identity for new story rooms. Public
              Player Characters remain vanity/showcase objects to everyone else;
              only the owner can use them as a playable identity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="inline-flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-5">
          <label className="flex items-center gap-3 rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChange?.(event.target.value)
              }
              placeholder="Search your player characters..."
              className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
            />
          </label>

          {isLoading ? (
            <p className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
              Loading player characters...
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-4 text-sm text-[var(--status-danger)]">
              {errorMessage}
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="mt-5 rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
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
                  className={`overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] text-left transition hover:border-[var(--gold-ornament)]/45 ${
                    playerCharacter?.isSelected
                      ? "border-[var(--gold-ornament)]/60"
                      : "border-[var(--line)]"
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

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
                      {playerCharacter?.description || "No description."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex h-[var(--space-6)] items-center gap-1 rounded-full bg-[var(--tag-bed-canvas)] px-[var(--space-3)] py-0 text-[var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-bright)]">
                        <UserRound size={11} />
                        Player Character
                      </span>

                      <span className="inline-flex h-[var(--space-6)] items-center rounded-full bg-[var(--tag-bed-canvas)] px-[var(--space-3)] py-0 text-[var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-dim)]">
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
