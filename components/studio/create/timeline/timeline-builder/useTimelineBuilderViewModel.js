"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  fetchOwnedCreation,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";
import {
  createTimelineDraft,
  updateTimelineDraft,
} from "@/lib/client/studio/timelines/timelineClient";
import {
  TIMELINE_CREATION_TYPE,
  normalizeOptionalTimelineNumber,
  normalizeTimelineDefinition,
  sortTimelineEntries,
} from "@/lib/shared/timelines/timelineContract";
import {
  buildOwnedTimelineProjection,
  projectOwnedLoreForTimeline,
} from "@/lib/shared/timelines/timelineOwnerProjection";
import {
  TIMELINE_DRAFT_VISIBILITY_OPTIONS,
  TIMELINE_GROUPING_OPTIONS,
  TIMELINE_SORT_OPTIONS,
} from "./TimelineBuilder.contract";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
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
    groupingMode: "ERA",
    chapters: [],
    entries: [],
  };
}

function extractCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
}

export function useTimelineBuilderViewModel({
  timelineId = null,
  initialCreation = null,
  backHref = "/studio/v2/lore",
} = {}) {
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
        const [loreRows, timelineCreation] = await Promise.all([
          fetchOwnedCreations(
            { type: "LORE" },
            "Lore Assets could not be loaded for this Timeline."
          ),
          timelineId
            ? initialCreation
              ? Promise.resolve(initialCreation)
              : fetchOwnedCreation(
                  timelineId,
                  "Timeline could not be loaded."
                )
            : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const projectedLore = (Array.isArray(loreRows) ? loreRows : [])
          .map(projectOwnedLoreForTimeline)
          .filter(Boolean);
        setOwnedLore(projectedLore);

        if (timelineId) {
          const timelineProjection = buildOwnedTimelineProjection({
            timelineCreation,
            ownedLore: loreRows,
          });
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
            groupingMode: ["CHAPTERS", "ERA", "NONE"].includes(
              normalizeString(timeline.groupingMode).toUpperCase()
            )
              ? normalizeString(timeline.groupingMode).toUpperCase()
              : timeline.groupByEra === false
                ? "NONE"
                : "ERA",
            chapters: Array.isArray(timeline.chapters)
              ? timeline.chapters.map((chapter, index) => ({
                  id: normalizeString(chapter?.id),
                  title: normalizeString(chapter?.title) || `Chapter ${index + 1}`,
                  order:
                    normalizeOptionalTimelineNumber(chapter?.order) ?? index + 1,
                }))
              : [],
            entries: entries.map((entry) => ({
              loreCreationId: normalizeString(entry?.loreCreationId),
              orderOverride: normalizeOptionalTimelineNumber(entry?.orderOverride),
              chapterId: normalizeString(entry?.chapterId),
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
  }, [initialCreation, timelineId]);

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
        chapterId: normalizeString(entry.chapterId),
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
          chapterId: normalizeString(entry.chapterId),
          chapterLabel:
            draft.chapters.find((chapter) => chapter.id === normalizeString(entry.chapterId))
              ?.title || "",
          effectiveOrder,
          availability: lore.availability || "AVAILABLE",
          status: lore.status || "",
          visibility: lore.visibility || "",
          isUnplaced: effectiveOrder === null,
        };
      }),
    [sortedEntryRefs, loreById, draft.chapters]
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
        "groupingMode",
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
        { loreCreationId, orderOverride: null, chapterId: "", lore },
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

  function createChapter() {
    const chapterId = `chapter-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    setDraft((current) => ({
      ...current,
      groupingMode: "CHAPTERS",
      chapters: [
        ...current.chapters,
        {
          id: chapterId,
          title: `Chapter ${current.chapters.length + 1}`,
          order: (current.chapters.length + 1) * 100,
        },
      ],
    }));
    setSaveMessage("");
  }

  function updateChapter(chapterId, field, rawValue) {
    if (!["title", "order"].includes(field)) return;
    setDraft((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              [field]:
                field === "order"
                  ? normalizeOptionalTimelineNumber(rawValue) ?? chapter.order
                  : rawValue,
            }
          : chapter
      ),
    }));
    setSaveMessage("");
  }

  function removeChapter(chapterId) {
    setDraft((current) => ({
      ...current,
      chapters: current.chapters.filter((chapter) => chapter.id !== chapterId),
      entries: current.entries.map((entry) =>
        entry.chapterId === chapterId ? { ...entry, chapterId: "" } : entry
      ),
    }));
    setSaveMessage("");
  }

  function updateEntryChapter(loreCreationId, chapterId) {
    const normalizedChapterId = normalizeString(chapterId);
    setDraft((current) => ({
      ...current,
      entries: current.entries.map((entry) =>
        entry.loreCreationId === loreCreationId
          ? {
              ...entry,
              chapterId: current.chapters.some(
                (chapter) => chapter.id === normalizedChapterId
              )
                ? normalizedChapterId
                : "",
            }
          : entry
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

  const chapterDefinitionInvalid =
    new Set(draft.chapters.map((chapter) => chapter.id)).size !== draft.chapters.length ||
    draft.chapters.some(
      (chapter) =>
        !normalizeString(chapter.id) ||
        !normalizeString(chapter.title) ||
        !Number.isFinite(Number(chapter.order))
    );

  const saveDisabled =
    loadStatus !== "ready" ||
    saveStatus === "saving" ||
    !normalizeString(draft.title) ||
    chapterDefinitionInvalid;

  async function save() {
    if (saveDisabled) return;

    setSaveStatus("saving");
    setSaveMessage("");

    const timeline = normalizeTimelineDefinition({
      publicEnabled: draft.publicEnabled,
      sortDirection: draft.sortDirection,
      groupingMode: draft.groupingMode,
      chapters: draft.chapters,
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
        builder_version: "2.0",
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
        router.replace(
          `/studio/v2/lore/timelines/${encodeURIComponent(creation.id)}`
        );
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
    groupingMode: draft.groupingMode,
    groupingOptions: TIMELINE_GROUPING_OPTIONS,
    chapters: [...draft.chapters].sort((a, b) => a.order - b.order),
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
    onUpdateEntryChapter: updateEntryChapter,
    onAddChapter: createChapter,
    onUpdateChapter: updateChapter,
    onRemoveChapter: removeChapter,
    onSave: save,
    onBackToLore: () => router.push(backHref || "/studio/v2/lore"),
  };
}
