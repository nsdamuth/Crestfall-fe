import { notFound } from "next/navigation";
import WardrobeBuilderPreviewClient from "./WardrobeBuilderPreviewClient";

export default function WardrobeBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <WardrobeBuilderPreviewClient />;
}
