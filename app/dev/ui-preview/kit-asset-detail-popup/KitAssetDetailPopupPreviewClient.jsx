"use client";

import { useState } from "react";

import KitAssetDetailPopup from "@/components/kit/KitAssetDetailPopup";
import {
  kitAssetDetailPopupAdventureFixture,
  kitAssetDetailPopupCharacterFixture,
  kitAssetDetailPopupLikedAndSavedFixture,
  kitAssetDetailPopupLongestCopyFixture,
  kitAssetDetailPopupNoCreatorNoTagsFixture,
  kitAssetDetailPopupNoImageFixture,
  kitAssetDetailPopupOwnWorkFixture,
  kitAssetDetailPopupStoryFixture,
} from "@/components/kit/asset-detail-popup/KitAssetDetailPopup.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  character: { label: "Character", props: kitAssetDetailPopupCharacterFixture },
  story: { label: "Story", props: kitAssetDetailPopupStoryFixture },
  adventure: { label: "Adventure", props: kitAssetDetailPopupAdventureFixture },
  likedAndSaved: { label: "Liked and saved", props: kitAssetDetailPopupLikedAndSavedFixture },
  longestCopy: { label: "Longest copy", props: kitAssetDetailPopupLongestCopyFixture },
  noImage: { label: "No image", props: kitAssetDetailPopupNoImageFixture },
  ownWork: { label: "Own work (Edit action)", props: kitAssetDetailPopupOwnWorkFixture },
  noCreatorNoTags: {
    label: "No creator link, no tags",
    props: kitAssetDetailPopupNoCreatorNoTagsFixture,
  },
};

export default function KitAssetDetailPopupPreviewClient() {
  const [openKey, setOpenKey] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastAction, setLastAction] = useState(
    "Choose a fixture to open the popup."
  );

  const active = openKey ? STATES[openKey] : null;

  return (
    <KitPreviewShell
      title="Kit Asset Detail Popup"
      description="The destination every character, story, and adventure card opens, composed on the unified modal frame. Primary action is Play for every asset kind (R9)."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={openKey}
      onSelectState={(key) => {
        setOpenKey(key);
        setIsLiked(Boolean(STATES[key].props.isLiked));
        setIsSaved(Boolean(STATES[key].props.isSaved));
        setLastAction(`Opened the ${STATES[key].label} fixture.`);
      }}
      note={lastAction}
    >
      <div className="flex flex-wrap gap-[var(--space-3)]">
        {Object.entries(STATES).map(([key, state]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setOpenKey(key);
              setIsLiked(Boolean(state.props.isLiked));
              setIsSaved(Boolean(state.props.isSaved));
              setLastAction(`Opened the ${state.label} fixture.`);
            }}
            className="kit-focus cf-btn cf-btn--secondary"
          >
            Open {state.label}
          </button>
        ))}
      </div>

      {active && (
        <KitAssetDetailPopup
          {...active.props}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={() => setIsLiked((current) => !current)}
          onSave={() => setIsSaved((current) => !current)}
          onPrimaryAction={() =>
            setLastAction(`${STATES[openKey].label}: primary action fired.`)
          }
          onShare={() => setLastAction(`${STATES[openKey].label}: shared.`)}
          onViewCatalogue={() =>
            setLastAction(`${STATES[openKey].label}: view catalogue fired.`)
          }
          onEdit={
            active.props.onEdit
              ? () => setLastAction(`${STATES[openKey].label}: edit fired.`)
              : undefined
          }
          onClose={() => {
            setOpenKey(null);
            setLastAction("Closed.");
          }}
        />
      )}
    </KitPreviewShell>
  );
}
