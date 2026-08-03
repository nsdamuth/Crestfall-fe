import DetailPage from "@/components/DetailPage";
import { getFactionByPath } from "@/data/factions";
import { notFound } from "next/navigation";

export default async function FactionDetailPage({ params }) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const faction = getFactionByPath(slugPath);

  if (!faction) {
    notFound();
  }

  return <DetailPage entry={faction} />;
}