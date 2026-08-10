"use client";

// Composed on the unified modal frame (docs/BUILD-BLUEPRINT.md 2.15,
// built per docs/SPRINT-A-PLAN.md section 3.3). This is the content
// rendered inside KitModalFrame by the binding shell; it owns no
// veil, panel, or close control of its own.
import { Bookmark, Heart, Play, Share2, Users } from "lucide-react";

import KitBadgeView from "../badge/KitBadge.view";

const STAT_ICONS = { plays: Play, hearts: Heart, saves: Bookmark, followers: Users };
const STAT_ORDER = ["plays", "hearts", "saves", "followers"];

export const KIT_ASSET_DETAIL_POPUP_TITLE_ID = "kit-asset-detail-popup-title";

function StatRow({ stats }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className="mt-[var(--space-3)] flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
      {entries.map(([key, value]) => {
        const Icon = STAT_ICONS[key];
        return (
          <span key={key} className="inline-flex items-center gap-[var(--space-1)]">
            <Icon size={16} aria-hidden="true" />
            <span className="tabular-nums">{value}</span>
          </span>
        );
      })}
    </div>
  );
}

function Header({ imageSrc, title, subtitle, badges }) {
  const hasImage = Boolean(imageSrc);

  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-t-[var(--radius-lg)]">
      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_45%,transparent)] to-transparent"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[var(--space-2)] bg-[var(--surface-2)]">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-14)] w-[var(--space-14)] text-[var(--ink-faint)]">
            <use href="/assets/icons/icons-v7.svg#i-59" />
          </svg>
          <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">No image</span>
        </div>
      )}

      <div className="pointer-events-none relative z-[1] flex h-full flex-col justify-end p-[var(--space-4)]">
        {badges.length > 0 && (
          <div className="pointer-events-auto mb-[var(--space-2)] flex flex-wrap gap-[var(--space-1)]">
            {badges.map((badge) => (
              <KitBadgeView key={badge.label} label={badge.label} variant={badge.variant} surface="art" />
            ))}
          </div>
        )}
        <h2
          id={KIT_ASSET_DETAIL_POPUP_TITLE_ID}
          className={`font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] ${hasImage ? "text-[var(--art-ink)]" : "text-[var(--ink)]"}`}
        >
          {title || "Untitled"}
        </h2>
        {subtitle && (
          <p
            className={`text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${hasImage ? "text-[var(--art-ink-dim)]" : "text-[var(--ink-dim)]"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function KitAssetDetailPopupView({
  primaryActionLabel = "Play",
  title = "",
  subtitle = "",
  imageSrc = null,
  badges = [],
  stats = {},
  description = "",
  isSaved = false,
  onPrimaryAction = null,
  onShare = null,
  onSave = null,
}) {
  return (
    <div>
      <Header imageSrc={imageSrc} title={title} subtitle={subtitle} badges={badges} />

      <div className="p-[var(--space-6)]">
        {description && (
          <p className="max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {description}
          </p>
        )}

        <StatRow stats={stats} />

        <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
          <button
            type="button"
            onClick={() => onPrimaryAction?.()}
            className="kit-focus cf-btn cf-btn--primary"
          >
            {primaryActionLabel}
          </button>
          <button
            type="button"
            onClick={() => onShare?.()}
            className="kit-focus cf-btn cf-btn--secondary"
          >
            <Share2 size={16} aria-hidden="true" />
            Share
          </button>
          <button
            type="button"
            aria-pressed={isSaved}
            onClick={() => onSave?.()}
            className={`kit-focus cf-btn cf-btn--secondary ${isSaved ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]" : ""}`}
          >
            <Bookmark size={16} aria-hidden="true" fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
