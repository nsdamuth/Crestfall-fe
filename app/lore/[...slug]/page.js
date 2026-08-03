import DetailPage from "@/components/DetailPage";
import { getLoreEntryByPath } from "@/data/lore";
import { notFound } from "next/navigation";

export default async function LoreDetailPage({ params }) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const entry = getLoreEntryByPath(slugPath);

  if (!entry) {
    notFound();
  }

  return <DetailPage entry={entry} />;
}