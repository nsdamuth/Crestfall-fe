import { notFound } from "next/navigation";
import ChatCastPanelPreviewClient from "./ChatCastPanelPreviewClient";

export default function ChatCastPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatCastPanelPreviewClient />;
}
