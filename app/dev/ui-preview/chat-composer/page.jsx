import { notFound } from "next/navigation";
import ChatComposerPreviewClient from "./ChatComposerPreviewClient";

export default function ChatComposerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatComposerPreviewClient />;
}
