import { Award } from "lucide-react";
import { PUBLIC_PROFILE_BADGES_VIEW_DEFAULTS } from "./PublicProfileBadges.contract";

export default function PublicProfileBadgesView({
  badges = PUBLIC_PROFILE_BADGES_VIEW_DEFAULTS.badges,
  emptyTitle = PUBLIC_PROFILE_BADGES_VIEW_DEFAULTS.emptyTitle,
  emptyBody = PUBLIC_PROFILE_BADGES_VIEW_DEFAULTS.emptyBody,
}) {
  const safeBadges = Array.isArray(badges) ? badges : [];

  if (!safeBadges.length) {
    return (
      <div className="mx-auto mt-5 w-full rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
          <Award size={22} />
        </div>
        <p className="mt-4 font-display text-3xl">{emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--ink-dim)]">
          {emptyBody}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-5 grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {safeBadges.map((badge, index) => (
        <article
          key={badge?.id || badge?.slug || `badge-${index}`}
          className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-5 transition-colors hover:border-[var(--gold-ornament)]/25"
        >
          <div className="flex items-start gap-4">
            {badge?.imageUrl ? (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/5 p-1 sm:h-28 sm:w-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={badge.imageUrl}
                  alt={badge.label || "Crestfall badge"}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
                {badge?.label || "Badge"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              {badge?.imageUrl ? (
                <p className="font-display text-2xl text-[var(--ink)]">
                  {badge?.label || "Badge"}
                </p>
              ) : null}

              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                {badge?.categoryLabel || "Badge"}
              </p>

              {badge?.description ? (
                <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
                  {badge.description}
                </p>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
