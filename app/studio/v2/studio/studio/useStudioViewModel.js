"use client";

// Normalizes studioContent.mock.js into Studio.view.jsx props and owns
// the R4 fixture-action notice (presentation-only local state).
// UPDATED 24 Aug 2026 (V2 convergence product override): restores the
// user-facing Quick Start / Guided Build / Full Studio mode choice and
// persists it through the shared Creation Studio storage key. Routing is
// not owned here: the Shell passes onNavigate (real Next.js
// navigation), onOpenCharacterCreator, onOpenWorldCreator,
// onOpenLookCreator, and onOpenStoryCreator (the Shell's own state,
// since all four quick creates are live-wired, not fixture data).
// Every Soon door opens the honest R4 stub notice: none of those
// destinations exist yet (docs/STUDIO-SPEC.md section 9, items 2
// and 3).
import { useEffect, useState } from "react";

import {
  CREATION_STUDIO_MODE_STORAGE_KEY,
  CREATION_STUDIO_MODES,
} from "@/components/studio/create/creation-studio/CreationStudio.contract.mjs";

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
  const [activeMode, setActiveMode] = useState(CREATION_STUDIO_MODES.QUICK);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const requestedMode = String(params.get("mode") || "").trim().toLowerCase();
      const requestedModeValue = {
        quick: CREATION_STUDIO_MODES.QUICK,
        guided: CREATION_STUDIO_MODES.GUIDED,
        full: CREATION_STUDIO_MODES.FULL,
      }[requestedMode];

      if (requestedModeValue) {
        setActiveMode(requestedModeValue);
        window.localStorage.setItem(CREATION_STUDIO_MODE_STORAGE_KEY, requestedModeValue);
        return;
      }

      const storedMode = window.localStorage.getItem(CREATION_STUDIO_MODE_STORAGE_KEY);
      if (Object.values(CREATION_STUDIO_MODES).includes(storedMode)) {
        setActiveMode(storedMode);
      }
    } catch {
      // Quick Start remains the product default when URL/storage state is unavailable.
    }
  }, []);

  function selectMode(nextMode) {
    const normalizedMode = Object.values(CREATION_STUDIO_MODES).includes(nextMode)
      ? nextMode
      : CREATION_STUDIO_MODES.QUICK;

    setActiveMode(normalizedMode);

    try {
      window.localStorage.setItem(CREATION_STUDIO_MODE_STORAGE_KEY, normalizedMode);
    } catch {
      // Persistence is a convenience; mode selection still works for this session.
    }
  }

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

  const modeOptions = [
    {
      id: CREATION_STUDIO_MODES.QUICK,
      numeral: "I",
      label: "Quick Start",
      description: "Make assets, characters, places, outfits, and start creating fast.",
    },
    {
      id: CREATION_STUDIO_MODES.GUIDED,
      numeral: "II",
      label: "Guided Build",
      description: "Follow a guided path from core assets into a playable Story.",
    },
    {
      id: CREATION_STUDIO_MODES.FULL,
      numeral: "III",
      label: "Full Studio",
      description: "Every builder, registry, template, and mechanics tool in one workspace.",
    },
  ];

  return {
    hubExplainer: STUDIO_HUB_EXPLAINER,
    modeOptions,
    activeMode,
    onSelectMode: selectMode,
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
