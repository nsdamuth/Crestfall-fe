import { notFound } from "next/navigation";

import ProfileShareButtonPreviewClient from "./ProfileShareButtonPreviewClient";

export default function ProfileShareButtonPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ProfileShareButtonPreviewClient />;
}
