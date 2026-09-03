"use client";

// Binding Shell. Production picker surfaces load the authenticated owner's
// live creation summaries and adapt them into the portable picker ViewModel.
// Fixture data remains isolated to preview/diagnostic modules.
import { useEffect, useState } from "react";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";

import CreationPickerView from "./creation-picker/CreationPicker.view";
import { resolveCreationBucket } from "./creation-picker/creationPickerBuckets";
import { useCreationPickerViewModel } from "./creation-picker/useCreationPickerViewModel";

function normalizePickerCreation(creation, index = 0) {
  const updatedAt = creation?.updatedAt || creation?.updated_at || null;
  const createdAt = creation?.createdAt || creation?.created_at || null;
  const parsedRecency = Date.parse(updatedAt || createdAt || "");
  const canonStatus = String(
    creation?.canonStatus || creation?.canon_status || "NONE"
  ).toUpperCase();

  return {
    id: String(creation?.id || "").trim(),
    type: String(creation?.type || "").trim().toUpperCase(),
    bucket: resolveCreationBucket(creation?.type),
    title: String(creation?.title || "Untitled Creation"),
    visibility: String(creation?.visibility || "PRIVATE").toUpperCase(),
    isCanon: ["CANON", "OFFICIAL"].includes(canonStatus),
    imageSrc:
      creation?.imageUrl ||
      creation?.image_url ||
      creation?.featuredMedia?.[0]?.thumbnailUrl ||
      creation?.featuredMedia?.[0]?.imageUrl ||
      creation?.featured_media?.[0]?.thumbnailUrl ||
      creation?.featured_media?.[0]?.imageUrl ||
      null,
    recency: Number.isFinite(parsedRecency) ? parsedRecency : -index,
  };
}

export default function CreationPicker({
  title = "Choose a creation",
  onSelect = null,
  onClose = null,
  onCreateNew = null,
}) {
  const [creations, setCreations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOwnedCreations() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const results = await fetchOwnedCreations({ view: "summary" });
        if (!active) return;

        setCreations(
          (Array.isArray(results) ? results : [])
            .map(normalizePickerCreation)
            .filter((creation) => creation.id)
        );
      } catch (error) {
        if (!active) return;
        setCreations([]);
        setErrorMessage(
          error?.message || "Your creations could not be loaded."
        );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadOwnedCreations();

    return () => {
      active = false;
    };
  }, []);

  const viewProps = useCreationPickerViewModel({
    creations,
    title,
    errorMessage,
    onSelect,
    onClose,
    onCreateNew,
  });

  return <CreationPickerView {...viewProps} isLoading={isLoading} />;
}
