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

function StatRow({ stats }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className="flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
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

function CardImage({ imageSrc, title, layout, onOpen }) {
  const shapeClasses =
    layout === "list"
      ? "h-[var(--space-16)] w-[var(--space-16)] flex-none rounded-[var(--radius-sm)]"
      : "aspect-[3/4] w-full rounded-t-[var(--radius-md)]";

  return (
    <button
      type="button"
      onClick={(event) => stopAndRun(event, onOpen)}
      aria-label={`Open ${title || "creation"}`}
      className={`relative block overflow-hidden ${shapeClasses}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--surface-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
          No image
        </div>
      )}
      {layout === "grid" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--space-16)] bg-gradient-to-t from-[var(--canvas)] to-transparent"
        />
      )}
    </button>
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

export default function KitCreationCardView({
  layout = "grid",
  title = "",
  subtitle = "",
  imageSrc = null,
  badges = [],
  stats = {},
  liked = false,
  bookmarked = false,
  allowDownload = false,
  isDisabled = false,
  onOpen = null,
  onShare = null,
  onLike = null,
  onBookmark = null,
  onDownload = null,
  onDelete = null,
}) {
  const isList = layout === "list";

  const containerClasses = isList
    ? "flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-3)] transition-colors hover:border-[var(--state-hover-line)]"
    : "flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] transition-[transform,box-shadow] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)]";

  const disabledClasses = isDisabled
    ? "pointer-events-none opacity-[var(--state-disabled-opacity)]"
    : "";

  const badgeRow =
    badges.length > 0 ? (
      <div className="flex flex-wrap gap-[var(--space-1)]">
        {badges.map((badge) => (
          <KitBadgeView
            key={badge.label}
            label={badge.label}
            variant={badge.variant}
            surface={isList ? "canvas" : "art"}
          />
        ))}
      </div>
    ) : null;

  return (
    <article className={`group relative ${containerClasses} ${disabledClasses}`}>
      <div className={isList ? "relative flex-none" : "relative"}>
        <CardImage
          imageSrc={imageSrc}
          title={title}
          layout={layout}
          onOpen={onOpen}
        />

        {!isList && badgeRow && (
          <div className="pointer-events-none absolute left-[var(--space-3)] top-[var(--space-3)]">
            <div className="pointer-events-auto">{badgeRow}</div>
          </div>
        )}

        {!isList && (
          <div className="absolute right-[var(--space-2)] top-[var(--space-2)] flex gap-[var(--space-1)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <IconActionButton label="Like" active={liked} onClick={onLike}>
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </IconActionButton>
            <IconActionButton
              label="Bookmark"
              active={bookmarked}
              onClick={onBookmark}
            >
              <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
            </IconActionButton>
            <IconActionButton label="Expand" onClick={onOpen}>
              <Maximize2 size={16} />
            </IconActionButton>
          </div>
        )}
      </div>

      <div className={isList ? "min-w-0 flex-1" : "flex flex-col gap-[var(--space-2)] p-[var(--space-3)]"}>
        <h3 className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
          {title || "Untitled"}
        </h3>
        {subtitle && (
          <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {subtitle}
          </p>
        )}
        {isList && badgeRow}
        <StatRow stats={stats} />
      </div>

      <div
        className={
          isList
            ? "flex flex-none items-center gap-[var(--space-1)]"
            : "flex items-center justify-between border-t border-[var(--line-whisper)] px-[var(--space-3)] py-[var(--space-2)]"
        }
      >
        {isList && (
          <>
            <IconActionButton label="Like" active={liked} onClick={onLike}>
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </IconActionButton>
            <IconActionButton
              label="Bookmark"
              active={bookmarked}
              onClick={onBookmark}
            >
              <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
            </IconActionButton>
            <IconActionButton label="Expand" onClick={onOpen}>
              <Maximize2 size={16} />
            </IconActionButton>
          </>
        )}

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
