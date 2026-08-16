import { notFound } from "next/navigation";
import ChatTranscriptPreviewClient from "./ChatTranscriptPreviewClient";

export default function ChatTranscriptPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatTranscriptPreviewClient />;
}
