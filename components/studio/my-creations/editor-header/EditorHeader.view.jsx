"use client";

import { Camera, ImageOff, Library, Plus, Sparkles } from "lucide-react";

import KitBadge from "@/components/kit/KitBadge";

function PrimaryArt({ imageSrc, typeIcon: TypeIcon }) {
  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt=""
        className="aspect-[3/4] min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--line)] object-cover lg:w-[300px] lg:flex-none xl:w-[320px]"
      />
    );
  }

  const Icon = TypeIcon || ImageOff;

  return (
    <div
      aria-hidden="true"
      className="flex aspect-[3/4] min-w-0 flex-1 items-center justify-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-faint)] lg:w-[300px] lg:flex-none xl:w-[320px]"
    >
      <Icon size={48} />
    </div>
  );
}

// Section 6, D10: the thumb strip shows FILLED slots plus exactly
// one add tile; empty slots never render a broken-image well. The
// active slot is marked on its own filled thumb (gold border), a
// smaller filmstrip entry beside the primary art, never a second
// copy at the same size.
function SlotRail({ slots, onSelectSlot }) {
  const filledSlots = (slots || []).filter((slot) => slot.imageSrc);
  const nextEmptySlot = (slots || []).find((slot) => !slot.imageSrc);

  if (!filledSlots.length && !nextEmptySlot) return null;

  return (
    <div className="flex flex-none flex-col gap-[var(--space-2)]">
      {filledSlots.map((slot) => (
        <button
          key={slot.id || slot.index}
          type="button"
          onClick={() => onSelectSlot?.(slot.index)}
          aria-label={`Show ${slot.label || `slot ${slot.index + 1}`}`}
          aria-pressed={Boolean(slot.isActive)}
          className={`aspect-[3/4] w-[56px] overflow-hidden rounded-[var(--radius-sm)] border transition sm:w-[64px] ${
            slot.isActive
              ? "border-[var(--gold-action)]"
              : "border-[var(--line-whisper)] hover:border-[var(--line-strong)]"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slot.imageSrc} alt="" className="h-full w-full object-cover" />
        </button>
      ))}
      {nextEmptySlot ? (
        <button
          type="button"
          onClick={() => onSelectSlot?.(nextEmptySlot.index)}
          aria-label={`Add ${nextEmptySlot.label || `slot ${nextEmptySlot.index + 1}`}`}
          className="flex aspect-[3/4] w-[56px] items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--line-whisper)] text-[var(--ink-faint)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink-dim)] sm:w-[64px]"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default function EditorHeaderView({
  primaryImageSrc = null,
  slots = [],
  onSelectSlot = null,
  onReplaceActiveSlot = null,
  generateHref = null,
  imageLibraryHref = null,
  title = "Untitled Creation",
  typeLabel = "",
  typeIcon = null,
  visibilityLabel = "",
  visibilityVariant = "status",
  actions = null,
}) {
  return (
    <header className="flex flex-wrap items-start gap-[var(--space-4)] sm:gap-[var(--space-5)]">
      <div className="flex w-full max-w-[500px] items-start gap-[var(--space-2)] sm:gap-[var(--space-3)] lg:w-auto lg:max-w-none">
        <PrimaryArt imageSrc={primaryImageSrc} typeIcon={typeIcon} />
        <SlotRail slots={slots} onSelectSlot={onSelectSlot} />
      </div>

      <div className="min-w-0 flex-1 basis-[240px]">
        {typeLabel ? (
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {typeLabel}
          </p>
        ) : null}
        <h1 className="mt-[var(--space-1)] line-clamp-2 font-display text-[length:var(--text-title-m)] leading-[var(--lh-title-m)] text-[var(--ink)] [text-wrap:balance] sm:text-[length:var(--text-title)] sm:leading-[var(--lh-title)]">
          {title}
        </h1>
        <div className="mt-[var(--space-2)] flex flex-wrap items-center gap-[var(--space-2)]">
          {visibilityLabel ? (
            <KitBadge label={visibilityLabel} variant={visibilityVariant} surface="canvas" />
          ) : null}
          {actions}
        </div>

        {/* Section 6, D11: one seated row of equal secondary buttons;
            at 390 they stack as a full-width row each, equal width. */}
        <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] sm:flex-row sm:flex-wrap">
          {onReplaceActiveSlot ? (
            <button
              type="button"
              onClick={() => onReplaceActiveSlot?.()}
              className="cf-btn cf-btn--secondary w-full sm:w-auto"
            >
              <Library size={14} aria-hidden="true" />
              Replace image
            </button>
          ) : null}
          {generateHref ? (
            <a href={generateHref} className="cf-btn cf-btn--secondary w-full sm:w-auto">
              <Sparkles size={14} aria-hidden="true" />
              Generate more
            </a>
          ) : null}
          {imageLibraryHref ? (
            <a href={imageLibraryHref} className="cf-btn cf-btn--secondary w-full sm:w-auto">
              <Camera size={14} aria-hidden="true" />
              Image library
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
