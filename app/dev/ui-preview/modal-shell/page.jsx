import { notFound } from "next/navigation";

import ModalShellPreviewClient from "./ModalShellPreviewClient";

export default function ModalShellPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ModalShellPreviewClient />;
}
