"use client";

import ChatShellView from "./chat-shell/ChatShell.view";
import { useChatShellViewModel } from "./chat-shell/useChatShellViewModel";

export default function ChatShell(props) {
  const viewProps = useChatShellViewModel(props);
  return <ChatShellView {...viewProps} />;
}
