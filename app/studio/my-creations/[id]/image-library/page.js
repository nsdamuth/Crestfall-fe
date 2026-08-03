import StudioPageHeader from "@/components/studio/StudioPageHeader";
import CreationImageLibraryPage from "@/components/studio/my-creations/image-library/CreationImageLibraryPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyCreationImageLibraryRoute({ params }) {
  const { id } = await params;

  return (
    <>
      <CreationImageLibraryPage creationId={id} />
    </>
  );
}