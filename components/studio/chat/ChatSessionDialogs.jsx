"use client";

import ChatSessionDialogsView from "./chat-session-dialogs/ChatSessionDialogs.view";
import { useChatSessionDialogsViewModel } from "./chat-session-dialogs/useChatSessionDialogsViewModel";

export default function ChatSessionDialogs(props) {
  const viewProps = useChatSessionDialogsViewModel(props);

  return <ChatSessionDialogsView {...viewProps} />;
}
