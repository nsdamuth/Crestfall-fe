"use client";

import { useEffect, useState } from "react";
import { fetchMutualPlayers } from "@/lib/client/studio/room-templates/roomTemplateClient";

export function useMutualPlayers() {
  const [mutualPlayers, setMutualPlayers] = useState([]);
  const [mutualLoadError, setMutualLoadError] = useState("");
  const [mutualStatus, setMutualStatus] = useState("idle");

  useEffect(() => {
    let cancelled = false;

    async function loadMutualPlayers() {
      setMutualStatus("loading");
      setMutualLoadError("");

      try {
        const players = await fetchMutualPlayers();

        if (!cancelled) {
          setMutualPlayers(players);
          setMutualStatus("loaded");
        }
      } catch (error) {
        if (!cancelled) {
          setMutualPlayers([]);
          setMutualStatus("error");
          setMutualLoadError(
            error.message || "Mutual followers could not be loaded."
          );
        }
      }
    }

    loadMutualPlayers();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    mutualPlayers,
    mutualLoadError,
    mutualStatus,
  };
}