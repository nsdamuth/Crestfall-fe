import DetailPage from "@/components/DetailPage";
import { getIntro } from "@/data/intro";
import { notFound } from "next/navigation";

export default function IntroPage() {
  const intro = getIntro();

  if (!intro) {
    notFound();
  }

  return <DetailPage entry={intro} />;
}