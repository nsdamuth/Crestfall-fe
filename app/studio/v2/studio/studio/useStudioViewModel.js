"use client";

// Normalizes studioContent.mock.js into Studio.view.jsx props and owns
// the R4 fixture-action notice (presentation-only local state).
// RESHAPED 23 Aug 2026 (build-0823 pass 4, RULED): the altitude-level
// local state is removed along with the tablist it drove. Routing is
// not owned here: the Shell passes onNavigate (real Next.js
// navigation), onOpenCharacterCreator, onOpenWorldCreator,
// onOpenLookCreator, and onOpenStoryCreator (the Shell's own state,
// since all four quick creates are live-wired, not fixture data).
// Every Soon door opens the honest R4 stub notice: none of those
// destinations exist yet (docs/STUDIO-SPEC.md section 9, items 2
// and 3).
import { useState } from "react";

import {
  STUDIO_DOORS,
  STUDIO_HUB_EXPLAINER,
  STUDIO_BOTTOM_BANNER,
} from "./studioContent.mock";

// Door id -> the opener prop it calls when live: data, not branches.
const DOOR_OPENER_PROP_BY_ID = {
  character: "onOpenCharacterCreator",
  location: "onOpenWorldCreator",
  outfit: "onOpenLookCreator",
  story: "onOpenStoryCreator",
};

export function useStudioViewModel({
  fixtureMode = "default",
  onNavigate = null,
  onOpenCharacterCreator = null,
  onOpenWorldCreator = null,
  onOpenLookCreator = null,
  onOpenStoryCreator = null,
} = {}) {
  const [notice, setNotice] = useState(null);

  function openNotice(label, message) {
    setNotice({ label, message });
  }

  function openSoon(label) {
    openNotice(label, `${label} isn't built yet. This door will open its own creator once it exists.`);
  }

  const openerByPropName = {
    onOpenCharacterCreator,
    onOpenWorldCreator,
    onOpenLookCreator,
    onOpenStoryCreator,
  };

  const baseDoors =
    fixtureMode === "empty"
      ? []
      : fixtureMode === "longestContent"
        ? STUDIO_DOORS.map((door) => ({
            ...door,
            description: `${door.description} ${door.description}`,
          }))
        : STUDIO_DOORS;

  const doors = baseDoors.map((door) => {
    if (!door.isLive) {
      return { ...door, onOpen: () => openSoon(door.label) };
    }

    const opener = openerByPropName[DOOR_OPENER_PROP_BY_ID[door.id]];
    return { ...door, onOpen: () => opener?.() };
  });

  const bottomBanner = {
    ...STUDIO_BOTTOM_BANNER,
    onCtaClick: () => onNavigate?.(STUDIO_BOTTOM_BANNER.route),
  };

  return {
    hubExplainer: STUDIO_HUB_EXPLAINER,
    doors,
    onOpenAdvancedEditor: () => onNavigate?.("/studio/v2/editor"),
    onBuildStory: () => onOpenStoryCreator?.(),
    onBuildAdventure: () => onNavigate?.("/studio/v2/adventures"),
    onOpenVault: () => onNavigate?.("/studio/v2/vault"),
    bottomBanner,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
