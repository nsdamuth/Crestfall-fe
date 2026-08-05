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
            ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10"
            : hasValue
              ? "border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10"
              : "border-white/10 bg-black/25 hover:border-[var(--muted-gold)]/35 hover:bg-[var(--muted-gold)]/10"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)] transition group-hover:bg-[var(--muted-gold)]/20">
          <DisplayIcon size={20} />
        </span>

        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          {label}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">
          {requirementLabel}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-5 text-[var(--foreground)]">
          {title}
        </p>

        {subtitle ? (
          <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">
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
          className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/65 p-1.5 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
          aria-label={clearLabel}
        >
          <X size={13} />
        </button>
      ) : null}
    </div>
  );
}
