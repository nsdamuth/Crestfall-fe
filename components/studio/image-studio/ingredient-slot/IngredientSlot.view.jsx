"use client";

import { BookOpen, Sparkles, X } from "lucide-react";

export default function IngredientSlotView({
  label = "Ingredient",
  SlotIcon = null,
  isCustom = false,
  hasValue = false,
  requirementLabel = "optional",
  title = "Select…",
  subtitle = "",
  clearLabel = "Clear ingredient",
  onOpenSlot,
  onClearSlot,
}) {
  const DisplayIcon = isCustom ? BookOpen : SlotIcon || Sparkles;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenSlot?.()}
        className={`group flex aspect-square w-full flex-col items-center justify-center rounded-[var(--radius-md)] border p-3 text-center transition hover:-translate-y-0.5 ${
          isCustom
            ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10"
            : hasValue
              ? "border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10"
              : "border-white/10 bg-black/25 hover:border-[var(--gold-ornament)]/35 hover:bg-[var(--gold-ornament)]/10"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)] transition group-hover:bg-[var(--gold-ornament)]/20">
          <DisplayIcon size={20} />
        </span>

        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
          {label}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-[var(--ink-dim)]">
          {requirementLabel}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-5 text-[var(--ink)]">
          {title}
        </p>

        {subtitle ? (
          <p className="mt-1 line-clamp-1 text-xs text-[var(--ink-dim)]">
            {subtitle}
          </p>
        ) : null}
      </button>

      {hasValue ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClearSlot?.();
          }}
          className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/65 p-1.5 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
          aria-label={clearLabel}
        >
          <X size={13} />
        </button>
      ) : null}
    </div>
  );
}
