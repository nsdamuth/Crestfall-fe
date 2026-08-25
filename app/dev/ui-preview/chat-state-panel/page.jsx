import { notFound } from "next/navigation";
import ChatStatePanelPreviewClient from "./ChatStatePanelPreviewClient";

export default function ChatStatePanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatStatePanelPreviewClient />;
}
