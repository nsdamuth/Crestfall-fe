import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StudioComingSoon from "@/components/studio/StudioComingSoon";

export default async function SubmitCanonPage() {

  return (
    <>
      <StudioPageHeader
        eyebrow="Submit to Canon"
        title="Earn a Place in the Chronicle"
        description="Submit standout characters, rooms, events, or storylines for review. Canon approval is curated, rare, and continuity-protected."/>
      <StudioComingSoon
        title="What this section will support"
        items={[
          "Feature one",
          "Feature two",
          "Feature three",
        ]}
      >
        This page is prepared as part of the Studio shell. Backend behavior will be connected later.
      </StudioComingSoon>
    </>
  );
}