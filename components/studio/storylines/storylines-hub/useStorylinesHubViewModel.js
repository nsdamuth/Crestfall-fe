"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchOwnedStorylines } from "@/lib/client/studio/storylines/storylineClient";

const DEFAULT_ERROR_MESSAGE = "Storylines could not be loaded.";

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function getStorylineNodes(storyline = {}) {
  const data = storyline?.data && typeof storyline.data === "object"
    ? storyline.data
    : {};

  if (Array.isArray(data.nodes)) return data.nodes;
  if (Array.isArray(data.ordered_nodes)) return data.ordered_nodes;

  return [];
}

function getStorylineId(storyline = {}, index = 0) {
  return normalizeText(storyline?.id, `storyline-${index}`);
}

export function normalizeStorylineCard(storyline = {}, index = 0) {
  const id = getStorylineId(storyline, index);
  const nodeCount = getStorylineNodes(storyline).length;

  return {
    id,
    href: `/studio/my-creations/${id}/edit`,
    eyebrow: "Storyline",
    title: normalizeText(storyline?.title, "Untitled Storyline"),
    description: normalizeText(
      storyline?.description,
      "No description provided."
    ),
    nodeCount,
    nodeCountLabel: `${nodeCount} node${nodeCount === 1 ? "" : "s"}`,
  };
}

export function getStorylinesHubViewProps({
  storylines = [],
  status = "loading",
  error = "",
} = {}) {
  const safeStorylines = Array.isArray(storylines) ? storylines : [];
  const cards = safeStorylines.map(normalizeStorylineCard);
  const normalizedStatus = normalizeText(status, "loading").toLowerCase();
  const errorMessage = normalizeText(error);

  return {
    heading: "Your Storylines",
    description:
      "Link Stories and Scenarios in order, then define whether the next node starts immediately or waits in open-world play for a trigger.",
    createHref: "/studio/create/storyline",
    createLabel: "Create Storyline",
    loadingMessage: "Loading Storylines...",
    emptyTitle: "No Storylines Yet",
    emptyMessage:
      "Create the continuity path that connects your existing Stories and Scenarios while preserving the same chat between them.",
    cards,
    showLoading: normalizedStatus === "loading",
    showEmpty: normalizedStatus === "loaded" && cards.length === 0,
    errorMessage,
  };
}

export function useStorylinesHubViewModel({
  loadStorylines = fetchOwnedStorylines,
} = {}) {
  const [storylines, setStorylines] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const items = await loadStorylines();

        if (cancelled) return;

        setStorylines(Array.isArray(items) ? items : []);
        setStatus("loaded");
      } catch (loadError) {
        if (cancelled) return;

        setStorylines([]);
        setError(loadError?.message || DEFAULT_ERROR_MESSAGE);
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [loadStorylines]);

  return useMemo(
    () => getStorylinesHubViewProps({ storylines, status, error }),
    [storylines, status, error]
  );
}
