import StudioPageHeader from "@/components/studio/StudioPageHeader";
import CreationEditShell from "@/components/studio/my-creations/CreationEditShell";
import { getEditCreationPageData } from "@/lib/server/studio/getEditCreationPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditCreationPage({ params }) {
  const { id } = await params;
  const { creation } = await getEditCreationPageData(id);

  return (
    <>
      <StudioPageHeader eyebrow="My Creations" title="Edit Creation">
        Refine, manage, publish, and prepare this creation for future review.
      </StudioPageHeader>

      <CreationEditShell creationId={id} creation={creation} />
    </>
  );
}