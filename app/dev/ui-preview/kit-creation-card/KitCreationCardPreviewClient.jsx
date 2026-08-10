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
  kitCreationCardStoryFixture,
  kitCreationCardWithDownloadFixture,
} from "@/components/kit/creation-card/KitCreationCard.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  character: { label: "Grid, character", props: kitCreationCardCharacterFixture },
  story: { label: "Grid, story", props: kitCreationCardStoryFixture },
  adventure: { label: "Grid, adventure", props: kitCreationCardAdventureFixture },
  image: { label: "Grid, image", props: kitCreationCardImageFixture },
  canon: { label: "Grid, Canon over art", props: kitCreationCardCanonOverArtFixture },
  noImage: { label: "Grid, no image", props: kitCreationCardNoImageFixture },
  longest: { label: "Grid, longest title", props: kitCreationCardLongestTitleFixture },
  download: { label: "Grid, downloadable", props: kitCreationCardWithDownloadFixture },
  disabled: { label: "Grid, disabled", props: kitCreationCardDisabledFixture },
  listDefault: { label: "List, default", props: kitCreationCardListDefaultFixture },
  listNoImage: { label: "List, no image", props: kitCreationCardListNoImageFixture },
  listDisabled: { label: "List, disabled", props: kitCreationCardListDisabledFixture },
};

export default function KitCreationCardPreviewClient() {
  const [activeKey, setActiveKey] = useState("character");
  const [localProps, setLocalProps] = useState(STATES.character.props);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No creation record, media reaction, or delete is connected."
  );

  function openState(key) {
    setActiveKey(key);
    setLocalProps(STATES[key].props);
    setLastAction(`Opened the ${STATES[key].label} fixture.`);
  }

  const isGrid = localProps.layout === "grid";

  return (
    <KitPreviewShell
      title="Kit Creation Card"
      description="The image-first media card template. Image click and Expand route by assetKind: image opens the image overlay, character/story/adventure open the asset detail popup (stubbed this batch)."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      <div className={`mx-auto ${isGrid ? "w-64" : "max-w-2xl"}`}>
        <KitCreationCardView
          {...localProps}
          onOpenImageOverlay={() =>
            setLastAction("Opened the image overlay (local preview only).")
          }
          onOpenAssetDetail={() =>
            setLastAction(
              "Opened the asset detail popup placeholder (local preview only, not built this batch)."
            )
          }
          onShare={() => setLastAction("Shared (local preview only).")}
          onLike={() =>
            setLocalProps((current) => ({ ...current, liked: !current.liked }))
          }
          onBookmark={() =>
            setLocalProps((current) => ({
              ...current,
              bookmarked: !current.bookmarked,
            }))
          }
          onDownload={() => setLastAction("Downloaded (local preview only).")}
          onDelete={() => setLastAction("Deleted (local preview only, after confirm).")}
        />
      </div>
    </KitPreviewShell>
  );
}
