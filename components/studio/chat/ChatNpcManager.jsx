"use client";

import ChatNpcManagerView from "./chat-npc-manager/ChatNpcManager.view";
import { useChatNpcManagerViewModel } from "./chat-npc-manager/useChatNpcManagerViewModel";

export default function ChatNpcManager(props) {
  const viewProps = useChatNpcManagerViewModel(props);

  return <ChatNpcManagerView {...viewProps} />;
}
