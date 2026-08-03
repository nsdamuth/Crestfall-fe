import { notFound, redirect } from "next/navigation";

export default function LegacyCharacterMechanicsLoadoutEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  redirect("/dev/ui-preview/actor-mechanics-profile-editor");
}
