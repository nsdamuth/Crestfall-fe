import { Bookmark, Play, Users } from "lucide-react";

const STAT_ICONS = { plays: Play, followers: Users, works: Bookmark };
const STAT_ORDER = ["followers", "plays", "works"];

function StatRow({ stats }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className="flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
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

function RectButton({ label, tone = "ghost", onClick = null }) {
  const toneClasses =
    tone === "primary"
      ? "border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
      : "border-[var(--line-strong)] bg-transparent text-[var(--gold-action)] hover:border-[var(--gold-action)]";

  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      className={`kit-focus inline-flex min-h-[var(--control-sm)] flex-1 items-center justify-center rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] transition-colors hover:shadow-[var(--glow-hover)] active:bg-[var(--state-pressed-fill)] ${toneClasses}`}
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
            <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
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

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-3 gap-[var(--space-1)]">
          {thumbnails.map((thumbnail) => (
            <button
              key={thumbnail.id}
              type="button"
              onClick={() => onThumbnailOpen?.(thumbnail.id)}
              aria-label={`Open ${thumbnail.alt || "recent work"}`}
              className="kit-focus aspect-square overflow-hidden rounded-[var(--radius-sm)] transition-opacity hover:opacity-90 focus-visible:opacity-90"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail.imageSrc}
                alt=""
                className="h-full w-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-[var(--space-2)]">
        <RectButton
          label={isFollowing ? "Following" : "Follow"}
          tone={isFollowing ? "primary" : "ghost"}
          onClick={onFollow}
        />
        <RectButton label="View profile" tone="ghost" onClick={onViewProfile} />
      </div>
    </article>
  );
}
