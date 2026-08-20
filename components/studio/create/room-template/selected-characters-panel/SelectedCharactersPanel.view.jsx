import {
  Plus,
  X
} from "lucide-react";

export default function SelectedCharactersPanelView({
  characters = [],
  lifecycleOptions = [],
  onOpenCharacterPicker = null,
  onRemoveCharacter = null,
  onChangeCharacterLifecycle = null,
}) {
  const safeCharacters = Array.isArray(characters) ? characters : [];

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Characters
          </p>
          <p className="mt-1 text-sm text-[var(--ink-dim)]">
            Select Story cast and choose whether each Character persists or is opening-only.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenCharacterPicker?.()}
          className="cf-btn cf-btn--primary"
        >
          <Plus size={14} />
          Add character
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {safeCharacters.length ? (
          safeCharacters.map((character) => (
            <div
              key={character.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 p-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 font-display text-xl text-[var(--gold-ornament)]">
                {character.initial || "?"}
              </div>

              <div className="min-w-[220px] flex-1">
                <p className="text-sm text-[var(--ink)]">
                  {character.title || "Untitled Character"}
                </p>
                <p className="text-xs text-[var(--ink-dim)]">
                  {character.subtitle || ""}
                </p>

                <label className="mt-2 block text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
                  Story lifecycle
                  <select
                    value={character.lifecycleKind || "STORY_PINNED"}
                    onChange={(event) =>
                      onChangeCharacterLifecycle?.(
                        character.id,
                        event.target.value
                      )
                    }
                    className="mt-1 block w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-xs normal-case tracking-normal text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]/50"
                  >
                    {(Array.isArray(lifecycleOptions) ? lifecycleOptions : []).map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-[var(--ink-dim)]">
                  {(Array.isArray(lifecycleOptions) ? lifecycleOptions : []).find(
                    (option) =>
                      option.value ===
                      (character.lifecycleKind || "STORY_PINNED")
                  )?.description || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveCharacter?.(character.id)}
                className="cf-btn cf-btn--danger cf-btn--sm"
                aria-label={`Remove ${character.title || "character"}`}
              >
                <X size={14} />
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--ink-dim)]">No characters selected.</p>
        )}
      </div>
    </div>
  );
}
