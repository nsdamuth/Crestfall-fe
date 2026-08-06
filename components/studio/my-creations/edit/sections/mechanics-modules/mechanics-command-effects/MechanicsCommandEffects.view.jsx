"use client";

import { Plus } from "lucide-react";

export default function MechanicsCommandEffectsView({
  variant,
  effects = [],
  addEffect,
  patchEffect,
  removeEffect,
  EffectCardComponent,
  argumentOptions = [],
  numericArgumentOptions = [],
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">{variant.title}</p>
          {variant.description ? <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">{variant.description}</p> : null}
        </div>
        <button type="button" onClick={addEffect} className="cf-btn cf-btn--primary cf-btn--sm">
          <Plus size={14} />
          {variant.addLabel}
        </button>
      </div>

      {effects.length ? (
        <div className="mt-4 grid gap-4">
          {effects.map((effect, effectIndex) => (
            <EffectCardComponent
              key={effect.id || effectIndex}
              effect={effect}
              effectIndex={effectIndex}
              eyebrow={variant.key === "ATTEMPT" ? "Attempt Effect" : "Effect"}
              argumentOptions={argumentOptions}
              numericArgumentOptions={numericArgumentOptions}
              onPatch={(patch) => patchEffect(effectIndex, patch)}
              onRemove={() => removeEffect(effectIndex)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">{variant.emptyMessage}</p>
      )}
    </div>
  );
}
