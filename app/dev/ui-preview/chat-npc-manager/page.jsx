import { notFound } from "next/navigation";
import ChatNpcManagerPreviewClient from "./ChatNpcManagerPreviewClient";

export default function ChatNpcManagerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatNpcManagerPreviewClient />;
}
