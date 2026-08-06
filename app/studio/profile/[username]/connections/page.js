import Link from "next/link";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import ProfileAvatar from "@/components/studio/profile/ProfileAvatar";
import ProfileFollowButton from "@/components/studio/profile/ProfileFollowButton";
import { getPublicProfileConnectionsPageData } from "@/lib/server/studio/getPublicProfileConnectionsPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeTab(tab) {
  return tab === "following" ? "following" : "followers";
}

export default async function PublicProfileConnectionsPage({
  params,
  searchParams,
}) {
  const { username } = await params;
  const resolvedSearchParams = await searchParams;
  const activeTab = normalizeTab(resolvedSearchParams?.tab);

  const { profile, followCounts, followers, following, loadError } =
    await getPublicProfileConnectionsPageData(username);

  const publicUsername = profile.username || username;
  const activeList = activeTab === "following" ? following : followers;

  return (
    <>
      <StudioPageHeader eyebrow="Creator Profile" title={`@${publicUsername}`}>
        Followers and following for this public Crestfall creator.
      </StudioPageHeader>

      <section className="mt-8 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/studio/profile/${encodeURIComponent(publicUsername)}`}
            className="cf-btn cf-btn--secondary"
          >
            ← Back to profile
          </Link>

          <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
            <ConnectionTab
              username={publicUsername}
              tab="followers"
              activeTab={activeTab}
              count={followCounts.followers || 0}
              label="Followers"
            />

            <ConnectionTab
              username={publicUsername}
              tab="following"
              activeTab={activeTab}
              count={followCounts.following || 0}
              label="Following"
            />
          </div>
        </div>

        {loadError ? (
          <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
            Connections could not be loaded: {loadError}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {activeList.length ? (
            activeList.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
              <p className="font-display text-3xl">
                No {activeTab === "following" ? "following" : "followers"} yet
              </p>
              <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--muted)]">
                Public creator connections will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ConnectionTab({ username, tab, activeTab, count, label }) {
  const active = activeTab === tab;

  return (
    <Link
      href={`/studio/profile/${encodeURIComponent(username)}/connections?tab=${tab}`}
      className={`rounded-lg px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
        active
          ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {count} {label}
    </Link>
  );
}

function ConnectionCard({ connection }) {
  const username = connection.username;

  return (
    <article className="rounded-2xl border border-white/10 bg-black/35 p-5 transition hover:border-[var(--muted-gold)]/30">
      <div className="flex flex-wrap items-start gap-4">
        <ProfileAvatar
          displayName={username}
          avatarUrl={connection.avatarUrl}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-3xl">{username}</h2>

          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            @{username}
          </p>

          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {connection.tagline}
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {connection.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/studio/profile/${encodeURIComponent(username)}`}
              className="cf-btn cf-btn--primary"
            >
              View profile
            </Link>

            <ProfileFollowButton
              username={username}
              initialIsFollowing={connection.followState.isFollowing}
              canFollow={connection.followState.canFollow}
            />
          </div>
        </div>
      </div>
    </article>
  );
}