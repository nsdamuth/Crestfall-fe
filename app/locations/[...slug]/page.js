import DetailPage from "@/components/DetailPage";
import { getLocationByPath } from "@/data/locations";
import { notFound } from "next/navigation";

export default async function LocationDetailPage({ params }) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const location = getLocationByPath(slugPath);

  if (!location) {
    notFound();
  }

  return <DetailPage entry={location} />;
}