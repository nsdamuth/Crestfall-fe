import { notFound } from "next/navigation";

import ModalFramePreviewClient from "./ModalFramePreviewClient";

export default function ModalFramePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ModalFramePreviewClient />;
}
