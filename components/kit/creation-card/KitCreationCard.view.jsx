"use client";

// Card law, 9 Aug 2026 (docs/BUILD-BLUEPRINT.md 2.6 second revision):
// full-bleed art in BOTH layouts, no bottom action bar anywhere.
// Actions are small overlay icons (like, save, expand); share,
// download, and delete live inside the open destination, because
// Ruling 6 (share always carries its word) and the destructive law
// (danger always carries its word) both forbid icon-only forms on
// the card face. Two overlay placements are genuinely credible and
// both ship for Brian's pick via `actionPlacement`.
import { Bookmark, Heart, Maximize2, Play, Users } from "lucide-react";

import KitBadgeView from "../badge/KitBadge.view";

const STAT_ICONS = { plays: Play, hearts: Heart, saves: Bookmark, followers: Users };
const STAT_ORDER = ["plays", "hearts", "saves", "followers"];

function stopAndRun(event, handler) {
  event.preventDefault();
  event.stopPropagation();
  handler?.();
}

function resolveOpenHandler(assetKind, onOpenImageOverlay, onOpenAssetDetail) {
  return assetKind === "image" ? onOpenImageOverlay : onOpenAssetDetail;
}

function IconActionButton({ label, active = false, onClick = null, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={(event) => stopAndRun(event, onClick)}
      className={`flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center rounded-[var(--radius-full)] border transition-colors [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)] ${
        active
          ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
          : "border-[var(--line)] bg-[var(--tag-bed-art)] text-[var(--art-ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--art-ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      {children}
    </button>
  );
}

function StatRow({ stats }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className="flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--art-ink-dim)]">
      {entries.map(([key, value]) => {
        const Icon = STAT_ICONS[key];
        return (
          <span key={key} className="inline-flex items-center gap-[var(--space-1)] opacity-[.85]">
            <Icon size={16} aria-hidden="true" />
            <span className="tabular-nums">{value}</span>
          </span>
        );
      })}
    </div>
  );
}

function BadgeRow({ badges }) {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-[var(--space-1)]">
      {badges.map((badge) => (
        <KitBadgeView key={badge.label} label={badge.label} variant={badge.variant} surface="art" />
      ))}
    </div>
  );
}

function OverlayActions({ liked, bookmarked, onLike, onBookmark, onOpen }) {
  return (
    <>
      <IconActionButton label="Like" active={liked} onClick={onLike}>
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
      </IconActionButton>
      <IconActionButton label="Save" active={bookmarked} onClick={onBookmark}>
        <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
      </IconActionButton>
      <IconActionButton label="Expand" onClick={onOpen}>
        <Maximize2 size={16} />
      </IconActionButton>
    </>
  );
}

// Overlay actions reveal on hover/focus at fine pointers and stay
// visible at coarse pointers (touch has no hover; mobile law).
const OVERLAY_REVEAL =
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(pointer:coarse)]:opacity-100";

function GridCard({
  title,
  subtitle,
  imageSrc,
  badges,
  stats,
  liked,
  bookmarked,
  actionPlacement,
  onOpen,
  onLike,
  onBookmark,
}) {
  const hasImage = Boolean(imageSrc);
  const actionsInScrim = actionPlacement === "scrim-row";

  return (
    <>
      <button
        type="button"
        onClick={(event) => stopAndRun(event, onOpen)}
        aria-label={`Open ${title || "creation"}`}
        className="absolute inset-0 z-[1] block w-full"
      >
        <span className="sr-only">Open {title || "creation"}</span>
      </button>

      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_top] transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_45%,transparent)] to-transparent"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
          No image
        </div>
      )}

      <div className="pointer-events-none relative z-[2] flex h-full flex-col justify-between p-[var(--space-3)]">
        <div className="flex items-start justify-between gap-[var(--space-2)]">
          <div className="pointer-events-auto">
            <BadgeRow badges={badges} />
          </div>
          {actionPlacement === "overlay-top" && (
            <div className={`pointer-events-auto flex gap-[var(--space-1)] ${OVERLAY_REVEAL}`}>
              <OverlayActions
                liked={liked}
                bookmarked={bookmarked}
                onLike={onLike}
                onBookmark={onBookmark}
                onOpen={onOpen}
              />
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-[var(--space-2)]">
          <div className="min-w-0">
            <h3
              className={`truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] ${hasImage ? "text-[var(--art-ink)]" : "text-[var(--ink)]"}`}
            >
              {title || "Untitled"}
            </h3>
            {subtitle && (
              <p
                className={`truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${hasImage ? "text-[var(--art-ink-dim)]" : "text-[var(--ink-dim)]"}`}
              >
                {subtitle}
              </p>
            )}
            <StatRow stats={stats} />
          </div>
          {actionsInScrim && (
            <div
              className={`pointer-events-auto flex flex-none gap-[var(--space-1)] ${OVERLAY_REVEAL}`}
            >
              <OverlayActions
                liked={liked}
                bookmarked={bookmarked}
                onLike={onLike}
                onBookmark={onBookmark}
                onOpen={onOpen}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ListCard({
  title,
  subtitle,
  imageSrc,
  badges,
  stats,
  liked,
  bookmarked,
  onOpen,
  onLike,
  onBookmark,
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <>
      <button
        type="button"
        onClick={(event) => stopAndRun(event, onOpen)}
        aria-label={`Open ${title || "creation"}`}
        className="absolute inset-0 z-[1] block w-full"
      >
        <span className="sr-only">Open {title || "creation"}</span>
      </button>

      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_20%] transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
          />
          {/* List rows read left to right, so the legibility fade
              anchors to the left edge (card-banner veil direction). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_55%,transparent)] to-transparent"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
          No image
        </div>
      )}

      <div className="pointer-events-none relative z-[2] flex h-full items-center justify-between gap-[var(--space-3)] p-[var(--space-4)]">
        <div className="min-w-0">
          <div className="pointer-events-auto mb-[var(--space-1)]">
            <BadgeRow badges={badges} />
          </div>
          <h3
            className={`truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] ${hasImage ? "text-[var(--art-ink)]" : "text-[var(--ink)]"}`}
          >
            {title || "Untitled"}
          </h3>
          {subtitle && (
            <p
              className={`truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${hasImage ? "text-[var(--art-ink-dim)]" : "text-[var(--ink-dim)]"}`}
            >
              {subtitle}
            </p>
          )}
          <StatRow stats={stats} />
        </div>

        <div
          className={`pointer-events-auto flex flex-none gap-[var(--space-1)] ${OVERLAY_REVEAL}`}
        >
          <OverlayActions
            liked={liked}
            bookmarked={bookmarked}
            onLike={onLike}
            onBookmark={onBookmark}
            onOpen={onOpen}
          />
        </div>
      </div>
    </>
  );
}

export default function KitCreationCardView({
  layout = "grid",
  assetKind = "character",
  title = "",
  subtitle = "",
  imageSrc = null,
  badges = [],
  stats = {},
  liked = false,
  bookmarked = false,
  actionPlacement = "overlay-top",
  isDisabled = false,
  onOpenImageOverlay = null,
  onOpenAssetDetail = null,
  onLike = null,
  onBookmark = null,
}) {
  const isList = layout === "list";
  const onOpen = resolveOpenHandler(assetKind, onOpenImageOverlay, onOpenAssetDetail);

  const disabledClasses = isDisabled
    ? "pointer-events-none opacity-[var(--state-disabled-opacity)]"
    : "";

  return (
    <article
      className={`group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] transition-[transform,box-shadow] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)] ${
        isList ? "aspect-[5/2] min-[700px]:aspect-[16/5]" : "aspect-[3/4]"
      } ${disabledClasses}`}
    >
      {isList ? (
        <ListCard
          title={title}
          subtitle={subtitle}
          imageSrc={imageSrc}
          badges={badges}
          stats={stats}
          liked={liked}
          bookmarked={bookmarked}
          onOpen={onOpen}
          onLike={onLike}
          onBookmark={onBookmark}
        />
      ) : (
        <GridCard
          title={title}
          subtitle={subtitle}
          imageSrc={imageSrc}
          badges={badges}
          stats={stats}
          liked={liked}
          bookmarked={bookmarked}
          actionPlacement={actionPlacement}
          onOpen={onOpen}
          onLike={onLike}
          onBookmark={onBookmark}
        />
      )}
    </article>
  );
}
