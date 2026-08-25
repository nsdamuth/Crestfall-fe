import { notFound } from "next/navigation";
import SkillsProfileEditorPreviewClient from "./SkillsProfileEditorPreviewClient";

export default function SkillsProfileEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SkillsProfileEditorPreviewClient />;
}
