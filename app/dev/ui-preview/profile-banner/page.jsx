import { notFound } from "next/navigation";

import ProfileBannerPreviewClient from "./ProfileBannerPreviewClient";

export default function ProfileBannerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ProfileBannerPreviewClient />;
}
