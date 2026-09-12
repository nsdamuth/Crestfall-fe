"use client";

// Composed on the unified modal frame (docs/BUILD-BLUEPRINT.md 2.15).
// This is the content rendered inside KitModalFrame by the binding
// shell; it owns no veil, panel, or close control of its own.
//
// Recomposed 10 Aug 2026 (kit polish 3 pass, R3/R8/R9,
// docs/SPRINT-A-POLISH-PLAN.md section 2): the carousel frame moves to
// the panel top with title/subtitle/badges in the body below it
// (chrome cannot share the art with an over-art title block); the
// footer becomes exactly four actions, Like/Save/Share/Play.
//
// Stats placement, R8: both plan-2.5 readings were built against the
// longestCopy fixture. Reading A (stacked, description full-width
// then the stat row beneath) ships: at this panel's fixed
// max-w-xl (576px) width, Reading B's side-by-side split left too
// little room for both a legible description measure and the stat
// column, and read cramped at 390 where it collapses to Reading A
// anyway. Stacking also matches every other stat row already in the
// app (the card face). Logged per R8's render-time pick.
import { useState } from "react";
import { BookOpen, Bookmark, ChevronLeft, ChevronRight, Heart, Image as ImageIcon, MessageCircle, Network, Pencil, Play, Share2 } from "lucide-react";

import KitBadgeView from "../badge/KitBadge.view";
import KitCreditsView from "../credits/KitCredits.view";
import {
  formatCreationCardMetricCount,
  normalizeCreationCardMetricEntries,
} from "../../../lib/shared/presentation/creationCardMetrics.js";

const METRIC_ICONS = Object.freeze({
  interactionCount: MessageCircle,
  likeCount: Heart,
  imageUseCount: ImageIcon,
  storyUseCount: BookOpen,
  externalCreationUseCount: Network,
});

export const KIT_ASSET_DETAIL_POPUP_TITLE_ID = "kit-asset-detail-popup-title";

const DESCRIPTION_CLAMP_THRESHOLD = 160;

function MetricRow({ metrics, compact = false, className = "" }) {
  const entries = normalizeCreationCardMetricEntries(metrics);
  const visibleEntries = compact ? entries.slice(0, 2) : entries;

  if (!visibleEntries.length) return null;

  return (
    <div
      className={`flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)] ${className}`}
    >
      {visibleEntries.map((metric) => {
        const Icon = METRIC_ICONS[metric.id];
        if (!Icon) return null;

        const value = formatCreationCardMetricCount(metric.value);
        const accessibleLabel = `${metric.label}: ${value}`;

        return (
          <span
            key={metric.id}
            className="inline-flex items-center gap-[var(--space-1)]"
            aria-label={accessibleLabel}
            title={accessibleLabel}
          >
            <Icon size={compact ? 14 : 16} aria-hidden="true" />
            <span className="tabular-nums">{value}</span>
          </span>
        );
      })}
    </div>
  );
}

function DescriptionBlock({ description }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  const shouldClamp = description.length > DESCRIPTION_CLAMP_THRESHOLD;

  return (
    <div>
      <p
        className={`max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)] ${
          shouldClamp && !expanded ? "line-clamp-3" : ""
        }`}
      >
        {description}
      </p>
      {shouldClamp && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-ornament)]"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}

// Identity attribution is rendered once. When the subtitle already contains
// "by @handle" and a structured creator is available, strip the embedded
// attribution and render the linked handle in the same line instead of
// duplicating it beneath the title.
function stripCreatorFromSubtitle(subtitle) {
  return String(subtitle || "")
    .replace(/\s*[·•-]\s*by\s+@[A-Za-z0-9_.-]+\s*$/i, "")
    .trim();
}

function IdentitySubtitle({ subtitle, creator, LinkComponent }) {
  const baseSubtitle = creator?.handle ? stripCreatorFromSubtitle(subtitle) : String(subtitle || "").trim();
  if (!baseSubtitle && !creator?.handle) return null;

  return (
    <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
      {baseSubtitle ? <span>{baseSubtitle}</span> : null}
      {baseSubtitle && creator?.handle ? <span aria-hidden="true"> · </span> : null}
      {creator?.handle ? (
        <>
          <span>by </span>
          {creator.href ? (
            <LinkComponent
              href={creator.href}
              className="text-[var(--ink)] transition-colors hover:text-[var(--gold-ornament)]"
            >
              {creator.handle}
            </LinkComponent>
          ) : (
            <span className="text-[var(--ink)]">{creator.handle}</span>
          )}
        </>
      ) : null}
    </p>
  );
}

function CreditsDisclosure({ credits, LinkComponent }) {
  const [open, setOpen] = useState(false);
  if (!credits.length) return null;

  return (
    <div className="mt-[var(--space-3)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] px-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--gold-ornament)] transition-colors hover:border-[var(--line)] hover:text-[var(--ink)] [@media(pointer:coarse)]:min-h-[var(--control-md)]"
      >
        Credits
        <ChevronRight
          size={16}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open ? (
        <div className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]">
          <KitCreditsView credits={credits} LinkComponent={LinkComponent} showHeading={false} />
        </div>
      ) : null}
    </div>
  );
}

// Tags row, restored 11 Aug 2026 (design/community-parity, parity
// audit candidate 6): matches the old preview modal's tag pill
// treatment exactly. Renders nothing when empty (the fixture model
// carries no tag data yet, CR-037); this is the honest stub.
function TagsRow({ tags }) {
  if (!tags.length) return null;

  return (
    <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-2)]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-bright)]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function CarouselArrow({ direction, onClick }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "previous" ? "Previous image" : "Next image"}
      className={`absolute top-1/2 z-[2] flex h-[var(--control-md)] w-[var(--control-md)] -translate-y-1/2 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink)] shadow-[var(--shadow-popover)] ${
        direction === "previous" ? "left-[var(--space-3)]" : "right-[var(--space-3)]"
      }`}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}

// Dot-row cap, RULED (Scale Review H, finding D3): past this many
// slides the dot row either overflows its pill or crowds unreadably
// (no `overflow-x-auto`, no wrap). Past the cap, a numeric "1 of N"
// readout replaces the dot row; the arrow buttons remain the
// navigation, matching the credits package's own collapse instinct
// at scale.
const CAROUSEL_DOTS_MAX = 8;

function CarouselDots({ count, activeIndex, catalogueIndex, onSelect }) {
  if (count > CAROUSEL_DOTS_MAX) {
    return (
      <div className="pointer-events-none absolute bottom-[var(--space-3)] left-1/2 z-[2] flex -translate-x-1/2 items-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] py-[var(--space-1)]">
        <span className="text-[length:var(--text-label)] tabular-nums leading-[var(--lh-label)] text-[var(--ink)]">
          {activeIndex + 1} of {count}
        </span>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute bottom-[var(--space-3)] left-1/2 z-[2] flex -translate-x-1/2 items-center gap-[var(--space-1)] rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-2)] py-[var(--space-1)]">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={
              index === catalogueIndex ? "View catalogue slide" : `Preview image ${index + 1}`
            }
            aria-current={isActive}
            className={`rounded-[var(--radius-full)] transition-[width] ${
              isActive
                ? "h-[var(--space-2)] w-[var(--space-6)] bg-[var(--gold-action)]"
                : "h-[var(--space-2)] w-[var(--space-2)] bg-[var(--ink-faint)]"
            }`}
          />
        );
      })}
    </div>
  );
}

function getMediaDisplaySrc(item) {
  return item?.displaySrc || item?.src || "";
}

function CatalogueSlide({ backgroundSrc, onViewCatalogue }) {
  return (
    <div className="absolute inset-0">
      {backgroundSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={backgroundSrc} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_18%]" />
      )}
      <div className="absolute inset-0 bg-[var(--scrim-strong)]" aria-hidden="true" />
      <div className="relative z-[1] flex h-full items-center justify-center p-[var(--space-4)]">
        <div className="max-w-xs rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-6)] text-center shadow-[var(--shadow-popover)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Want to see more?
          </p>
          <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            The full catalogue holds this creation&apos;s media library and details.
          </p>
          <button
            type="button"
            onClick={() => onViewCatalogue?.()}
            className="goldring cf-btn cf-btn--primary mt-[var(--space-4)]"
          >
            View catalogue
          </button>
        </div>
      </div>
    </div>
  );
}

function NoMediaFallback() {
  return (
    <div className="relative flex aspect-[5/3] w-full items-center justify-center overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface-2)]">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-16)] w-[var(--space-16)] text-[var(--ink-faint)]">
        <use href="/assets/icons/icons-v7.svg#i-59" />
      </svg>
    </div>
  );
}

function Carousel({ media, onViewCatalogue }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const catalogueIndex = media.length;
  const slideCount = media.length + 1;

  function showPrevious() {
    setActiveIndex((current) => (current <= 0 ? catalogueIndex : current - 1));
  }
  function showNext() {
    setActiveIndex((current) => (current >= catalogueIndex ? 0 : current + 1));
  }

  const isCatalogueSlide = activeIndex === catalogueIndex;

  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--canvas)]">
      {isCatalogueSlide ? (
        <CatalogueSlide backgroundSrc={getMediaDisplaySrc(media[0])} onViewCatalogue={onViewCatalogue} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getMediaDisplaySrc(media[activeIndex])}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
      )}

      <CarouselArrow direction="previous" onClick={showPrevious} />
      <CarouselArrow direction="next" onClick={showNext} />
      <CarouselDots
        count={slideCount}
        activeIndex={activeIndex}
        catalogueIndex={catalogueIndex}
        onSelect={setActiveIndex}
      />
    </div>
  );
}

function MoreFromCreator({ creator, items, onOpen }) {
  if (!Array.isArray(items) || !items.length) return null;

  const heading = creator?.handle ? `More from ${creator.handle}` : "More from this creator";

  return (
    <section className="mt-[var(--space-6)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]" aria-label={heading}>
      <div className="mb-[var(--space-3)] flex items-center justify-between gap-[var(--space-3)]">
        <h3 className="text-[length:var(--text-ui)] font-medium leading-[var(--lh-ui)] text-[var(--ink)]">
          {heading}
        </h3>
      </div>
      <div className="flex gap-[var(--space-2)] overflow-x-auto pb-[var(--space-1)]">
        {items.slice(0, 4).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen?.(item.id)}
            className="group min-w-[7.25rem] flex-1 basis-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-left transition-colors hover:border-[var(--line)]"
            aria-label={`View ${item.title || "creation"}`}
          >
            {item.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageSrc}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover object-[center_18%]"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-[var(--surface-2)] text-[length:var(--text-title)] text-[var(--ink-faint)]">
                {(item.title || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="p-[var(--space-2)]">
              <p className="line-clamp-2 text-[length:var(--text-ui)] font-medium leading-[var(--lh-ui)] text-[var(--ink)]">
                {item.title || "Untitled"}
              </p>
              <MetricRow metrics={item.metrics} compact className="mt-[var(--space-1)] gap-[var(--space-2)]" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function KitAssetDetailPopupView({
  primaryActionLabel = "Play",
  title = "",
  subtitle = "",
  creator = null,
  media = [],
  badges = [],
  metrics = [],
  description = "",
  tags = [],
  isLiked = false,
  isSaved = false,
  onLike = null,
  onPrimaryAction = null,
  onShare = null,
  onSave = null,
  onViewCatalogue = null,
  credits = [],
  creditsLinkComponent = "a",
  moreFromCreator = [],
  onOpenMoreFromCreator = null,
  // onEdit, ADDED 10 Aug 2026 (docs/STUDIO-SPEC.md section 5, Studio
  // brief S5): the single ruled edit path, own-work items only.
  // Optional; renders as a footer action only when provided, so
  // Community and every non-owner context stays pixel-stable.
  onEdit = null,
}) {
  const hasMedia = media.length > 0;
  const hasEdit = Boolean(onEdit);

  return (
    <div>
      {hasMedia ? (
        <Carousel media={media} onViewCatalogue={onViewCatalogue} />
      ) : (
        <NoMediaFallback />
      )}

      <div className="p-[var(--space-6)]">
        <div className="flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {badges.length > 0 && (
              <div className="mb-[var(--space-2)] flex flex-wrap gap-[var(--space-1)]">
                {badges.map((badge) => (
                  <KitBadgeView key={badge.label} label={badge.label} variant={badge.variant} surface="canvas" />
                ))}
              </div>
            )}

            <h2
              id={KIT_ASSET_DETAIL_POPUP_TITLE_ID}
              className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
            >
              {title || "Untitled"}
            </h2>
            <IdentitySubtitle
              subtitle={subtitle}
              creator={creator}
              LinkComponent={creditsLinkComponent}
            />
          </div>

          <MetricRow
            metrics={metrics}
            className="self-end sm:ml-[var(--space-4)] sm:shrink-0 sm:justify-end"
          />
        </div>

        <div className="mt-[var(--space-4)]">
          <DescriptionBlock description={description} />
          <TagsRow tags={tags} />
        </div>

        {onViewCatalogue ? (
          <button
            type="button"
            onClick={() => onViewCatalogue?.()}
            className="mt-[var(--space-4)] inline-flex min-h-[var(--control-md)] w-full items-center justify-center gap-[var(--space-1)] cf-btn cf-btn--secondary sm:w-auto"
          >
            View Full Catalogue
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : null}

        <CreditsDisclosure credits={credits} LinkComponent={creditsLinkComponent} />

        <div className={`mt-[var(--space-4)] grid w-full gap-[var(--space-2)] ${hasEdit ? "grid-cols-5" : "grid-cols-4"}`}>
          <button
            type="button"
            aria-pressed={isLiked}
            onClick={() => onLike?.()}
            className={`flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary ${isLiked ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]" : ""}`}
          >
            <Heart size={16} className="shrink-0" aria-hidden="true" fill={isLiked ? "currentColor" : "none"} />
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            type="button"
            aria-pressed={isSaved}
            onClick={() => onSave?.()}
            className={`flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary ${isSaved ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]" : ""}`}
          >
            <Bookmark size={16} className="shrink-0" aria-hidden="true" fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => onShare?.()}
            className="flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary"
          >
            <Share2 size={16} className="shrink-0" aria-hidden="true" />
            Share
          </button>
          {hasEdit ? (
            <button
              type="button"
              onClick={() => onEdit?.()}
              className="flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary"
            >
              <Pencil size={16} className="shrink-0" aria-hidden="true" />
              Edit
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onPrimaryAction?.()}
            className="goldring flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--primary"
          >
            <Play size={16} className="shrink-0" aria-hidden="true" />
            {primaryActionLabel}
          </button>
        </div>

        <MoreFromCreator
          creator={creator}
          items={moreFromCreator}
          onOpen={onOpenMoreFromCreator}
        />
      </div>

    </div>
  );
}
