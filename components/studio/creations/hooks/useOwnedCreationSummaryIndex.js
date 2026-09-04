"use client";

import { useEffect, useState } from "react";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import { indexCreationSummaries } from "@/lib/shared/creations/creationReferenceHydration";

let inFlightSummaryRequest = null;

export function loadOwnedCreationSummariesShared() {
  if (!inFlightSummaryRequest) {
    inFlightSummaryRequest = fetchOwnedCreations(
      { view: "summary" },
      "Creation reference names could not be loaded."
    ).finally(() => {
      inFlightSummaryRequest = null;
    });
  }

  return inFlightSummaryRequest;
}

export function useOwnedCreationSummaryIndex({ enabled = true } = {}) {
  const [summariesById, setSummariesById] = useState(() => new Map());
  const [status, setStatus] = useState(enabled ? "loading" : "idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setSummariesById(new Map());
      setStatus("idle");
      setErrorMessage("");
      return () => {
        cancelled = true;
      };
    }

    setStatus("loading");
    setErrorMessage("");

    loadOwnedCreationSummariesShared()
      .then((creations) => {
        if (cancelled) return;
        setSummariesById(indexCreationSummaries(creations));
        setStatus("loaded");
      })
      .catch((error) => {
        if (cancelled) return;
        setSummariesById(new Map());
        setStatus("error");
        setErrorMessage(
          error?.message || "Creation reference names could not be loaded."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return {
    summariesById,
    status,
    errorMessage,
  };
}
