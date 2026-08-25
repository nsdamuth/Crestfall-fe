"use client";

import { Plus } from "lucide-react";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

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
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>{variant.title}</p>
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
        <p className="mt-4 text-sm leading-6 text-[var(--ink-faint)]">{variant.emptyMessage}</p>
      )}
    </div>
  );
}
