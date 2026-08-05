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
    <article className="w-full min-w-0 overflow-hidden rounded-[var(--radius-md)] border border-white/10 transition hover:border-[var(--gold-ornament)]/30">
      <div
        className="relative flex min-h-[6rem] items-end overflow-hidden bg-cover bg-center p-4"
        style={
          DEFAULT_PROFILE_BANNER
            ? {
                backgroundImage: `linear-gradient(to top, var(--scrim-strong), transparent), url(${DEFAULT_PROFILE_BANNER})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        <div className="flex min-w-0 flex-nowrap items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 font-display text-2xl text-[var(--gold-ornament)]">
            {avatarInitial}
          </div>

          <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden">
            <span className="truncate text-sm uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              @{creatorHandle}
            </span>

            <span className="flex shrink-0 flex-nowrap items-center gap-1 whitespace-nowrap text-xs text-[var(--ink-dim)]">
              {safeStats.map((stat) => {
                const Icon = STAT_ICONS[stat?.id];

                if (!Icon) return null;

                return (
                  <span
                    key={stat.id}
                    className="inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <Icon size={12} />
                    {stat.value}
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          {featured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--tag-bed-art)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
              <Sparkles size={11} />
              Featured
            </span>
          ) : null}

          {canonContributor ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-[var(--tag-bed-art)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-200">
              <Crown size={11} />
              Canon Contributor
            </span>
          ) : null}
        </div>

        <h2 className="mt-3 break-words font-display text-3xl leading-none">
          {creatorName}
        </h2>

        <p className="mt-3 leading-7 text-[var(--ink-dim)]">{tagline}</p>

        <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
          {description}
        </p>

        <CreatorEngagementActionsView {...engagementActions} />

        <LinkComponent
          href={profileHref}
          className="mt-5 inline-flex w-fit rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
        >
          View Profile
        </LinkComponent>
      </div>
    </article>
  );
}
