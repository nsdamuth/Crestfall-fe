"use client";

import { useEffect, useState } from "react";

import { fetchStudioAccountMetrics } from "@/lib/client/studio/profile/studioAccountClient";

const FALLBACK_METRICS = {
  characters: 0,
  canon: 0,
  messages: 0,
  interactions: 0,
  likes: 0,
  images: 0,
};

function toDisplayNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat().format(number);
}

function buildMetricItems(metrics) {
  const interactions = metrics?.interactions ?? metrics?.messages ?? 0;

  return [
    { id: "characters", value: toDisplayNumber(metrics?.characters), label: "Characters" },
    { id: "canon", value: toDisplayNumber(metrics?.canon), label: "Canon" },
    { id: "interactions", value: toDisplayNumber(interactions), label: "Interactions" },
    { id: "likes", value: toDisplayNumber(metrics?.likes), label: "Likes" },
    { id: "images", value: toDisplayNumber(metrics?.images), label: "Images" },
  ];
}

export function useStudioAccountMetricsViewModel({
  className = "grid grid-cols-2 gap-3 text-center",
} = {}) {
  const [metrics, setMetrics] = useState(FALLBACK_METRICS);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMetrics() {
      setErrorMessage("");

      try {
        const nextMetrics = await fetchStudioAccountMetrics();

        if (cancelled) return;

        setMetrics({
          ...FALLBACK_METRICS,
          ...nextMetrics,
        });
      } catch (error) {
        if (cancelled) return;

        setMetrics(FALLBACK_METRICS);
        setErrorMessage(
          error?.message || "Account metrics could not be loaded."
        );
      }
    }

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    className,
    errorMessage,
    metricItems: buildMetricItems(metrics),
  };
}
