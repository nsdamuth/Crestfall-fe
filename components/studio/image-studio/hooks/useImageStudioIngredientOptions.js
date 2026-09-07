"use client";

import { useEffect, useMemo, useState } from "react";
import { ingredientSlots } from "@/components/studio/image-studio/imageStudioData";
import { fetchImageStudioIngredientCreations } from "@/lib/client/studio/image-studio/imageStudioClient";
import {
  getImageStudioAllowedTypes,
  getImageStudioOptionsForSlot,
} from "@/components/studio/image-studio/imageStudioUtils";

export function useImageStudioIngredientOptions({ sourceMode = "MINE" } = {}) {
  const [creations, setCreations] = useState([]);
  const [ingredientLoadError, setIngredientLoadError] = useState("");
  const [ingredientLoadStatus, setIngredientLoadStatus] = useState("idle");

  const allowedTypes = useMemo(
    () => getImageStudioAllowedTypes(ingredientSlots),
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function loadIngredientCreations() {
      setIngredientLoadStatus("loading");
      setIngredientLoadError("");
      setCreations([]);

      try {
        const nextCreations =
          await fetchImageStudioIngredientCreations(allowedTypes, {
            sourceMode,
          });

        if (!cancelled) {
          setCreations(nextCreations);
          setIngredientLoadStatus("loaded");
        }
      } catch (error) {
        if (!cancelled) {
          setCreations([]);
          setIngredientLoadStatus("error");
          setIngredientLoadError(
            error.message || "Image Studio assets could not be loaded."
          );
        }
      }
    }

    loadIngredientCreations();

    return () => {
      cancelled = true;
    };
  }, [allowedTypes, sourceMode]);

  const ingredientOptionsBySlot = useMemo(() => {
    return Object.fromEntries(
      ingredientSlots.map((slot) => [
        slot.id,
        getImageStudioOptionsForSlot(creations, slot, { sourceMode }),
      ])
    );
  }, [creations, sourceMode]);

  return {
    ingredientOptionsBySlot,
    ingredientLoadError,
    ingredientLoadStatus,
  };
}