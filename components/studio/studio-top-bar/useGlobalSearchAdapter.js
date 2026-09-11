"use client";

// The one top bar adapter for the global search (FE/GLOBAL-SEARCH
// session 1, 10 Sep 2026). Data approach RULED at the plan gate
// (option 1): fetch once on first open, filter in the browser. No
// search route exists in the Chassis (docs/handoffs/GLOBAL-SEARCH-
// BACKEND.md), so this hook reads the list routes that exist, the
// same ones the Vault, Stories, Community, Creators, Lore, and Images
// pages already load and filter client-side, normalizes every item to
// the KitGlobalSearch item shape, and hands the two source groups to
// the Kit. It holds the lists for the session and refreshes on the
// next open after five minutes. Every destination below is a route in
// the app router; nothing is guessed.
import { useCallback, useRef, useState } from "react";

import { normalizeGlobalSearchText } from "@/components/kit/global-search/kitGlobalSearchQuery";
import {
  fetchCommunityCreations,
  fetchCommunityCreators,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";
import { fetchImageGenerationHistory } from "@/lib/client/studio/image-studio/imageStudioClient";
import { fetchStoryRooms } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { getCreationTypeDisplayName } from "@/lib/shared/presentation/terminology";

export const GLOBAL_SEARCH_REFRESH_AFTER_MS = 5 * 60 * 1000;
export const GLOBAL_SEARCH_MEDIA_LIMIT = 60;

// Backend creation type to search type key. Only these creation types
// are searchable; TIMELINE joins Lore because the Lore page lists both.
export const GLOBAL_SEARCH_CREATION_TYPES = Object.freeze({
  CHARACTER: "character",
  PLAYER_CHARACTER: "player",
  POSE: "pose",
  OUTFIT: "outfit",
  LOCATION: "location",
  IMAGE_PRESET: "preset",
  ROOM_TEMPLATE: "story",
  STORYLINE: "adventure",
  LORE: "lore",
  TIMELINE: "lore",
});

// One destination per type and scope, each a route that exists
// (app/studio/v2/editor/[id], app/studio/v2/lore/timelines/[id],
// app/studio/v2/stories/[id], app/studio/creations/[id],
// app/studio/v2/creators/[handle]). The page label is what the row
// shows after the type.
export const GLOBAL_SEARCH_DESTINATIONS = Object.freeze({
  ownCreation: Object.freeze({
    pageLabel: "Editor",
    href: (id) => `/studio/v2/editor/${encodeURIComponent(id)}`,
  }),
  ownTimeline: Object.freeze({
    pageLabel: "Lore",
    href: (id) => `/studio/v2/lore/timelines/${encodeURIComponent(id)}`,
  }),
  ownStory: Object.freeze({
    pageLabel: "Stories",
    href: (id) => `/studio/v2/stories/${encodeURIComponent(id)}`,
  }),
  communityCreation: Object.freeze({
    pageLabel: "Creation page",
    href: (id) => `/studio/creations/${encodeURIComponent(id)}`,
  }),
  creator: Object.freeze({
    pageLabel: "Creators",
    href: (handle) => `/studio/v2/creators/${encodeURIComponent(handle)}`,
  }),
});

const IDLE_SOURCE = Object.freeze({ items: [], status: "idle", errorMessage: "" });
const ALL_FAILED_MESSAGE = "Search could not load. Try again in a moment.";
const OWN_PARTIAL_MESSAGE = "Some of your items could not be loaded.";
const COMMUNITY_PARTIAL_MESSAGE = "Some community items could not be loaded.";
const MEDIA_TITLE_MAX = 80;

function getCreationImage(creation) {
  return (
    creation?.imageUrl ||
    creation?.featuredMedia?.[0]?.imageUrl ||
    creation?.featuredMedia?.[0]?.url ||
    ""
  );
}

function getVisibilityLabel(creation) {
  const visibility = String(creation?.visibility || "").trim().toLowerCase();
  if (!visibility) return "";
  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

function getHandleLabel(value) {
  const handle = String(value || "").trim().replace(/^@/, "");
  return handle ? `@${handle}` : "";
}

function projectOwnCreation(creation) {
  const backendType = String(creation?.type || "").trim().toUpperCase();
  const type = GLOBAL_SEARCH_CREATION_TYPES[backendType];
  if (!type || !creation?.id) return null;

  const destination =
    backendType === "TIMELINE"
      ? GLOBAL_SEARCH_DESTINATIONS.ownTimeline
      : GLOBAL_SEARCH_DESTINATIONS.ownCreation;
  const title = String(creation.title || "").trim() || "Untitled";
  const subtitle = getVisibilityLabel(creation);
  const typeLabel = getCreationTypeDisplayName(backendType);

  return {
    key: `own-creation-${creation.id}`,
    scope: "own",
    type,
    iconKey: type,
    title,
    subtitle,
    typeLabel,
    pageLabel: destination.pageLabel,
    href: destination.href(creation.id),
    imageSrc: getCreationImage(creation),
    isSoon: false,
    searchText: normalizeGlobalSearchText(
      title,
      subtitle,
      creation.subtitle,
      creation.description,
      creation.tags,
      typeLabel
    ),
  };
}

function projectCommunityCreation(creation) {
  const backendType = String(creation?.type || "").trim().toUpperCase();
  const type = GLOBAL_SEARCH_CREATION_TYPES[backendType];
  if (!type || !creation?.id) return null;

  const destination = GLOBAL_SEARCH_DESTINATIONS.communityCreation;
  const title = String(creation.title || "").trim() || "Untitled";
  const subtitle = getHandleLabel(creation.creatorHandle || creation.creatorUsername);
  const typeLabel = getCreationTypeDisplayName(backendType);

  return {
    key: `community-creation-${creation.id}`,
    scope: "community",
    type,
    iconKey: type,
    title,
    subtitle,
    typeLabel,
    pageLabel: destination.pageLabel,
    href: destination.href(creation.id),
    imageSrc: getCreationImage(creation),
    isSoon: false,
    searchText: normalizeGlobalSearchText(
      title,
      subtitle,
      creation.subtitle,
      creation.description,
      creation.tags,
      typeLabel
    ),
  };
}

function projectStoryInProgress(story) {
  if (!story?.id) return null;

  const destination = GLOBAL_SEARCH_DESTINATIONS.ownStory;
  const title = String(story.title || "").trim() || "Untitled story";
  const castNames = (Array.isArray(story.cast) ? story.cast : [])
    .map((member) => member?.name || member?.title || "")
    .filter(Boolean);
  const subtitle = String(story.subtitle || "").trim() || castNames.slice(0, 3).join(", ");

  return {
    key: `own-story-${story.id}`,
    scope: "own",
    type: "story",
    iconKey: "story",
    title,
    subtitle,
    typeLabel: "Story",
    pageLabel: destination.pageLabel,
    href: destination.href(story.id),
    imageSrc: story.imageUrl || story.cast?.[0]?.imageUrl || "",
    isSoon: false,
    searchText: normalizeGlobalSearchText(
      title,
      subtitle,
      castNames,
      story.scenario?.title,
      story.narrator?.title,
      story.location?.title
    ),
  };
}

function projectCreator(profile) {
  const handle = String(profile?.handle || profile?.username || "").trim().replace(/^@/, "");
  if (!handle) return null;

  const destination = GLOBAL_SEARCH_DESTINATIONS.creator;
  const title = String(profile.displayName || "").trim() || handle;
  const subtitle = getHandleLabel(handle);

  return {
    key: `community-creator-${profile.id || handle}`,
    scope: "community",
    type: "creator",
    iconKey: "creator",
    title,
    subtitle,
    typeLabel: "Creator",
    pageLabel: destination.pageLabel,
    href: destination.href(handle),
    imageSrc: profile.avatarUrl || "",
    isSoon: false,
    searchText: normalizeGlobalSearchText(title, subtitle, profile.username, profile.tagline),
  };
}

// Generated media is searchable by its prompt text, but no page can
// open with one output selected yet (docs/references/global-search/
// NOTES.md, frontend follow-up), so every media row renders Soon.
function projectMediaOutput(entry) {
  const id = entry?.id || entry?.imageOutputId || entry?.image_output_id;
  if (!id) return null;

  const job = entry?.job || {};
  const promptSnapshot = job.promptSnapshot || job.prompt_snapshot || {};
  const prompt = String(
    entry.title || promptSnapshot.userPrompt || promptSnapshot.user_prompt || ""
  ).trim();
  const isVideo = String(entry.type || "").toUpperCase() === "VIDEO";
  const title = prompt
    ? prompt.length > MEDIA_TITLE_MAX
      ? `${prompt.slice(0, MEDIA_TITLE_MAX).trim()}...`
      : prompt
    : isVideo
      ? "Generated video"
      : "Generated image";

  return {
    key: `own-media-${id}`,
    scope: "own",
    type: "media",
    iconKey: isVideo ? "video" : "image",
    title,
    subtitle: "",
    typeLabel: isVideo ? "Video" : "Image",
    pageLabel: "",
    href: "",
    imageSrc: "",
    isSoon: true,
    searchText: normalizeGlobalSearchText(prompt, promptSnapshot.compiledPrompt, promptSnapshot.compiled_prompt),
  };
}

function fulfilledValue(result, fallback = []) {
  return result?.status === "fulfilled" ? result.value : fallback;
}

function rejectedMessage(results) {
  const rejected = results.find((result) => result?.status === "rejected");
  return rejected?.reason?.message || ALL_FAILED_MESSAGE;
}

function buildSource(items, results, partialMessage) {
  const failures = results.filter((result) => result?.status === "rejected").length;
  if (failures === results.length) {
    return { items: [], status: "error", errorMessage: rejectedMessage(results) };
  }
  return {
    items,
    status: "ready",
    errorMessage: failures ? partialMessage : "",
  };
}

export function useGlobalSearchAdapter({
  navigate = null,
  loadOwnCreations = fetchOwnedCreations,
  loadStoriesInProgress = fetchStoryRooms,
  loadMediaHistory = fetchImageGenerationHistory,
  loadCommunityCreations = fetchCommunityCreations,
  loadCommunityCreators = fetchCommunityCreators,
} = {}) {
  const [own, setOwn] = useState(IDLE_SOURCE);
  const [community, setCommunity] = useState(IDLE_SOURCE);
  const loadedAtRef = useRef(0);
  const inFlightRef = useRef(false);

  const requestData = useCallback(async () => {
    if (inFlightRef.current) return;
    if (loadedAtRef.current && Date.now() - loadedAtRef.current < GLOBAL_SEARCH_REFRESH_AFTER_MS) {
      return;
    }

    inFlightRef.current = true;
    setOwn((current) => ({ ...current, status: "loading", errorMessage: "" }));
    setCommunity((current) => ({ ...current, status: "loading", errorMessage: "" }));

    const [creations, stories, media, communityCreations, creators] = await Promise.allSettled([
      loadOwnCreations({ view: "summary" }),
      loadStoriesInProgress(),
      loadMediaHistory({ limit: GLOBAL_SEARCH_MEDIA_LIMIT }),
      loadCommunityCreations(),
      loadCommunityCreators(),
    ]);

    const ownItems = [
      ...fulfilledValue(creations).map(projectOwnCreation),
      ...fulfilledValue(stories).map(projectStoryInProgress),
      ...(fulfilledValue(media, {})?.outputs || []).map(projectMediaOutput),
    ].filter(Boolean);
    const ownIds = new Set(
      fulfilledValue(creations)
        .map((creation) => creation?.id)
        .filter(Boolean)
    );

    const communityItems = [
      ...fulfilledValue(communityCreations)
        .filter((creation) => !ownIds.has(creation?.id))
        .map(projectCommunityCreation),
      ...fulfilledValue(creators).map(projectCreator),
    ].filter(Boolean);

    setOwn(buildSource(ownItems, [creations, stories, media], OWN_PARTIAL_MESSAGE));
    setCommunity(
      buildSource(communityItems, [communityCreations, creators], COMMUNITY_PARTIAL_MESSAGE)
    );

    loadedAtRef.current = Date.now();
    inFlightRef.current = false;
  }, [
    loadOwnCreations,
    loadStoriesInProgress,
    loadMediaHistory,
    loadCommunityCreations,
    loadCommunityCreators,
  ]);

  const onNavigate = useCallback(
    (href) => {
      if (href) navigate?.(href);
    },
    [navigate]
  );

  return {
    own,
    community,
    onRequestData: requestData,
    onNavigate,
  };
}
