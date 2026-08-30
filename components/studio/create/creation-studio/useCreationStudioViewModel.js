"use client";

import { useEffect, useMemo, useState } from "react";
import creationAssets from "@/data/creationAssets";
import registryTypes from "@/data/registryTypes";
import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import {
  CREATION_STUDIO_MODE_STORAGE_KEY,
  CREATION_STUDIO_MODES,
  LORE_CREATION_ASSET,
  QUICK_START_ASSET_TITLES,
  buildCreationTypeCounts,
  buildFullStudioSections,
  buildGuidedChapterStates,
  getAssetsByTitle,
  getGuidedProgress,
  getRecommendedGuidedStep,
  normalizeCreationStudioMode,
} from "./CreationStudio.contract.mjs";

export function useCreationStudioViewModel() {
  const [mode, setModeState] = useState(CREATION_STUDIO_MODES.GUIDED);
  const [creations, setCreations] = useState([]);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [countLoadError, setCountLoadError] = useState("");

  useEffect(() => {
    try {
      const storedMode = window.localStorage.getItem(
        CREATION_STUDIO_MODE_STORAGE_KEY
      );

      setModeState(normalizeCreationStudioMode(storedMode));
    } catch {
      setModeState(CREATION_STUDIO_MODES.GUIDED);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadOwnedCreationCounts() {
      setIsLoadingCounts(true);
      setCountLoadError("");

      try {
        const ownedCreations = await fetchOwnedCreations({ view: "summary" });

        if (!active) return;
        setCreations(Array.isArray(ownedCreations) ? ownedCreations : []);
      } catch (error) {
        if (!active) return;

        setCreations([]);
        setCountLoadError(
          error?.message || "Your creation progress could not be loaded."
        );
      } finally {
        if (active) {
          setIsLoadingCounts(false);
        }
      }
    }

    loadOwnedCreationCounts();

    return () => {
      active = false;
    };
  }, []);

  const creationTypeCounts = useMemo(
    () => buildCreationTypeCounts(creations),
    [creations]
  );

  const creationAssetsWithLore = useMemo(() => {
    const existingAssets = Array.isArray(creationAssets) ? creationAssets : [];

    return existingAssets.some((asset) => asset?.title === LORE_CREATION_ASSET.title)
      ? existingAssets
      : [...existingAssets, LORE_CREATION_ASSET];
  }, []);

  const guidedChapters = useMemo(
    () => buildGuidedChapterStates(creationTypeCounts),
    [creationTypeCounts]
  );

  const guidedProgress = useMemo(
    () => getGuidedProgress(guidedChapters),
    [guidedChapters]
  );

  const recommendedGuidedStep = useMemo(
    () => getRecommendedGuidedStep(guidedChapters),
    [guidedChapters]
  );

  const quickStartAssets = useMemo(
    () => getAssetsByTitle(creationAssetsWithLore, QUICK_START_ASSET_TITLES),
    [creationAssetsWithLore]
  );

  const fullStudioSections = useMemo(
    () =>
      buildFullStudioSections({
        creationAssets: creationAssetsWithLore,
        registryTypes,
      }),
    [creationAssetsWithLore]
  );

  const guidedAssets = useMemo(
    () => [...creationAssetsWithLore, ...registryTypes],
    [creationAssetsWithLore]
  );

  function setMode(nextMode) {
    const normalizedMode = normalizeCreationStudioMode(nextMode);

    setModeState(normalizedMode);

    try {
      window.localStorage.setItem(
        CREATION_STUDIO_MODE_STORAGE_KEY,
        normalizedMode
      );
    } catch {
      // Mode persistence is a convenience; the active view still changes.
    }
  }

  return {
    mode,
    setMode,
    quickStartAssets,
    guidedChapters,
    guidedProgress,
    recommendedGuidedStep,
    guidedAssets,
    fullStudioSections,
    creationTypeCounts,
    isLoadingCounts,
    countLoadError,
  };
}
