import { notFound } from "next/navigation";

import MediaLightboxPreviewClient from "./MediaLightboxPreviewClient";

export default function MediaLightboxPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <MediaLightboxPreviewClient />;
}
