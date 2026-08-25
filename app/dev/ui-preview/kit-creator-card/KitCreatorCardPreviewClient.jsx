"use client";

import { useState } from "react";

import KitCreatorCardView from "@/components/kit/creator-card/KitCreatorCard.view";
import {
  kitCreatorCardFollowedFixture,
  kitCreatorCardLongestHandleFixture,
  kitCreatorCardOneImageFixture,
  kitCreatorCardThreeImagesFixture,
  kitCreatorCardZeroImagesFixture,
} from "@/components/kit/creator-card/KitCreatorCard.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  three: { label: "Three images", props: kitCreatorCardThreeImagesFixture },
  one: { label: "One image", props: kitCreatorCardOneImageFixture },
  zero: { label: "Zero images", props: kitCreatorCardZeroImagesFixture },
  followed: { label: "Followed", props: kitCreatorCardFollowedFixture },
  longest: { label: "Longest handle", props: kitCreatorCardLongestHandleFixture },
};

export default function KitCreatorCardPreviewClient() {
  const [activeKey, setActiveKey] = useState("three");
  const [localProps, setLocalProps] = useState(STATES.three.props);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No creator record or follow API is connected."
  );

  function openState(key) {
    setActiveKey(key);
    setLocalProps(STATES[key].props);
    setLastAction(`Opened the ${STATES[key].label} fixture.`);
  }

  return (
    <KitPreviewShell
      title="Kit Creator Card"
      description="Creator identity, up to three recent-work thumbnails (each opening the image overlay), Follow and View profile as soft-cornered rectangles, never pills."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      <div className="mx-auto max-w-sm">
        <KitCreatorCardView
          {...localProps}
          onThumbnailOpen={(id) =>
            setLastAction(`Opened the image overlay for thumbnail "${id}" (local preview only).`)
          }
          onFollow={() =>
            setLocalProps((current) => ({ ...current, isFollowing: !current.isFollowing }))
          }
          onViewProfile={() => setLastAction("Navigated to the profile (local preview only).")}
        />
      </div>
    </KitPreviewShell>
  );
}
