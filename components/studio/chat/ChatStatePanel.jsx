"use client";

import ChatStatePanelView from "./chat-state-panel/ChatStatePanel.view";
import { useChatStatePanelViewModel } from "./chat-state-panel/useChatStatePanelViewModel";

export default function ChatStatePanel(props) {
  const viewProps = useChatStatePanelViewModel(props);

  return <ChatStatePanelView {...viewProps} />;
}
