"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  fetchOwnedCreation,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";
import { buildOwnedTimelineProjection } from "@/lib/shared/timelines/timelineOwnerProjection";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeEntry(entry, index) {
  const availability = normalizeString(entry?.availability).toUpperCase() || "AVAILABLE";
  const era = normalizeString(entry?.era);
  const displayDate = normalizeString(entry?.displayDate || entry?.display_date);

  return {
    id: normalizeString(entry?.loreCreationId) || `timeline-entry-${index + 1}`,
    loreCreationId: normalizeString(entry?.loreCreationId),
    title: normalizeString(entry?.title) || "Untitled Lore",
    description: normalizeString(entry?.description),
    subtitle: normalizeString(entry?.subtitle),
    era,
    displayDate,
    chronologyLabel: displayDate || era || "Undated / unplaced",
    timelineOrder: normalizeOptionalNumber(entry?.timelineOrder),
    orderOverride: normalizeOptionalNumber(entry?.orderOverride),
    effectiveOrder: normalizeOptionalNumber(entry?.effectiveOrder),
    availability,
    status: normalizeString(entry?.status).toUpperCase(),
    visibility: normalizeString(entry?.visibility).toUpperCase(),
    isUnavailable: availability !== "AVAILABLE",
    isUnplaced: normalizeOptionalNumber(entry?.effectiveOrder) === null,
  };
}

export function groupTimelineReaderEntries(entries = [], groupByEra = true) {
  const normalized = Array.isArray(entries) ? entries : [];
  if (!normalized.length) return [];

  if (!groupByEra) {
    return [{ id: "chronology", label: "Chronology", entries: normalized }];
  }

  const groups = [];
  let active = null;

  normalized.forEach((entry, index) => {
    const label = entry.isUnplaced
      ? "Undated / unplaced"
      : normalizeString(entry.era) || "Unclassified era";

    if (!active || active.label !== label) {
      active = {
        id: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "era"}-${index}`,
        label,
        entries: [],
      };
      groups.push(active);
    }

    active.entries.push(entry);
  });

  return groups;
}

export function useTimelineReaderViewModel({
  timelineId,
  initialCreation = null,
} = {}) {
  const router = useRouter();
  const [projection, setProjection] = useState(null);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [loadMessage, setLoadMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadStatus("loading");
      setLoadMessage("");

      try {
        const [ownedLore, timelineCreation] = await Promise.all([
          fetchOwnedCreations(
            { type: "LORE" },
            "Lore Assets could not be loaded for this Timeline."
          ),
          initialCreation
            ? Promise.resolve(initialCreation)
            : fetchOwnedCreation(timelineId, "Timeline could not be loaded."),
        ]);
        if (cancelled) return;

        const result = buildOwnedTimelineProjection({
          timelineCreation,
          ownedLore,
        });
        if (!result?.timeline?.id) throw new Error("Timeline could not be loaded.");

        setProjection(result);
        setLoadStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setProjection(null);
        setLoadStatus("error");
        setLoadMessage(error?.message || "Timeline could not be loaded.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [initialCreation, timelineId]);

  const timeline = projection?.timeline || {};
  const entries = useMemo(
    () =>
      (Array.isArray(projection?.entries) ? projection.entries : []).map(
        normalizeEntry
      ),
    [projection?.entries]
  );
  const navigableEntries = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        href:
          !entry.isUnavailable && entry.loreCreationId
            ? `/studio/v2/lore/timelines/${encodeURIComponent(
                timelineId
              )}/lore/${encodeURIComponent(entry.loreCreationId)}`
            : "",
      })),
    [entries, timelineId]
  );
  const groups = useMemo(
    () =>
      groupTimelineReaderEntries(
        navigableEntries,
        timeline.groupByEra !== false
      ),
    [navigableEntries, timeline.groupByEra]
  );

  return {
    timelineId,
    loadStatus,
    loadMessage,
    title: normalizeString(timeline.title) || "Untitled Timeline",
    description: normalizeString(timeline.description),
    publicEnabled: timeline.publicEnabled === true,
    sortDirection: timeline.sortDirection === "DESC" ? "DESC" : "ASC",
    groupByEra: timeline.groupByEra !== false,
    visibility: normalizeString(timeline.visibility).toUpperCase(),
    status: normalizeString(timeline.status).toUpperCase(),
    entryCount: entries.length,
    groups,
    showEditAction: true,
    onBack: () => router.push("/studio/v2/lore"),
    onEdit: () =>
      router.push(
        `/studio/v2/editor/${encodeURIComponent(timelineId)}?origin=timeline`
      ),
  };
}
