"use client";

import { useState } from "react";

import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import {
  kitCreationCardGridCanonFixture,
  kitCreationCardGridDefaultFixture,
  kitCreationCardGridDisabledFixture,
  kitCreationCardGridLongestTitleFixture,
  kitCreationCardGridNoImageFixture,
  kitCreationCardGridWithDownloadFixture,
  kitCreationCardListDefaultFixture,
  kitCreationCardListDisabledFixture,
  kitCreationCardListNoImageFixture,
} from "@/components/kit/creation-card/KitCreationCard.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  gridDefault: { label: "Grid, default", props: kitCreationCardGridDefaultFixture },
  gridCanon: { label: "Grid, Canon", props: kitCreationCardGridCanonFixture },
  gridNoImage: { label: "Grid, no image", props: kitCreationCardGridNoImageFixture },
  gridLongest: { label: "Grid, longest title", props: kitCreationCardGridLongestTitleFixture },
  gridDownload: { label: "Grid, downloadable", props: kitCreationCardGridWithDownloadFixture },
  gridDisabled: { label: "Grid, disabled", props: kitCreationCardGridDisabledFixture },
  listDefault: { label: "List, default", props: kitCreationCardListDefaultFixture },
  listNoImage: { label: "List, no image", props: kitCreationCardListNoImageFixture },
  listDisabled: { label: "List, disabled", props: kitCreationCardListDisabledFixture },
};

export default function KitCreationCardPreviewClient() {
  const [activeKey, setActiveKey] = useState("gridDefault");
  const [localProps, setLocalProps] = useState(STATES.gridDefault.props);
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
      description="Grid (art-bleed) and list (row) layouts for the shared creation catalogue card. Image click and the Expand quick action share one onOpen destination; Share always carries icon plus the word."
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
          onOpen={() => setLastAction("Opened the lightbox (local preview only).")}
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
