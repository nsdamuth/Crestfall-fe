import { notFound } from "next/navigation";
import ChatSessionDialogsPreviewClient from "./ChatSessionDialogsPreviewClient";

export default function ChatSessionDialogsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatSessionDialogsPreviewClient />;
}
