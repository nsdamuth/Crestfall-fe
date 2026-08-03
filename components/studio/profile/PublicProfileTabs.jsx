"use client";

import PublicProfileActivityFeed from "@/components/studio/profile/PublicProfileActivityFeed";
import PublicProfileCreationGrid from "@/components/studio/profile/PublicProfileCreationGrid";
import PublicProfileBadges from "@/components/studio/profile/PublicProfileBadges";
import PublicProfileTabsView from "./public-profile-tabs/PublicProfileTabs.view";
import { usePublicProfileTabsViewModel } from "./public-profile-tabs/usePublicProfileTabsViewModel";

export default function PublicProfileTabs({
  profile,
  creations = [],
  badges = [],
  donationEvents = [],
}) {
  const viewProps = usePublicProfileTabsViewModel();

  const contentSlot =
    viewProps.activeTab === "activity" ? (
      <PublicProfileActivityFeed
        profile={profile}
        creations={creations}
        donationEvents={donationEvents}
      />
    ) : viewProps.activeTab === "badges" ? (
      <PublicProfileBadges badges={badges} />
    ) : (
      <PublicProfileCreationGrid creations={creations} />
    );

  return <PublicProfileTabsView {...viewProps} contentSlot={contentSlot} />;
}
