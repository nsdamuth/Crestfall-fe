import { notFound } from "next/navigation";
import StatsPoolsBuilderPreviewClient from "./StatsPoolsBuilderPreviewClient";

export default function StatsPoolsBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <StatsPoolsBuilderPreviewClient />;
}
