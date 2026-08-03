import { notFound } from "next/navigation";

import ProfileFollowButtonPreviewClient from "./ProfileFollowButtonPreviewClient";

export default function ProfileFollowButtonPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ProfileFollowButtonPreviewClient />;
}
