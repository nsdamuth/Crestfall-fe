"use client";

import { useState } from "react";

import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import {
  kitCreationCardAdventureFixture,
  kitCreationCardCanonOverArtFixture,
  kitCreationCardCharacterFixture,
  kitCreationCardDisabledFixture,
  kitCreationCardImageFixture,
  kitCreationCardListDefaultFixture,
  kitCreationCardListDisabledFixture,
  kitCreationCardListNoImageFixture,
  kitCreationCardLongestTitleFixture,
  kitCreationCardNoImageFixture,
  kitCreationCardOwnWorkFixture,
  kitCreationCardStoryFixture,
} from "@/components/kit/creation-card/KitCreationCard.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  character: { label: "Grid, character", props: kitCreationCardCharacterFixture },
  story: { label: "Grid, story", props: kitCreationCardStoryFixture },
  adventure: { label: "Grid, adventure", props: kitCreationCardAdventureFixture },
  image: { label: "Grid, image", props: kitCreationCardImageFixture },
  canon: { label: "Grid, Canon over art", props: kitCreationCardCanonOverArtFixture },
  ownWork: { label: "Grid, own work (Private)", props: kitCreationCardOwnWorkFixture },
  noImage: { label: "Grid, no image", props: kitCreationCardNoImageFixture },
  longest: { label: "Grid, longest title", props: kitCreationCardLongestTitleFixture },
  disabled: { label: "Grid, disabled", props: kitCreationCardDisabledFixture },
  listDefault: { label: "List, default", props: kitCreationCardListDefaultFixture },
  listNoImage: { label: "List, no image", props: kitCreationCardListNoImageFixture },
  listDisabled: { label: "List, disabled", props: kitCreationCardListDisabledFixture },
};

export default function KitCreationCardPreviewClient() {
  const [activeKey, setActiveKey] = useState("character");
  const [localProps, setLocalProps] = useState(STATES.character.props);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No creation record or media reaction is connected."
  );

  function openState(key) {
    setActiveKey(key);
    setLocalProps(STATES[key].props);
    setLastAction(`Opened the ${STATES[key].label} fixture.`);
  }

  const isGrid = localProps.layout === "grid";

  const sharedCallbacks = {
    onOpenImageOverlay: () =>
      setLastAction("Opened the image overlay (local preview only)."),
    onOpenAssetDetail: () =>
      setLastAction(
        "Opened the asset detail popup placeholder (local preview only, not built this batch)."
      ),
    onLike: () =>
      setLocalProps((current) => ({ ...current, liked: !current.liked })),
    onBookmark: () =>
      setLocalProps((current) => ({
        ...current,
        bookmarked: !current.bookmarked,
      })),
  };

  return (
    <KitPreviewShell
      title="Kit Creation Card"
      description="Full-bleed art in both layouts, overlay icon actions, no bottom action bar (card law, 9 Aug 2026). Share, download, and delete live inside the open destination. Grid states render BOTH overlay-action placements side by side for Brian's pick."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      {isGrid ? (
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-[var(--space-5)] min-[700px]:grid-cols-2">
          <div className="flex flex-col gap-[var(--space-2)]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              Placement A · overlay-top
            </p>
            <KitCreationCardView
              {...localProps}
              actionPlacement="overlay-top"
              {...sharedCallbacks}
            />
          </div>
          <div className="flex flex-col gap-[var(--space-2)]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              Placement B · scrim-row
            </p>
            <KitCreationCardView
              {...localProps}
              actionPlacement="scrim-row"
              {...sharedCallbacks}
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <KitCreationCardView {...localProps} {...sharedCallbacks} />
        </div>
      )}
    </KitPreviewShell>
  );
}
