import { notFound } from "next/navigation";

import ProfileMediaManagerPreviewClient from "./ProfileMediaManagerPreviewClient";

export default function ProfileMediaManagerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ProfileMediaManagerPreviewClient />;
}
