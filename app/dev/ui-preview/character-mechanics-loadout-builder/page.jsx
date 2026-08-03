import { notFound, redirect } from "next/navigation";

export default function LegacyCharacterMechanicsLoadoutBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  redirect("/dev/ui-preview/actor-mechanics-profile-builder");
}
