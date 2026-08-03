import { notFound } from "next/navigation";

import CreateTypeCardPreviewClient from "./CreateTypeCardPreviewClient";

export default function CreateTypeCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreateTypeCardPreviewClient />;
}
