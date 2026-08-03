import DetailPage from "@/components/DetailPage";
import { getCharacterByPath } from "@/data/characters";
import { notFound } from "next/navigation";

export default async function CharacterDetailPage({ params }) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const character = getCharacterByPath(slugPath);

  if (!character) {
    notFound();
  }

  return <DetailPage entry={character} />;
}