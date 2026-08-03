"use client";

import { Crown, Heart, Sparkles, User, Users } from "lucide-react";

import CreatorEngagementActionsView from "@/components/studio/community/creator-engagement-actions/CreatorEngagementActions.view";

const DEFAULT_PROFILE_BANNER = "/assets/covers/banner.png";

const STAT_ICONS = {
  followers: Users,
  creations: User,
  canon: Crown,
  likes: Heart,
};

export default function CreatorCardView({
  creatorName = "Crestfall Creator",
  creatorHandle = "crestfallen_creator",
  profileHref = "/studio/profile/crestfallen_creator",
  avatarInitial = "C",
  tagline = "",
  description = "",
  featured = false,
  canonContributor = false,
  stats = [],
  engagementActions = {},
  LinkComponent = "a",
}) {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <article className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-5 transition hover:border-[var(--muted-gold)]/30">
      <div
        className="flex min-w-0 flex-col gap-4 sm:flex-row"
        style={
          DEFAULT_PROFILE_BANNER
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.86)), url(${DEFAULT_PROFILE_BANNER})`,
                backgroundPosition: "40% -20px",
                backgroundSize: "auto 100%",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 font-display text-2xl text-[var(--muted-gold)]">
          {avatarInitial}
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-gold)]">
                <Sparkles size={11} />
                Featured
              </span>
            ) : null}

            {canonContributor ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-200">
                <Crown size={11} />
                Canon Contributor
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 break-words font-display text-3xl leading-none">
            {creatorName}
          </h2>

          <p className="mt-1 break-all text-sm uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            @{creatorHandle}
          </p>

          <p className="mt-3 leading-7 text-[var(--muted)]">{tagline}</p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2 text-xs text-[var(--muted)] sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-4">
            {safeStats.map((stat) => {
              const Icon = STAT_ICONS[stat?.id];

              if (!Icon) return null;

              return (
                <span
                  key={stat.id}
                  className="inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <Icon size={14} />
                  {stat.value} {stat.label}
                </span>
              );
            })}
          </div>

          <CreatorEngagementActionsView {...engagementActions} />

          <LinkComponent
            href={profileHref}
            className="mt-5 inline-flex w-fit rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            View Profile
          </LinkComponent>
        </div>
      </div>
    </article>
  );
}
