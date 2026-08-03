import { notFound } from "next/navigation";

import ProfileBackButtonPreviewClient from "./ProfileBackButtonPreviewClient";

export default function ProfileBackButtonPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ProfileBackButtonPreviewClient />;
}
