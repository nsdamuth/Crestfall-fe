import CreatorProfileLive from "../CreatorProfileLive";
import { getPublicProfilePageData } from "@/lib/server/studio/getPublicProfilePageData";
import { getPublicProfileDonationEvents } from "@/lib/server/studio/getPublicProfileDonationEvents";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreatorProfileV2Page({ params }) {
  const { handle } = await params;
  const pageData = await getPublicProfilePageData(handle);
  const donationData = await getPublicProfileDonationEvents({
    profileId: pageData?.profile?.id,
  });

  return (
    <CreatorProfileLive
      pageData={{
        ...pageData,
        donationEvents: donationData.donationEvents,
        donationLoadError: donationData.loadError,
      }}
    />
  );
}
