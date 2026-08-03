import { getCharacters } from "@/data/characters";
import OfficialCharactersGrid from "@/components/studio/OfficialCharactersGrid";
import StudioPageHeader from "@/components/studio/StudioPageHeader";

export default async function OfficialCharactersPage() {
  const characters = getCharacters();

  return (
    <>
    <StudioPageHeader
      eyebrow="Official Characters"
      title="Canon Interactive Cast"
      description="Browse approved Crestfall characters available for canon-aware play, story rooms, and official Chronicle events."
    />

      <section className="mt-8">
        <OfficialCharactersGrid characters={characters} />
      </section>
    </>
  );
}