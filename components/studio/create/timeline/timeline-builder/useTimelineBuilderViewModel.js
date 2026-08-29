"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import {
  createTimelineDraft,
  fetchOwnedTimelineProjection,
  updateTimelineDraft,
} from "@/lib/client/studio/timelines/timelineClient";
import {
  TIMELINE_CREATION_TYPE,
  normalizeOptionalTimelineNumber,
  normalizeTimelineDefinition,
  sortTimelineEntries,
} from "@/lib/shared/timelines/timelineContract";
import {
  TIMELINE_DRAFT_VISIBILITY_OPTIONS,
  TIMELINE_SORT_OPTIONS,
} from "./TimelineBuilder.contract";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getLoreDocument(creation) {
  const data = normalizeObject(creation?.data);
  return normalizeObject(data.lore_document || data.loreDocument);
}

function getChronologyFromLore(creation) {
  const document = getLoreDocument(creation);
  return {
    subtitle: normalizeString(document.subtitle),
    era: normalizeString(document.era),
    displayDate: normalizeString(document.displayDate || document.display_date),
    timelineOrder: normalizeOptionalTimelineNumber(
      document.timelineOrder ?? document.timeline_order
    ),
  };
}

function projectOwnedLoreForTimeline(creation) {
  if (!creation?.id || normalizeString(creation.type).toUpperCase() !== "LORE") {
    return null;
  }

  return {
    loreCreationId: String(creation.id),
    id: String(creation.id),
    type: "LORE",
    title: normalizeString(creation.title) || "Untitled Lore",
    description: normalizeString(creation.description),
    visibility: normalizeString(creation.visibility).toUpperCase(),
    status: normalizeString(creation.status).toUpperCase(),
    imageSrc:
      creation.imageUrl ||
      creation.imageSrc ||
      creation.featuredMedia?.[0]?.imageUrl ||
      creation.featuredMedia?.[0]?.url ||
      null,
    ...getChronologyFromLore(creation),
  };
}

function projectTimelineEntryLore(entry) {
  return {
    loreCreationId: normalizeString(entry?.loreCreationId),
    id: normalizeString(entry?.loreCreationId),
    type: "LORE",
    title: normalizeString(entry?.title) || "Unavailable Lore",
    description: normalizeString(entry?.description),
    subtitle: normalizeString(entry?.subtitle),
    era: normalizeString(entry?.era),
    displayDate: normalizeString(entry?.displayDate),
    timelineOrder: normalizeOptionalTimelineNumber(entry?.timelineOrder),
    visibility: normalizeString(entry?.visibility).toUpperCase(),
    status: normalizeString(entry?.status).toUpperCase(),
    availability: normalizeString(entry?.availability).toUpperCase() || "AVAILABLE",
    imageSrc: entry?.imageSrc || null,
  };
}

function createInitialDraft() {
  return {
    title: "",
    description: "",
    visibility: "PRIVATE",
    publicEnabled: false,
    sortDirection: "ASC",
    groupByEra: true,
    entries: [],
  };
}

function extractCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
}

export function useTimelineBuilderViewModel({ timelineId = null } = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(createInitialDraft);
  const [ownedLore, setOwnedLore] = useState([]);
  const [loadStatus, setLoadStatus] = useState(timelineId ? "loading" : "ready");
  const [loadMessage, setLoadMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadStatus("loading");
      setLoadMessage("");

      try {
        const [loreRows, timelineProjection] = await Promise.all([
          fetchOwnedCreations(
            { type: "LORE" },
            "Lore Assets could not be loaded for this Timeline."
          ),
          timelineId ? fetchOwnedTimelineProjection(timelineId) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const projectedLore = (Array.isArray(loreRows) ? loreRows : [])
          .map(projectOwnedLoreForTimeline)
          .filter(Boolean);
        setOwnedLore(projectedLore);

        if (timelineId) {
          const timeline = normalizeObject(timelineProjection?.timeline);
          const entries = Array.isArray(timelineProjection?.entries)
            ? timelineProjection.entries
            : [];

          if (!timeline.id) {
            throw new Error("Timeline could not be loaded.");
          }

          setDraft({
            title: normalizeString(timeline.title),
            description: normalizeString(timeline.description),
            visibility:
              normalizeString(timeline.visibility).toUpperCase() === "UNLISTED"
                ? "UNLISTED"
                : "PRIVATE",
            publicEnabled: timeline.publicEnabled === true,
            sortDirection: timeline.sortDirection === "DESC" ? "DESC" : "ASC",
            groupByEra: timeline.groupByEra !== false,
            entries: entries.map((entry) => ({
              loreCreationId: normalizeString(entry?.loreCreationId),
              orderOverride: normalizeOptionalTimelineNumber(entry?.orderOverride),
              lore: projectTimelineEntryLore(entry),
            })),
          });
        }

        setLoadStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setLoadStatus("error");
        setLoadMessage(error?.message || "Timeline could not be loaded.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [timelineId]);

  const loreById = useMemo(() => {
    const map = new Map();
    for (const lore of ownedLore) map.set(lore.loreCreationId, lore);
    for (const entry of draft.entries) {
      if (entry?.lore?.loreCreationId && !map.has(entry.lore.loreCreationId)) {
        map.set(entry.lore.loreCreationId, entry.lore);
      }
    }
    return map;
  }, [ownedLore, draft.entries]);

  const normalizedEntries = useMemo(
    () =>
      draft.entries.map((entry) => ({
        loreCreationId: normalizeString(entry.loreCreationId),
        orderOverride: normalizeOptionalTimelineNumber(entry.orderOverride),
      })),
    [draft.entries]
  );

  const sortedEntryRefs = useMemo(
    () =>
      sortTimelineEntries({
        entries: normalizedEntries,
        loreById,
        direction: draft.sortDirection,
      }),
    [normalizedEntries, loreById, draft.sortDirection]
  );

  const sortedEntries = useMemo(
    () =>
      sortedEntryRefs.map((entry, index) => {
        const lore = loreById.get(entry.loreCreationId) || {
          loreCreationId: entry.loreCreationId,
          title: "Unavailable Lore",
          era: "",
          displayDate: "",
          timelineOrder: null,
          availability: "MISSING",
        };
        const effectiveOrder =
          normalizeOptionalTimelineNumber(entry.orderOverride) ??
          normalizeOptionalTimelineNumber(lore.timelineOrder);

        return {
          id: entry.loreCreationId,
          index: index + 1,
          title: lore.title || "Untitled Lore",
          description: lore.description || "",
          era: lore.era || "",
          displayDate: lore.displayDate || "",
          timelineOrder: normalizeOptionalTimelineNumber(lore.timelineOrder),
          orderOverride: normalizeOptionalTimelineNumber(entry.orderOverride),
          effectiveOrder,
          availability: lore.availability || "AVAILABLE",
          status: lore.status || "",
          visibility: lore.visibility || "",
          isUnplaced: effectiveOrder === null,
        };
      }),
    [sortedEntryRefs, loreById]
  );

  const attachedIds = useMemo(
    () => new Set(draft.entries.map((entry) => normalizeString(entry.loreCreationId))),
    [draft.entries]
  );

  const pickerCreations = useMemo(
    () =>
      ownedLore
        .filter((lore) => !attachedIds.has(lore.loreCreationId))
        .map((lore, index) => ({
          ...lore,
          id: lore.loreCreationId,
          title: lore.title,
          bucket: "more",
          recency: Math.max(0, ownedLore.length - index),
          isCanon: lore.status === "APPROVED" && lore.visibility === "PUBLIC",
        })),
    [ownedLore, attachedIds]
  );

  function updateField(field, value) {
    if (
      ![
        "title",
        "description",
        "visibility",
        "publicEnabled",
        "sortDirection",
        "groupByEra",
      ].includes(field)
    ) {
      return;
    }

    setDraft((current) => ({ ...current, [field]: value }));
    setSaveMessage("");
  }

  function addLore(creation) {
    const loreCreationId = normalizeString(creation?.id || creation?.loreCreationId);
    if (!loreCreationId || attachedIds.has(loreCreationId)) return;

    const lore =
      ownedLore.find((entry) => entry.loreCreationId === loreCreationId) ||
      projectOwnedLoreForTimeline(creation);
    if (!lore) return;

    setDraft((current) => ({
      ...current,
      entries: [
        ...current.entries,
        { loreCreationId, orderOverride: null, lore },
      ],
    }));
    setSaveMessage("");
  }

  function removeLore(loreCreationId) {
    setDraft((current) => ({
      ...current,
      entries: current.entries.filter(
        (entry) => entry.loreCreationId !== loreCreationId
      ),
    }));
    setSaveMessage("");
  }

  function updateOrderOverride(loreCreationId, rawValue) {
    setDraft((current) => ({
      ...current,
      entries: current.entries.map((entry) =>
        entry.loreCreationId === loreCreationId
          ? {
              ...entry,
              orderOverride:
                rawValue === "" ? null : normalizeOptionalTimelineNumber(rawValue),
            }
          : entry
      ),
    }));
    setSaveMessage("");
  }

  const saveDisabled =
    loadStatus !== "ready" ||
    saveStatus === "saving" ||
    !normalizeString(draft.title);

  async function save() {
    if (saveDisabled) return;

    setSaveStatus("saving");
    setSaveMessage("");

    const timeline = normalizeTimelineDefinition({
      publicEnabled: draft.publicEnabled,
      sortDirection: draft.sortDirection,
      groupByEra: draft.groupByEra,
      entries: normalizedEntries,
    });

    const creationPayload = {
      type: TIMELINE_CREATION_TYPE,
      title: normalizeString(draft.title),
      description:
        normalizeString(draft.description) || "A curated Crestfall Lore Timeline.",
      visibility: draft.visibility === "UNLISTED" ? "UNLISTED" : "PRIVATE",
      content_rating: "SFW",
      data: {
        builder: "TIMELINE_BUILDER",
        builder_version: "1.0",
        timeline,
      },
    };

    try {
      const payload = timelineId
        ? await updateTimelineDraft(timelineId, creationPayload)
        : await createTimelineDraft(creationPayload);
      const creation = extractCreation(payload);

      if (!timelineId && !creation?.id) {
        throw new Error("Timeline was saved, but no creation ID was returned.");
      }

      setSaveStatus("saved");
      setSaveMessage(timelineId ? "Timeline saved." : "Timeline created.");

      if (!timelineId && creation?.id) {
        router.replace(`/studio/create/timeline/${encodeURIComponent(creation.id)}`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Timeline could not be saved.");
    }
  }

  return {
    timelineId,
    isEditing: Boolean(timelineId),
    loadStatus,
    loadMessage,
    title: draft.title,
    description: draft.description,
    visibility: draft.visibility,
    visibilityOptions: TIMELINE_DRAFT_VISIBILITY_OPTIONS,
    publicEnabled: draft.publicEnabled,
    sortDirection: draft.sortDirection,
    sortOptions: TIMELINE_SORT_OPTIONS,
    groupByEra: draft.groupByEra,
    entries: sortedEntries,
    entryCount: draft.entries.length,
    unplacedCount: sortedEntries.filter((entry) => entry.isUnplaced).length,
    pickerOpen,
    pickerCreations,
    saveDisabled,
    saveStatus,
    saveMessage,
    onUpdateField: updateField,
    onOpenLorePicker: () => setPickerOpen(true),
    onCloseLorePicker: () => setPickerOpen(false),
    onAddLore: addLore,
    onRemoveLore: removeLore,
    onUpdateOrderOverride: updateOrderOverride,
    onSave: save,
    onWriteLore: () => router.push("/studio/create/lore"),
    onBackToLore: () => router.push("/studio/v2/lore"),
  };
}
