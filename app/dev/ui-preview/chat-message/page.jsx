import { notFound } from "next/navigation";
import ChatMessagePreviewClient from "./ChatMessagePreviewClient";

export default function ChatMessagePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatMessagePreviewClient />;
}
