import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StorylinesHub from "@/components/studio/storylines/StorylinesHub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StorylinesPage() {
  return (
    <>
      <StudioPageHeader
        eyebrow="Storylines"
        title="Continuing Narrative Paths"
        description="Sequence Stories and Scenarios inside one continuing chat, preserve open-world continuity between them, and define what makes the next node available."
      />
      <StorylinesHub />
    </>
  );
}
