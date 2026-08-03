import { notFound } from "next/navigation";

import SkinTonePreviewClient from "./SkinTonePreviewClient";

export default function SkinTonePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <SkinTonePreviewClient />;
}
