import {
  Plus,
  X
} from "lucide-react";

export default function SelectedCharactersPanelView({
  characters = [],
  onOpenCharacterPicker = null,
  onRemoveCharacter = null,
}) {
  const safeCharacters = Array.isArray(characters) ? characters : [];

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Characters
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Select one or more characters for this Story.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenCharacterPicker?.()}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Plus size={14} />
          Add Character
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {safeCharacters.length ? (
          safeCharacters.map((character) => (
            <div
              key={character.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 p-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 font-display text-xl text-[var(--muted-gold)]">
                {character.initial || "?"}
              </div>

              <div>
                <p className="text-sm text-[var(--foreground)]">
                  {character.title || "Untitled Character"}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {character.subtitle || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveCharacter?.(character.id)}
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--status-danger)] transition hover:bg-white/5"
                aria-label={`Remove ${character.title || "character"}`}
              >
                <X size={14} />
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">No characters selected.</p>
        )}
      </div>
    </div>
  );
}
