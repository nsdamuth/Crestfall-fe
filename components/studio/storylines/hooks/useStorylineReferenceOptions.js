"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchStorylineReferences } from "@/lib/client/studio/storylines/storylineClient";

function toOption(creation) {
  const type = String(creation?.type || "").trim().toUpperCase();

  if (!creation?.id || !["ROOM_TEMPLATE", "SCENARIO"].includes(type)) {
    return null;
  }

  return {
    id: creation.id,
    type,
    title: creation.title || "Untitled",
    subtitle: creation.description || creation.data?.public_description || "",
    contentRating:
      creation.contentRating || creation.content_rating || "SFW",
    imageUrl:
      creation.imageUrl || creation.image_url || creation.thumbnailUrl || null,
  };
}

export function useStorylineReferenceOptions() {
  const [stories, setStories] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadStatus("loading");
      setLoadError("");

      try {
        const result = await fetchStorylineReferences();

        if (cancelled) return;

        setStories((result.stories || []).map(toOption).filter(Boolean));
        setScenarios((result.scenarios || []).map(toOption).filter(Boolean));
        setLoadStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setLoadStatus("error");
        setLoadError(
          error.message || "Story and Scenario references could not be loaded."
        );
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const allOptions = useMemo(
    () => [...stories, ...scenarios],
    [stories, scenarios]
  );

  return {
    stories,
    scenarios,
    allOptions,
    loadStatus,
    loadError,
  };
}
