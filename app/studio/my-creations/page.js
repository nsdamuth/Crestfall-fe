import StudioPageHeader from "@/components/studio/StudioPageHeader";
import MyCreationsHub from "@/components/studio/my-creations/MyCreationsHub";
import { getMyCreationsPageData } from "@/lib/server/studio/getMyCreationsPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyCreationsPage() {
  const { creations, loadError } = await getMyCreationsPageData();

  return (
    <>
      <StudioPageHeader eyebrow="Studio" title="My Creations">
        Manage your drafts, private creations, shared assets, review status, and
        future canon submissions.
      </StudioPageHeader>

      {loadError ? (
        <div className="mt-8 rounded-[var(--radius-md)] border border-red-400/25 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
          Creations could not be loaded: {loadError}
        </div>
      ) : null}

      <MyCreationsHub creations={creations} />
    </>
  );
}