"use client";

import { Camera, ImageOff, Library, Sparkles } from "lucide-react";

import KitBadge from "@/components/kit/KitBadge";

function PrimaryArt({ imageSrc, typeIcon: TypeIcon }) {
  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt=""
        className="aspect-[3/4] w-[148px] flex-none rounded-[var(--radius-md)] border border-[var(--line)] object-cover sm:w-[232px]"
      />
    );
  }

  const Icon = TypeIcon || ImageOff;

  return (
    <div
      aria-hidden="true"
      className="flex aspect-[3/4] w-[148px] flex-none items-center justify-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-faint)] sm:w-[232px]"
    >
      <Icon size={48} />
    </div>
  );
}

function SlotRail({ slots, onSelectSlot }) {
  if (!slots?.length) return null;

  return (
    <div className="flex flex-none flex-col gap-[var(--space-2)]">
      {slots.map((slot) => (
        <button
          key={slot.id || slot.index}
          type="button"
          onClick={() => onSelectSlot?.(slot.index)}
          aria-label={`Show ${slot.label || `slot ${slot.index + 1}`}`}
          aria-pressed={Boolean(slot.isActive)}
          className={`kit-focus aspect-[3/4] w-[56px] overflow-hidden rounded-[var(--radius-sm)] border transition sm:w-[64px] ${
            slot.isActive
              ? "border-[var(--gold-action)]"
              : "border-[var(--line-whisper)] hover:border-[var(--line-strong)]"
          }`}
        >
          {slot.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slot.imageSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-[var(--surface-1)] text-[var(--ink-faint)]">
              <ImageOff size={20} aria-hidden="true" />
            </span>
          )}
        </button>
      ))}
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
      <div className="flex items-start gap-[var(--space-2)] sm:gap-[var(--space-3)]">
        <PrimaryArt imageSrc={primaryImageSrc} typeIcon={typeIcon} />
        <SlotRail slots={slots} onSelectSlot={onSelectSlot} />
      </div>

      <div className="min-w-0 flex-1 basis-[240px]">
        {typeLabel ? (
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
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

        <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
          {onReplaceActiveSlot ? (
            <button
              type="button"
              onClick={() => onReplaceActiveSlot?.()}
              className="cf-btn cf-btn--secondary"
            >
              <Library size={14} aria-hidden="true" />
              Replace image
            </button>
          ) : null}
          {generateHref ? (
            <a href={generateHref} className="cf-btn cf-btn--secondary">
              <Sparkles size={14} aria-hidden="true" />
              Generate more
            </a>
          ) : null}
          {imageLibraryHref ? (
            <a href={imageLibraryHref} className="cf-btn cf-btn--secondary">
              <Camera size={14} aria-hidden="true" />
              Image library
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
