import { Search, X } from "lucide-react";

export default function RegistryLinkedCreationPickerModalView({
  title = "Link Creation",
  body = "Choose a creation to link to this registry entry.",
  searchQuery = "",
  creations = [],
  isLoading = false,
  errorMessage = "",
  onSearchQueryChange = null,
  onClose = null,
  onChooseCreation = null,
}) {
  const showEmptyState =
    !isLoading && !errorMessage && creations.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Registry Links
            </p>

            <h2 className="mt-2 font-display text-4xl">{title}</h2>

            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              {body}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChange?.(event.target.value)
              }
              placeholder="Search creations..."
              className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
            />
          </label>

          {isLoading ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
              Loading creations...
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
              No matching creations found.
            </p>
          ) : null}

          {creations.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {creations.map((creation, index) => (
                <button
                  key={creation?.id || index}
                  type="button"
                  onClick={() => onChooseCreation?.(creation?.id)}
                  aria-pressed={Boolean(creation?.isSelected)}
                  className={`overflow-hidden rounded-[var(--radius-md)] border bg-black/35 text-left transition hover:border-[var(--gold-ornament)]/45 ${
                    creation?.isSelected
                      ? "border-[var(--gold-ornament)]/60"
                      : "border-white/10"
                  }`}
                >
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${creation?.displayImageUrl || ""})`,
                    }}
                    role="img"
                    aria-label={
                      creation?.imageAltText || "Linked creation image"
                    }
                  />

                  <div className="p-4">
                    <p className="font-display text-2xl">
                      {creation?.title || "Untitled Creation"}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
                      {creation?.subtitle || "Creation"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                        {creation?.typeLabel || "Creation"}
                      </span>

                      {creation?.isSelected ? (
                        <span className="rounded-full border border-[var(--gold-ornament)]/40 bg-[var(--gold-ornament)]/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
                          Linked
                        </span>
                      ) : null}
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
