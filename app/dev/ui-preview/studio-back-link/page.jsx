import { notFound } from "next/navigation";
import StudioBackLinkPreviewClient from "./StudioBackLinkPreviewClient";

export default function StudioBackLinkPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioBackLinkPreviewClient />;
}
