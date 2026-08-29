import { buildFeaturedMedia, getFirstCreationImageUrl } from "../creations/creationMedia.js";
import {
  getImagePresentationMetadata,
  resolveImageFocalObjectPosition,
} from "../media/imageFocalPresentation.js";
import { projectCreationToVaultItem } from "./vaultPresentation.js";

const CONTENT_RATING_TO_TIER = Object.freeze({
  SFW: "EVERYONE",
  MATURE: "TEEN",
  EXPLICIT: "ADULT",
});

const STORY_STARTABLE_TYPES = new Set([
  "CHARACTER",
  "ROOM_TEMPLATE",
  "STORYLINE",
]);

export const STORY_CONTINUE_DEFAULT_HERO_IMAGE_SRC =
  "/assets/covers/banner.png";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeUpper(value, fallback = "") {
  return normalizeText(value, fallback).toUpperCase();
}

function toTimestamp(value) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function getRoomHeroMedia(room = {}) {
  const roomData = normalizeObject(room?.room?.data || room?.data);
  const candidates = [
    roomData.openingHeroImage,
    roomData.opening_hero_image,
    roomData.heroImage,
    roomData.hero_image,
  ]
    .map(normalizeObject)
    .filter((entry) => Object.keys(entry).length);

  for (const entry of candidates) {
    const image = normalizeText(
      entry.displayUrl ||
        entry.display_url ||
        entry.thumbnailUrl ||
        entry.thumbnail_url ||
        entry.imageUrl ||
        entry.image_url ||
        entry.url
    );
    if (image) {
      return {
        ...entry,
        imageUrl: image,
      };
    }
  }

  return null;
}

function getRoomSourceCreationId(room = {}) {
  const roomData = normalizeObject(room?.room?.data || room?.data);
  const source = normalizeObject(roomData.source);
  const templateId = normalizeText(source.templateId || source.template_id);
  if (templateId) return templateId;

  const participants = Array.isArray(room?.participants) ? room.participants : [];
  const defaultCharacter = participants.find(
    (participant) =>
      participant?.isDefault &&
      normalizeUpper(participant?.participantType) === "CHARACTER" &&
      normalizeText(participant?.creationId)
  );
  if (defaultCharacter?.creationId) return normalizeText(defaultCharacter.creationId);

  const anyCharacter = participants.find(
    (participant) =>
      normalizeUpper(participant?.participantType) === "CHARACTER" &&
      normalizeText(participant?.creationId)
  );
  return normalizeText(anyCharacter?.creationId) || null;
}

function getRoomStorylineRuntime(room = {}) {
  const state = normalizeObject(room?.state);
  const nestedState = normalizeObject(state?.state);
  const storyRuntime = normalizeObject(
    nestedState.storyRuntime || nestedState.story_runtime
  );
  return normalizeObject(
    storyRuntime.storylineRuntime || storyRuntime.storyline_runtime
  );
}

function getStoryHeroMediaUrl(media) {
  if (typeof media === "string") return normalizeText(media) || null;

  const item = normalizeObject(media);
  return (
    normalizeText(
      item.assetUrl ||
        item.asset_url ||
        item.originalUrl ||
        item.original_url ||
        item.displayUrl ||
        item.display_url ||
        item.imageUrl ||
        item.image_url ||
        item.url
    ) || null
  );
}

function getFirstAssignedStoryHeroMedia(media = []) {
  for (const item of Array.isArray(media) ? media : []) {
    if (item?.isPlaceholder) continue;
    const imageUrl = getStoryHeroMediaUrl(item);
    if (imageUrl) return typeof item === "string" ? { imageUrl } : item;
  }

  return null;
}

function getAssignedSourceCreationMedia(sourceCreation = {}) {
  const projectedSource = normalizeObject(sourceCreation);
  const rawCreation = normalizeObject(projectedSource.rawCreation);
  const creation = Object.keys(rawCreation).length ? rawCreation : projectedSource;
  const data = normalizeObject(creation.data);
  const title = normalizeText(creation.title || data.title || data.name, "Story");

  const assignedMedia =
    getFirstAssignedStoryHeroMedia(creation.featuredMedia) ||
    getFirstAssignedStoryHeroMedia(creation.featured_media) ||
    getFirstAssignedStoryHeroMedia(data.featuredMedia) ||
    getFirstAssignedStoryHeroMedia(data.featured_media);

  if (assignedMedia) return assignedMedia;

  const featuredMedia = buildFeaturedMedia({
    row: creation,
    data,
    title,
    max: 4,
    padTo: 0,
    usePlaceholder: false,
    idPrefix: `story-source-${creation.id || "creation"}-media`,
  }).filter((media) => !media?.isPlaceholder);

  return (
    getFirstAssignedStoryHeroMedia(featuredMedia) ||
    (getFirstCreationImageUrl(featuredMedia, null)
      ? { imageUrl: getFirstCreationImageUrl(featuredMedia, null) }
      : null)
  );
}

export function resolveStoryContinueImageSrc(item = {}, sourceCreation = null) {
  return (
    getStoryHeroMediaUrl(getAssignedSourceCreationMedia(sourceCreation)) ||
    normalizeText(item?.imageSrc) ||
    STORY_CONTINUE_DEFAULT_HERO_IMAGE_SRC
  );
}

export function resolveStoryContinueImageAnchor(
  item = {},
  sourceCreation = null
) {
  const sourceMedia = getAssignedSourceCreationMedia(sourceCreation);
  if (sourceMedia) {
    return resolveImageFocalObjectPosition(sourceMedia, { fallback: null });
  }

  return resolveImageFocalObjectPosition(
    { presentationMetadata: item?.imagePresentationMetadata || null },
    { fallback: null }
  );
}

export function projectStoryRoomToContinueItem(room = {}, index = 0) {
  const id = normalizeText(room.id, `story-room-${index}`);
  const storylineRuntime = getRoomStorylineRuntime(room);
  const storylineActive = Object.keys(storylineRuntime).length > 0;
  const storylineInstance = normalizeObject(storylineRuntime.storylineInstance);
  const storylineId = normalizeText(
    storylineInstance.storylineId || storylineInstance.storyline_id
  );
  const lastActive = room.lastActive || room.state?.updatedAt || room.room?.updatedAt || null;
  const roomHeroMedia = getRoomHeroMedia(room);

  return {
    id,
    roomId: id,
    kind: storylineActive ? "adventure" : "story",
    title: normalizeText(room.title, "Private Story"),
    subtitle: normalizeText(
      room.subtitle,
      storylineActive ? "Adventure in progress" : "Story in progress"
    ),
    imageSrc: getStoryHeroMediaUrl(roomHeroMedia),
    imagePresentationMetadata: getImagePresentationMetadata(roomHeroMedia),
    isContinue: true,
    status: normalizeUpper(room.status, "ACTIVE"),
    visibility: normalizeUpper(room.visibility, "PRIVATE") === "UNLISTED"
      ? "INTERNAL"
      : normalizeUpper(room.visibility, "PRIVATE"),
    ratingTier:
      CONTENT_RATING_TO_TIER[normalizeUpper(room.contentRating, "SFW")] ||
      "EVERYONE",
    recency: toTimestamp(lastActive),
    lastPlayed: lastActive,
    description: normalizeText(room.lastMessage, "Open the Story to continue."),
    scenario: normalizeText(room.scenario),
    narrator: normalizeText(room.narrator),
    location: normalizeText(room.location),
    cast: Array.isArray(room.cast) ? room.cast.filter(Boolean) : [],
    sourceCreationId: storylineId || getRoomSourceCreationId(room),
    rawRoom: room,
  };
}

export function projectCreationToStoryStartable(
  creation = {},
  index = 0,
  { isOwn = true } = {}
) {
  const type = normalizeUpper(creation.type || creation.data?.type);
  if (!STORY_STARTABLE_TYPES.has(type)) return null;

  const vaultItem = projectCreationToVaultItem(creation, index, { isOwn });
  const status = normalizeUpper(creation.status || creation.data?.status, "DRAFT");
  const rawContentRating = normalizeUpper(
    creation.contentRating || creation.content_rating || creation.data?.contentRating || creation.data?.content_rating,
    "SFW"
  );

  return {
    ...vaultItem,
    kind:
      type === "CHARACTER"
        ? "character"
        : type === "STORYLINE"
          ? "adventure"
          : "story",
    type,
    isContinue: false,
    isTemplate: type === "ROOM_TEMPLATE",
    isArchived: status === "ARCHIVED",
    status,
    ratingTier: CONTENT_RATING_TO_TIER[rawContentRating] || "EVERYONE",
    playableNow: type === "CHARACTER" || type === "ROOM_TEMPLATE",
    rawCreation: creation,
  };
}

export function projectCreationsToStoryStartables(creations = [], options = {}) {
  return (Array.isArray(creations) ? creations : [])
    .map((creation, index) =>
      projectCreationToStoryStartable(creation, index, options)
    )
    .filter(Boolean);
}
