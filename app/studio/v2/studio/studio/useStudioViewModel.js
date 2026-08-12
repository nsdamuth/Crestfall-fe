"use client";

// Normalizes studioContent.mock.js into Studio.view.jsx props and owns
// every piece of presentation-only local state: the active ladder
// level and the R4 fixture-action notice. Routing is not owned here:
// the Shell passes onNavigate (real Next.js navigation, used only for
// the bottom banner's built /studio/v2/images destination),
// onOpenCharacterCreator, and onOpenWorldCreator (the Shell's own
// state, since CharacterCreatorModal and WorldCreatorModal are both
// live-wired, not fixture data). Every other control (every Soon door,
// every Soon tool card, the Story bridge action) opens the honest R4
// stub notice: none of those destinations exist yet
// (docs/STUDIO-SPEC.md section 9, items 2 and 3).
import { useMemo, useState } from "react";

import {
  STUDIO_LEVELS,
  STUDIO_DOORS,
  STUDIO_TOOL_GROUPS,
  STUDIO_HUB_EXPLAINER,
  STUDIO_STORY_BRIDGE,
  STUDIO_GUIDED_BUILD_SOON,
  STUDIO_BOTTOM_BANNER,
} from "./studioContent.mock";

// docs/STUDIO-SPEC.md section 8.1 names three fixture states (default,
// empty, longest content). This hub has no user-owned data list to
// vary in count, so the three states are mapped onto the ladder's own
// three altitudes, which are the only content variety the page
// carries: default -> Quick Start (the doors, the primary surface),
// empty -> Guided Build (the quietest pane, no doors or cards, one
// placeholder message), longestContent -> Full Studio (the
// densest pane, every tool group and card rendered at once).
export function useStudioViewModel({ fixtureMode = "default", onNavigate = null, onOpenCharacterCreator = null, onOpenWorldCreator = null } = {}) {
  const initialLevel = fixtureMode === "empty" ? "guidedBuild" : fixtureMode === "longestContent" ? "fullStudio" : "quickStart";
  const [activeLevelId, setActiveLevelId] = useState(initialLevel);
  const [notice, setNotice] = useState(null);

  function openNotice(label, message) {
    setNotice({ label, message });
  }

  function openSoon(label) {
    openNotice(label, `${label} isn't built yet. This door will open its own creator once it exists.`);
  }

  // Each live door opens its own creator; door.id, not just door.isLive,
  // picks which one now that Character and Worlds are both live.
  const doors = useMemo(
    () =>
      STUDIO_DOORS.map((door) => ({
        ...door,
        onOpen: !door.isLive
          ? () => openSoon(door.label)
          : door.id === "location"
            ? () => onOpenWorldCreator?.()
            : () => onOpenCharacterCreator?.(),
      })),
    [onOpenCharacterCreator, onOpenWorldCreator]
  );

  const toolGroups = useMemo(
    () =>
      STUDIO_TOOL_GROUPS.map((group) => ({
        ...group,
        cards: group.cards.map((card) => ({
          ...card,
          onOpen: card.isLive ? () => onOpenCharacterCreator?.() : () => openSoon(card.title),
        })),
      })),
    [onOpenCharacterCreator]
  );

  const storyBridge = {
    ...STUDIO_STORY_BRIDGE,
    onAction: () =>
      openNotice(
        STUDIO_STORY_BRIDGE.actionLabel,
        "Guided Build isn't open yet, so there is no Story to add this to. Nothing was created in this preview."
      ),
  };

  const bottomBanner = {
    ...STUDIO_BOTTOM_BANNER,
    onCtaClick: () => onNavigate?.(STUDIO_BOTTOM_BANNER.route),
  };

  return {
    levels: STUDIO_LEVELS,
    activeLevelId,
    onSelectLevel: setActiveLevelId,
    hubExplainer: STUDIO_HUB_EXPLAINER,
    doors,
    storyBridge,
    guidedBuildSoon: STUDIO_GUIDED_BUILD_SOON,
    toolGroups,
    bottomBanner,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
