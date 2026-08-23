"use client";

import ChatPartyRosterView from "./chat-party-roster/ChatPartyRoster.view";
import { useChatPartyRosterViewModel } from "./chat-party-roster/useChatPartyRosterViewModel";

export default function ChatPartyRoster(props) {
  const viewProps = useChatPartyRosterViewModel(props);

  return <ChatPartyRosterView {...viewProps} />;
}
