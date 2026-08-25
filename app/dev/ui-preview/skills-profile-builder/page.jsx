import { notFound } from "next/navigation";
import SkillsProfileBuilderPreviewClient from "./SkillsProfileBuilderPreviewClient";

export default function SkillsProfileBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SkillsProfileBuilderPreviewClient />;
}
