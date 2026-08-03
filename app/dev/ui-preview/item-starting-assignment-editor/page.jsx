import { notFound } from "next/navigation";

import ItemStartingAssignmentEditorPreviewClient from "./ItemStartingAssignmentEditorPreviewClient";

export default function ItemStartingAssignmentEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ItemStartingAssignmentEditorPreviewClient />;
}
