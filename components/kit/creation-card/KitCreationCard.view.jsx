"use client";

// Card law, 9 Aug 2026 (docs/BUILD-BLUEPRINT.md 2.6 second revision):
// full-bleed art in BOTH layouts, no bottom action bar anywhere.
// Actions are small overlay icons (like, save, expand); share,
// download, and delete live inside the open destination, because
// Ruling 6 (share always carries its word) and the destructive law
// (danger always carries its word) both forbid icon-only forms on
// the card face. Placement is top-right over the art, RULED 10 Aug
// 2026 (kit polish 3 pass, docs/BUILD-BLUEPRINT.md); the scrim-row
// alternative is retired.
//
// Art-anchor law, RULED 9 Aug 2026 (kit polish pass), REVISED 9 Aug
// 2026 (kit polish 2 pass): art anchors 18% down from the top of the
// frame in both layouts, not the hard top edge. Rendered against the
// draft asset set both ways: a hard top anchor clips foreheads and
// crowns on tighter crops (list layout, narrow grid columns) with no
// offsetting benefit, while 18% consistently keeps the face and
// primary subject in frame across the set without losing meaningful
// headroom. A future editor-side, per-view reposition capability is a
// later expansion, not built here.
//
// Overlay-action placement, RULED 10 Aug 2026 (kit polish 3 pass):
// overlay-top everywhere. The scrim-row alternative (icons bottom-right
// beside the title) is retired; icons top-right over the art, clear of
// the title block, is the only placement now.
import { Bookmark, Heart, Maximize2, Play, Users, Wand2 } from "lucide-react";

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

// Contextual third face action, RULED 11 Aug 2026: play (Story,
// Adventure), generate (Image asset), expand everywhere else,
// including any card whose caller passes no handler for its
// contextual action. Expand is the universal fallback; a card never
// renders a dead third icon.
function resolveContextualAction({ assetKind, onPlay, onGenerate, onOpen }) {
  if ((assetKind === "story" || assetKind === "adventure") && onPlay) {
    return { label: "Start Chat", Icon: Play, onClick: onPlay };
  }
  if (assetKind === "image" && onGenerate) {
    return { label: "Generate", Icon: Wand2, onClick: onGenerate };
  }
  return { label: "Expand", Icon: Maximize2, onClick: onOpen };
}

function IconActionButton({ label, active = false, onClick = null, children }) {
  // Selection-state law: active reads as a gold mark plus a light
  // wash, never a border change. The dark art-plate behind the icon
  // (--tag-bed-art) stays in both states for legibility over any
  // fixture art; RULED 9 Aug 2026 (kit polish 2 pass) its opacity
  // lowers when active instead of adding a border, so the gold wash
  // layered on top reads against both the lightest and darkest art.
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={(event) => stopAndRun(event, onClick)}
      className={`kit-focus relative flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--line)] transition-colors [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)] ${
        active
          ? "text-[var(--gold-bright)]"
          : "text-[var(--art-ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--art-ink)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-[var(--tag-bed-art)] transition-opacity ${active ? "opacity-60" : "opacity-100"}`}
      />
      {active && <span aria-hidden="true" className="absolute inset-0 bg-[var(--fill)]" />}
      <span className="relative">{children}</span>
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

function OverlayActions({ liked, bookmarked, onLike, onBookmark, contextualAction }) {
  const { label, Icon, onClick } = contextualAction;

  return (
    <>
      <IconActionButton label="Like" active={liked} onClick={onLike}>
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
      </IconActionButton>
      <IconActionButton label="Save" active={bookmarked} onClick={onBookmark}>
        <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
      </IconActionButton>
      <IconActionButton label={label} onClick={onClick}>
        <Icon size={16} />
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
  onOpen,
  onLike,
  onBookmark,
  contextualAction,
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <>
      <button
        type="button"
        onClick={(event) => stopAndRun(event, onOpen)}
        aria-label={`Open ${title || "creation"}`}
        className="kit-focus absolute inset-0 z-[1] block w-full rounded-[var(--radius-md)] border border-transparent"
      >
        <span className="sr-only">Open {title || "creation"}</span>
      </button>

      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_45%,transparent)] to-transparent"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[var(--space-2)] bg-[var(--surface-2)]">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-10)] w-[var(--space-10)] text-[var(--ink-faint)]">
            <use href="/assets/icons/icons-v7.svg#i-59" />
          </svg>
          <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">No image</span>
        </div>
      )}

      <div className="pointer-events-none relative z-[2] flex h-full flex-col justify-between p-[var(--space-3)]">
        <div className="flex items-start justify-between gap-[var(--space-2)]">
          <div className="pointer-events-auto">
            <BadgeRow badges={badges} />
          </div>
          <div className={`pointer-events-auto flex gap-[var(--space-1)] ${OVERLAY_REVEAL}`}>
            <OverlayActions
              liked={liked}
              bookmarked={bookmarked}
              onLike={onLike}
              onBookmark={onBookmark}
              contextualAction={contextualAction}
            />
          </div>
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
  contextualAction,
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <>
      <button
        type="button"
        onClick={(event) => stopAndRun(event, onOpen)}
        aria-label={`Open ${title || "creation"}`}
        className="kit-focus absolute inset-0 z-[1] block w-full rounded-[var(--radius-md)] border border-transparent"
      >
        <span className="sr-only">Open {title || "creation"}</span>
      </button>

      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
          />
          {/* List rows read left to right, so the legibility fade
              anchors to the left edge (card-banner veil direction). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_55%,transparent)] to-transparent"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[var(--space-2)] bg-[var(--surface-2)]">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-10)] w-[var(--space-10)] text-[var(--ink-faint)]">
            <use href="/assets/icons/icons-v7.svg#i-59" />
          </svg>
          <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">No image</span>
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
            contextualAction={contextualAction}
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
  isDisabled = false,
  onOpenImageOverlay = null,
  onOpenAssetDetail = null,
  onLike = null,
  onBookmark = null,
  onPlay = null,
  onGenerate = null,
}) {
  const isList = layout === "list";
  const onOpen = resolveOpenHandler(assetKind, onOpenImageOverlay, onOpenAssetDetail);
  const contextualAction = resolveContextualAction({ assetKind, onPlay, onGenerate, onOpen });

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
          contextualAction={contextualAction}
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
          onOpen={onOpen}
          onLike={onLike}
          onBookmark={onBookmark}
          contextualAction={contextualAction}
        />
      )}
    </article>
  );
}
