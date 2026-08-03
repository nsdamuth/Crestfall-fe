import { notFound } from "next/navigation";

import CharacterReviewStepPreviewClient from "./CharacterReviewStepPreviewClient";

export default function CharacterReviewStepPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <CharacterReviewStepPreviewClient />;
}
