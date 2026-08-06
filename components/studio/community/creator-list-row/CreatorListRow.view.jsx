"use client";

import { Crown, Heart, Sparkles, User, Users } from "lucide-react";

import CreatorEngagementActionsView from "@/components/studio/community/creator-engagement-actions/CreatorEngagementActions.view";

const STAT_ICONS = {
  followers: Users,
  creations: User,
  canon: Crown,
  likes: Heart,
};

export default function CreatorListRowView({
  creatorName = "Crestfall Creator",
  creatorHandle = "crestfallen_creator",
  profileHref = "/studio/profile/crestfallen_creator",
  avatarInitial = "C",
  summary = "Crestfall creator.",
  featured = false,
  canonContributor = false,
  stats = [],
  engagementActions = {},
  LinkComponent = "a",
}) {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <article className="border-b border-white/10 px-5 py-4 last:border-b-0 transition hover:bg-white/[0.03]">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 font-display text-xl text-[var(--gold-ornament)]">
          {avatarInitial}
        </div>

        <div className="min-w-[180px] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl leading-none">
              {creatorName}
            </h2>

            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[var(--gold-ornament)]">
                <Sparkles size={10} />
                Featured
              </span>
            ) : null}

            {canonContributor ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-emerald-200">
                <Crown size={10} />
                Canon
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            @{creatorHandle}
          </p>

          <p className="mt-2 line-clamp-1 text-sm text-[var(--ink-dim)]">
            {summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-[var(--ink-dim)]">
          {safeStats.map((stat) => {
            const Icon = STAT_ICONS[stat?.id];

            if (!Icon) return null;

            return (
              <span key={stat.id} className="inline-flex items-center gap-1">
                <Icon size={14} />
                {stat.value} {stat.label}
              </span>
            );
          })}
        </div>

        <CreatorEngagementActionsView {...engagementActions} />

        <LinkComponent
          href={profileHref}
          className="cf-btn cf-btn--primary ml-auto"
        >
          View profile
        </LinkComponent>
      </div>
    </article>
  );
}
