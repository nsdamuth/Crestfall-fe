"use client";

import { useState } from "react";

import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import {
  kitCreationCardAdventureFixture,
  kitCreationCardCanonOverArtFixture,
  kitCreationCardCharacterFixture,
  kitCreationCardCharacterPlayActionFixture,
  kitCreationCardDisabledFixture,
  kitCreationCardGenerateActionFixture,
  kitCreationCardImageFixture,
  kitCreationCardListDefaultFixture,
  kitCreationCardListDisabledFixture,
  kitCreationCardListNoImageFixture,
  kitCreationCardLongestTitleFixture,
  kitCreationCardNoImageFixture,
  kitCreationCardOwnerKebabFixture,
  kitCreationCardOwnerKebabListFixture,
  kitCreationCardOwnWorkFixture,
  kitCreationCardPlayActionFixture,
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
  playAction: { label: "Grid, story (play action)", props: kitCreationCardPlayActionFixture },
  characterPlayAction: {
    label: "Grid, character (Start Chat, NEW LAW A)",
    props: kitCreationCardCharacterPlayActionFixture,
  },
  generateAction: { label: "Grid, image (generate action)", props: kitCreationCardGenerateActionFixture },
  ownerKebab: { label: "Grid, owner kebab menu (NEW LAW A)", props: kitCreationCardOwnerKebabFixture },
  listDefault: { label: "List, default", props: kitCreationCardListDefaultFixture },
  listNoImage: { label: "List, no image", props: kitCreationCardListNoImageFixture },
  listDisabled: { label: "List, disabled", props: kitCreationCardListDisabledFixture },
  listOwnerKebab: {
    label: "List, owner kebab menu (NEW LAW A)",
    props: kitCreationCardOwnerKebabListFixture,
  },
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

  // Only wraps onPlay/onGenerate when the active fixture defines one,
  // so every other fixture keeps exercising the expand fallback.
  const contextualCallbacks = {
    ...(localProps.onPlay
      ? { onPlay: () => setLastAction("Start Chat fired (local preview only).") }
      : {}),
    ...(localProps.onGenerate
      ? { onGenerate: () => setLastAction("Generate fired (local preview only).") }
      : {}),
  };

  // Owner kebab menu (NEW LAW A, 22 Aug 2026): only wired when the
  // active fixture is owner-gated, same pattern as the contextual
  // callbacks above.
  const kebabCallbacks = localProps.isOwner
    ? {
        onEdit: () => setLastAction("Edit fired (local preview only)."),
        onGenerateImage: () => setLastAction("Generate Image fired (local preview only)."),
        onShare: () => setLastAction("Share fired (local preview only)."),
        onArchive: () => setLastAction("Archive is not wired yet (CR-056)."),
        onDelete: () => setLastAction("Delete fired (local preview only)."),
      }
    : {};

  return (
    <KitPreviewShell
      title="Kit Creation Card"
      description="Full-bleed art in both layouts, overlay icon actions, no bottom action bar (card law, 9 Aug 2026). Share, download, and delete live inside the open destination. Overlay-action placement is ruled overlay-top everywhere (10 Aug 2026)."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      {isGrid ? (
        <div className="mx-auto max-w-sm">
          <KitCreationCardView
            {...localProps}
            {...sharedCallbacks}
            {...contextualCallbacks}
            {...kebabCallbacks}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <KitCreationCardView
            {...localProps}
            {...sharedCallbacks}
            {...contextualCallbacks}
            {...kebabCallbacks}
          />
        </div>
      )}
    </KitPreviewShell>
  );
}
