import StudioPageHeader from "@/components/studio/StudioPageHeader";
import PublicProfileTabs from "@/components/studio/profile/PublicProfileTabs";
import PublicProfileHero from "@/components/studio/profile/PublicProfileHero";
import { getPublicProfilePageData } from "@/lib/server/studio/getPublicProfilePageData";
import ProfileBackButton from "@/components/studio/profile/ProfileBackButton";
import { getPublicProfileEngagementSummary } from "@/lib/server/studio/getPublicProfileEngagementSummary";
import { getPublicProfileDonationEvents } from "@/lib/server/studio/getPublicProfileDonationEvents";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicProfilePage({ params }) {
  const { username } = await params;

  const {
    profile,
    creations,
    badges,
    stats,
    loadError,
    followCounts,
    followState,
  } = await getPublicProfilePageData(username);

  const publicUsername = profile.username || username;

  const {
    stats: engagementStats,
    followCounts: engagementFollowCounts,
    loadError: engagementLoadError,
  } = await getPublicProfileEngagementSummary({
    profileId: profile?.id,
    baseStats: stats,
    baseFollowCounts: followCounts,
  });
  const {
    donationEvents,
    loadError: donationEventsLoadError,
  } = await getPublicProfileDonationEvents({
    profileId: profile?.id,
  });

  return (
    <>
        <div className="mb-5">
        <ProfileBackButton fallbackHref="/studio/community" />
      </div>
      <StudioPageHeader
        eyebrow="Creator Profile"
        title={`@${publicUsername}`}
      >
        Public Crestfall creator profile.
      </StudioPageHeader>

      <PublicProfileHero
        profile={profile}
        stats={engagementStats}
        followCounts={engagementFollowCounts}
        followState={followState}
      />

      {loadError || engagementLoadError || donationEventsLoadError ? (
        <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
          Public profile data could not be fully loaded:{" "}
          {loadError || engagementLoadError || donationEventsLoadError}
        </div>
      ) : null}

      <PublicProfileTabs
        profile={profile}
        creations={creations}
        badges={badges}
        donationEvents={donationEvents}
      />
    </>
  );
}