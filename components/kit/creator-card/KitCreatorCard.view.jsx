import { Bookmark, Heart, Play, Users } from "lucide-react";

const STAT_ICONS = { likes: Heart, plays: Play, followers: Users, works: Bookmark };
const STAT_ORDER = ["followers", "likes", "plays", "works"];

// Three-slot media strip law, RULED 23 Aug 2026 (build-0823 pass 6),
// mirroring the KitAssetDetailPopup media strip treatment from
// commit 16dac8b: exactly three slots always render, real thumbnails
// fill from the front, remaining slots render the same ratified
// geometric placeholder (icons-v7.svg#i-59). The strip no longer
// hides at zero thumbnails.
const THUMBNAIL_SLOT_COUNT = 3;

function ThumbnailSlotTile({ thumbnail, onThumbnailOpen }) {
  if (thumbnail) {
    return (
      <button
        type="button"
        onClick={() => onThumbnailOpen?.(thumbnail.id)}
        aria-label={`Open ${thumbnail.alt || "recent work"}`}
        className="aspect-square w-full overflow-hidden rounded-[var(--radius-md)] transition-opacity hover:opacity-90 focus-visible:opacity-90"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail.imageSrc}
          alt=""
          width={300}
          height={300}
          loading="lazy"
          className="h-full w-full object-cover object-[center_18%]"
        />
      </button>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex aspect-square w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-2)] text-[var(--ink-faint)]"
    >
      <svg viewBox="0 0 64 64" className="h-[var(--space-8)] w-[var(--space-8)]">
        <use href="/assets/icons/icons-v7.svg#i-59" />
      </svg>
    </div>
  );
}

function StatRow({ stats }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-[var(--space-2)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
      {entries.map(([key, value]) => {
        const Icon = STAT_ICONS[key];
        return (
          <span key={key} className="inline-flex items-center gap-[length:var(--space-1)] opacity-[.85]">
            <Icon size={16} aria-hidden="true" />
            <span className="tabular-nums">{value}</span>
          </span>
        );
      })}
    </div>
  );
}

function RectButton({ label, tone = "ghost", onClick = null, disabled = false }) {
  const toneClasses =
    tone === "primary"
      ? "border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
      : "border-[var(--line-strong)] bg-transparent text-[var(--gold-action)] hover:border-[var(--gold-action)]";

  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      disabled={disabled}
      className={`inline-flex min-h-[var(--control-sm)] flex-1 items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] transition-colors hover:shadow-[var(--glow-hover)] active:bg-[var(--state-pressed-fill)] disabled:cursor-not-allowed disabled:opacity-45 ${toneClasses}`}
    >
      {label}
    </button>
  );
}

export default function KitCreatorCardView({
  handle = "",
  avatarSrc = null,
  stats = {},
  thumbnails = [],
  isFollowing = false,
  canFollow = true,
  onThumbnailOpen = null,
  onFollow = null,
  onViewProfile = null,
}) {
  return (
    <article className="flex flex-col gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)] transition-colors hover:border-[var(--state-hover-line)]">
      <div className="flex items-center gap-[var(--space-3)]">
        <span className="flex h-[var(--space-12)] w-[var(--space-12)] flex-none items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--line-strong)] bg-[var(--surface-3)]">
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-[length:var(--text-lead)] text-[var(--ink-dim)]">
              {handle ? handle.charAt(0).toUpperCase() : "?"}
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {handle || "Unknown creator"}
          </h3>
          <StatRow stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[var(--space-2)]">
        {Array.from({ length: THUMBNAIL_SLOT_COUNT }, (_, index) => (
          <ThumbnailSlotTile
            key={thumbnails[index]?.id ?? `empty-${index}`}
            thumbnail={thumbnails[index] || null}
            onThumbnailOpen={onThumbnailOpen}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-[var(--space-2)]">
        <RectButton
          label={!canFollow ? "You" : isFollowing ? "Following" : "Follow"}
          tone={canFollow && isFollowing ? "primary" : "ghost"}
          onClick={onFollow}
          disabled={!canFollow}
        />
        <RectButton label="View profile" tone="ghost" onClick={onViewProfile} />
      </div>
    </article>
  );
}
