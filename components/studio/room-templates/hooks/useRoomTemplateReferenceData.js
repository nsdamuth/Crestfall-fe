"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchRoomTemplateCreationReferences } from "@/lib/client/studio/room-templates/roomTemplateClient";
import {
  filterReferenceOptions,
  toRoomReferenceOption,
} from "@/components/studio/room-templates/roomTemplateUtils";

export function useRoomTemplateReferenceData() {
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [referenceLoadError, setReferenceLoadError] = useState("");
  const [referenceStatus, setReferenceStatus] = useState("idle");

  useEffect(() => {
    let cancelled = false;

    async function loadReferenceOptions() {
      setReferenceStatus("loading");
      setReferenceLoadError("");

      try {
        const creations = await fetchRoomTemplateCreationReferences();

        if (!cancelled) {
          setReferenceOptions(
            creations
              .map(toRoomReferenceOption)
              .filter(Boolean)
              .filter((item) => item.type !== "PLAYER_CHARACTER")
          );
          setReferenceStatus("loaded");
        }
      } catch (error) {
        if (!cancelled) {
          setReferenceOptions([]);
          setReferenceStatus("error");
          setReferenceLoadError(
            error.message || "Room template references could not be loaded."
          );
        }
      }
    }

    loadReferenceOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const characterOptions = useMemo(
    () => filterReferenceOptions(referenceOptions, ["CHARACTER"]),
    [referenceOptions]
  );

  const scenarioOptions = useMemo(
    () => filterReferenceOptions(referenceOptions, ["SCENARIO"]),
    [referenceOptions]
  );

  const narratorOptions = useMemo(
    () => filterReferenceOptions(referenceOptions, ["NARRATOR"]),
    [referenceOptions]
  );

  const locationOptions = useMemo(
    () => filterReferenceOptions(referenceOptions, ["LOCATION"]),
    [referenceOptions]
  );

  return {
    referenceOptions,
    referenceLoadError,
    referenceStatus,
    characterOptions,
    scenarioOptions,
    narratorOptions,
    locationOptions,
  };
}