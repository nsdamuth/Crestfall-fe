import { notFound } from "next/navigation";

import ProfileAvatarPreviewClient from "./ProfileAvatarPreviewClient";

export default function ProfileAvatarPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ProfileAvatarPreviewClient />;
}
