import StudioPageHeader from "@/components/studio/StudioPageHeader";
import CommunityHub from "@/components/studio/community/CommunityHub";
import { getCommunityPageData } from "@/lib/server/studio/getCommunityPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CommunityPage() {
  const { creations, creators, loadError } = await getCommunityPageData();

  return (
    <>
      <StudioPageHeader eyebrow="Community" title="Community">
        Explore public creations, canon work, featured creators, and community
        activity across Crestfall.
      </StudioPageHeader>

      {loadError ? (
        <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
          Community creations could not be loaded: {loadError}
        </div>
      ) : null}

      <CommunityHub creations={creations} creators={creators} />
    </>
  );
}