import Link from "next/link";

import ProfileAvatar from "@/components/studio/profile/ProfileAvatar";
import ProfileShareButton from "@/components/studio/profile/ProfileShareButton";
import PublicProfileDonateButton from "@/components/studio/profile/PublicProfileDonateButton";
import PublicProfileEngagementActions from "@/components/studio/profile/PublicProfileEngagementActions";

import PublicProfileHeroView from "./public-profile-hero/PublicProfileHero.view";
import { usePublicProfileHeroViewModel } from "./public-profile-hero/usePublicProfileHeroViewModel";

export default function PublicProfileHero(props) {
  const viewProps = usePublicProfileHeroViewModel(props);
  const { profile } = props;

  return (
    <PublicProfileHeroView
      {...viewProps}
      avatarSlot={
        <ProfileAvatar
          displayName={viewProps.displayName}
          avatarUrl={viewProps.avatarUrl}
          size="lg"
        />
      }
      followersLinkSlot={
        <Link
          href={viewProps.followersHref}
          className="text-left transition hover:text-[var(--foreground)]"
        >
          <span className="font-display text-xl text-[var(--foreground)]">
            {viewProps.followersCount}
          </span>{" "}
          <span className="text-[var(--muted)]">Followers</span>
        </Link>
      }
      followingLinkSlot={
        <Link
          href={viewProps.followingHref}
          className="text-left transition hover:text-[var(--foreground)]"
        >
          <span className="font-display text-xl text-[var(--foreground)]">
            {viewProps.followingCount}
          </span>{" "}
          <span className="text-[var(--muted)]">Following</span>
        </Link>
      }
      engagementActionsSlot={
        <>
          <PublicProfileEngagementActions
            profile={profile}
            className="contents"
          />
          <PublicProfileDonateButton profile={profile} />
          <ProfileShareButton username={viewProps.username} />
        </>
      }
    />
  );
}
