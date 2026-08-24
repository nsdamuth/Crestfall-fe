"use client";

import ChatShell from "@/components/studio/chat/ChatShell";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";
import { useChatV2StoryPageViewModel } from "./useChatV2StoryPageViewModel";

export default function StoryChatPage({ id }) {
  const viewProps = useChatV2StoryPageViewModel(id);

  return (
    <>
      <ChatShell
        backHref={viewProps.backHref}
        backLabel={viewProps.backLabel}
        eyebrow={viewProps.eyebrow}
        title={viewProps.title}
        scenarioLabel={viewProps.scenarioLabel}
        modeLabel={viewProps.modeLabel}
        statusPills={viewProps.statusPills}
        coinChip={{ balanceLabel: viewProps.coinBalanceLabel }}
        loading={viewProps.loading}
        errorMessage={viewProps.errorMessage}
        transcript={viewProps.transcript}
        composer={viewProps.composer}
        castPanel={viewProps.castPanel}
        statePanel={viewProps.statePanel}
        sessionDialogs={viewProps.sessionDialogs}
        libraryPassUpsell={viewProps.libraryPassUpsell}
        partyRoster={viewProps.partyRoster}
      />

      <FixtureActionNotice
        notice={viewProps.sceneImagePickerNotice}
        onClose={viewProps.onCloseSceneImagePicker}
      />
    </>
  );
}
