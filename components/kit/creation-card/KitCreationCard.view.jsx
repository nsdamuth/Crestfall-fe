"use client";

import { useState } from "react";
import {
  Bookmark,
  Download,
  Heart,
  Maximize2,
  Play,
  Share2,
  Trash2,
  Users,
} from "lucide-react";

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
      className={`flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center rounded-[var(--radius-full)] border transition-colors ${
        active
          ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      {children}
    </button>
  );
}

function GhostWordButton({ label, icon: Icon = null, onClick = null }) {
  return (
    <button
      type="button"
      onClick={(event) => stopAndRun(event, onClick)}
      className="inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] px-[var(--space-2)] text-[length:var(--text-label)] text-[var(--gold-action)] transition-colors hover:bg-[var(--state-hover-fill)] active:bg-[var(--state-pressed-fill)]"
    >
      {Icon && <Icon size={14} aria-hidden="true" />}
      {label}
    </button>
  );
}

function StatRow({ stats, tone = "ink" }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  const color = tone === "art" ? "text-[var(--art-ink-dim)]" : "text-[var(--ink-faint)]";

  return (
    <div className={`flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] ${color}`}>
      {entries.map(([key, value]) => {
        const Icon = STAT_ICONS[key];
        return (
          <span
            key={key}
            className="inline-flex items-center gap-[length:var(--space-1)] opacity-[.85]"
          >
            <Icon size={16} aria-hidden="true" />
            <span className="tabular-nums">{value}</span>
          </span>
        );
      })}
    </div>
  );
}

function BadgeRow({ badges, surface }) {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-[var(--space-1)]">
      {badges.map((badge) => (
        <KitBadgeView key={badge.label} label={badge.label} variant={badge.variant} surface={surface} />
      ))}
    </div>
  );
}

function DeleteControl({ onDelete }) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!onDelete) return null;

  if (isConfirming) {
    return (
      <button
        type="button"
        onClick={(event) =>
          stopAndRun(event, () => {
            setIsConfirming(false);
            onDelete();
          })
        }
        onBlur={() => setIsConfirming(false)}
        className="inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] bg-[var(--status-danger)] px-[var(--space-3)] text-[length:var(--text-label)] text-[var(--ink)] transition-colors"
      >
        <Trash2 size={14} aria-hidden="true" />
        Confirm delete
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => stopAndRun(event, () => setIsConfirming(true))}
      className="inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] px-[var(--space-2)] text-[length:var(--text-label)] text-[var(--status-danger)] transition-colors hover:bg-[var(--status-danger-bed)] active:bg-[var(--state-pressed-fill)]"
    >
      <Trash2 size={14} aria-hidden="true" />
      Delete
    </button>
  );
}

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
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(event) => stopAndRun(event, onOpen)}
        aria-label={`Open ${title || "creation"}`}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-t-[var(--radius-md)]"
      >
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[var(--dur-hover)] group-hover:scale-[1.04]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--space-20)] bg-gradient-to-t from-[var(--canvas)] to-transparent"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-[var(--space-2)] p-[var(--space-3)] text-left">
              <h3 className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--art-ink)]">
                {title || "Untitled"}
              </h3>
              {subtitle && (
                <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]">
                  {subtitle}
                </p>
              )}
              <StatRow stats={stats} tone="art" />
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--surface-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
            No image
          </div>
        )}
      </button>

      {hasImage && (
        <div className="pointer-events-none absolute left-[var(--space-3)] top-[var(--space-3)]">
          <div className="pointer-events-auto">
            <BadgeRow badges={badges} surface="art" />
          </div>
        </div>
      )}

      <div className="absolute right-[var(--space-2)] top-[var(--space-2)] flex gap-[var(--space-1)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <IconActionButton label="Like" active={liked} onClick={onLike}>
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </IconActionButton>
        <IconActionButton label="Bookmark" active={bookmarked} onClick={onBookmark}>
          <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
        </IconActionButton>
        <IconActionButton label="Expand" onClick={onOpen}>
          <Maximize2 size={16} />
        </IconActionButton>
      </div>

      {!hasImage && (
        <div className="flex flex-col gap-[var(--space-2)] p-[var(--space-3)]">
          <h3 className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {title || "Untitled"}
          </h3>
          {subtitle && (
            <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {subtitle}
            </p>
          )}
          <BadgeRow badges={badges} surface="canvas" />
          <StatRow stats={stats} tone="ink" />
        </div>
      )}
    </div>
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
  allowDownload = false,
  isDisabled = false,
  onOpenImageOverlay = null,
  onOpenAssetDetail = null,
  onShare = null,
  onLike = null,
  onBookmark = null,
  onDownload = null,
  onDelete = null,
}) {
  const isList = layout === "list";
  const onOpen = resolveOpenHandler(assetKind, onOpenImageOverlay, onOpenAssetDetail);

  const disabledClasses = isDisabled
    ? "pointer-events-none opacity-[var(--state-disabled-opacity)]"
    : "";

  if (isList) {
    return (
      <article
        className={`group relative flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-3)] transition-colors hover:border-[var(--state-hover-line)] ${disabledClasses}`}
      >
        <button
          type="button"
          onClick={(event) => stopAndRun(event, onOpen)}
          aria-label={`Open ${title || "creation"}`}
          className="relative block h-[var(--space-16)] w-[var(--space-16)] flex-none overflow-hidden rounded-[var(--radius-sm)]"
        >
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--surface-2)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
              No image
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {title || "Untitled"}
          </h3>
          {subtitle && (
            <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {subtitle}
            </p>
          )}
          <BadgeRow badges={badges} surface="canvas" />
          <StatRow stats={stats} tone="ink" />
        </div>

        <div className="flex flex-none items-center gap-[var(--space-1)]">
          <IconActionButton label="Like" active={liked} onClick={onLike}>
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </IconActionButton>
          <IconActionButton label="Bookmark" active={bookmarked} onClick={onBookmark}>
            <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
          </IconActionButton>
          <IconActionButton label="Expand" onClick={onOpen}>
            <Maximize2 size={16} />
          </IconActionButton>
          <GhostWordButton label="Share" icon={Share2} onClick={onShare} />
          {allowDownload && (
            <IconActionButton label="Download" onClick={onDownload}>
              <Download size={16} />
            </IconActionButton>
          )}
          <DeleteControl onDelete={onDelete} />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] transition-[transform,box-shadow] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)] ${disabledClasses}`}
    >
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
      />

      <div className="flex items-center justify-between border-t border-[var(--line-whisper)] px-[var(--space-3)] py-[var(--space-2)]">
        <GhostWordButton label="Share" icon={Share2} onClick={onShare} />
        {allowDownload && (
          <IconActionButton label="Download" onClick={onDownload}>
            <Download size={16} />
          </IconActionButton>
        )}
        <DeleteControl onDelete={onDelete} />
      </div>
    </article>
  );
}
