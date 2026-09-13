// The share type rule, one place (fe/share-og brief 1, D4, RULED 13 Sep
// 2026; sharing is public only since follow-up 1, RULED 13 Sep 2026).
// Every share button in the app hands an asset to buildShareIntent and
// renders what comes back. Nothing outside this file decides whether a
// share carries the stylized card, the plain link preview, or the
// blocked state.
//
// The rule:
// - An image (and video later) shares the actual image at the medium
//   or large stored derivative the served payload already carries,
//   never an upscale, never the original, with no card styling. The
//   link lands on the public page of the creation the image was
//   generated from, with the image named in the URL, or on the
//   sharer's public profile when the image has no source creation.
// - A playable asset (character, story, adventure) shares the stylized
//   card the share-card image route composes from public creation
//   data, and the link lands on that asset's public landing page.
// - A creator profile shares the plain link preview (avatar, display
//   name, handle) and lands on the public profile route.
// - Any other creation shares the plain link preview and lands on the
//   existing public creation page.
// - The byline is the creator. The ref on the link is the sharer.
//   Sharing a creation you did not make still credits the maker on the
//   card and still earns the sharer the referral.
// - Sharing is public only. A private creation and an Internal one
//   (data-layer UNLISTED) both take the blocked state: one sentence,
//   Submit for public review through the existing publication review
//   path, and Close. No link is built for either.

import {
  appendShareRef,
  buildCreationSharePath,
  buildImageSharePath,
  buildProfileSharePath,
  buildShareUrl,
  normalizeShareUsername,
} from "./shareUrl.js";

export const SHARE_TYPE_RULE_VERSION = "1.1.0";

export const SHARE_KINDS = Object.freeze({
  IMAGE: "image",
  VIDEO: "video",
  CHARACTER: "character",
  STORY: "story",
  ADVENTURE: "adventure",
  PROFILE: "profile",
  LINK: "link",
});

export const SHARE_VISIBILITIES = Object.freeze({
  PRIVATE: "PRIVATE",
  INTERNAL: "INTERNAL",
  PUBLIC: "PUBLIC",
  CANON: "CANON",
});

export const SHARE_REVIEW_STATES = Object.freeze({
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUBMITTED: "submitted",
  ERROR: "error",
});

export const SHARE_COPY = Object.freeze({
  blockedNotPublic: "This creation can only be shared once it is public.",
  submitForReview: "Submit for public review",
  submittedForReview: "Submitted for review",
  submitFailed: "Could not submit for review.",
  invitation: "Play free on Crestfall",
});

const PLAYABLE_KINDS = new Set([SHARE_KINDS.CHARACTER, SHARE_KINDS.STORY, SHARE_KINDS.ADVENTURE]);
const MEDIA_KINDS = new Set([SHARE_KINDS.IMAGE, SHARE_KINDS.VIDEO]);
const KNOWN_KINDS = new Set(Object.values(SHARE_KINDS));
const ALWAYS_PUBLIC_KINDS = new Set([...MEDIA_KINDS, SHARE_KINDS.PROFILE]);

// Data-layer type to share kind. Story and Adventure are the display
// words for the two template types (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md
// section 1); the map is the only place those data-layer names appear
// in this package.
const CREATION_TYPE_KINDS = Object.freeze({
  CHARACTER: SHARE_KINDS.CHARACTER,
  PLAYER_CHARACTER: SHARE_KINDS.CHARACTER,
  ROOM_TEMPLATE: SHARE_KINDS.STORY,
  STORYLINE: SHARE_KINDS.ADVENTURE,
});

const MEDIA_TYPE_KINDS = Object.freeze({
  IMAGE: SHARE_KINDS.IMAGE,
  VIDEO: SHARE_KINDS.VIDEO,
});

const DESCRIPTION_SENTINEL = "No description has been added yet.";

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function upper(value) {
  return text(value).toUpperCase();
}

export function getShareKind({ kind = "", creationType = "", mediaType = "" } = {}) {
  const explicit = text(kind).toLowerCase();
  if (KNOWN_KINDS.has(explicit)) return explicit;

  const media = MEDIA_TYPE_KINDS[upper(mediaType)];
  if (media) return media;

  const creation = CREATION_TYPE_KINDS[upper(creationType)];
  if (creation) return creation;

  return SHARE_KINDS.LINK;
}

export function isPlayableShareKind(kind) {
  return PLAYABLE_KINDS.has(text(kind).toLowerCase());
}

export function isMediaShareKind(kind) {
  return MEDIA_KINDS.has(text(kind).toLowerCase());
}

// The card question, answered once: only a playable asset carries the
// stylized card. Media, a profile, and everything else share without
// one.
export function shareCarriesCard(kind) {
  return isPlayableShareKind(kind);
}

// PRIVATE, UNLISTED (the data-layer word for Internal), INTERNAL,
// PUBLIC, and a canon status all fold to the four ruled states. An
// unknown or missing value reads as PRIVATE so a share never leaks by
// accident.
export function normalizeShareVisibility({ visibility = "", canonStatus = "" } = {}) {
  const canon = upper(canonStatus);
  if (["CANON", "OFFICIAL", "ACCEPTED"].includes(canon)) return SHARE_VISIBILITIES.CANON;

  const value = upper(visibility);
  if (value === "UNLISTED" || value === SHARE_VISIBILITIES.INTERNAL) return SHARE_VISIBILITIES.INTERNAL;
  if (value === SHARE_VISIBILITIES.PUBLIC) return SHARE_VISIBILITIES.PUBLIC;
  if (value === SHARE_VISIBILITIES.CANON) return SHARE_VISIBILITIES.CANON;
  return SHARE_VISIBILITIES.PRIVATE;
}

// Sharing is public only: PUBLIC and CANON share, PRIVATE and
// INTERNAL are blocked.
export function isShareableVisibility(visibility) {
  return visibility === SHARE_VISIBILITIES.PUBLIC || visibility === SHARE_VISIBILITIES.CANON;
}

// A creation already in the review queue reads as submitted so the
// blocked sheet never offers a second submission.
export function normalizeShareReviewState({ lifecycleStatus = "", reviewStatus = "" } = {}) {
  const status = upper(lifecycleStatus) || upper(reviewStatus);
  return status === "IN_REVIEW" ? SHARE_REVIEW_STATES.SUBMITTED : SHARE_REVIEW_STATES.IDLE;
}

// Medium first (the stored card derivative), large second (the stored
// display derivative), never the original and never an upscale. The
// keys are the served payload's own names and their snake_case and
// presentation aliases; originalUrl and upscaledUrl are never read.
export function selectShareImageSource(media = {}) {
  const source = media && typeof media === "object" ? media : {};
  const medium = text(source.cardUrl || source.card_url || source.cardSrc);
  if (medium) return { src: medium, variant: "medium" };

  const large = text(
    source.displayUrl || source.display_url || source.displaySrc || source.imageUrl || source.image_url
  );
  if (large) return { src: large, variant: "large" };

  return { src: "", variant: null };
}

// Both derivatives the sheet may show: the medium one in the preview,
// the large one behind it. Neither is ever the original.
export function selectShareImageSources(media = {}) {
  const source = media && typeof media === "object" ? media : {};
  const medium = text(source.cardUrl || source.card_url || source.cardSrc);
  const large = text(source.displayUrl || source.display_url || source.displaySrc);
  return { medium, large };
}

export function stripDescriptionSentinel(description) {
  const value = text(description);
  return value === DESCRIPTION_SENTINEL ? "" : value;
}

function formatHandle({ creatorHandle = "", creatorUsername = "" } = {}) {
  const username = normalizeShareUsername(creatorUsername);
  const handle = username ? `@${username}` : text(creatorHandle).replace(/^@?/, "@");
  return handle && handle !== "@" ? handle : "";
}

// The byline reads "by @maker" on a creation and just "@handle" on a
// profile, where the handle is the subject, not the maker.
function formatByline(asset, kind) {
  const handle = formatHandle(asset);
  if (!handle) return "";
  return kind === SHARE_KINDS.PROFILE ? handle : `by ${handle}`;
}

/**
 * @param {Object} asset
 * @param {string} [asset.kind] explicit share kind, else derived
 * @param {string} [asset.creationType] data-layer creation type
 * @param {string} [asset.mediaType] IMAGE or VIDEO for a media output
 * @param {string} asset.id creation id, the media output id, or the profile id
 * @param {string} [asset.title]
 * @param {string} [asset.creatorHandle] "@maker" as served
 * @param {string} [asset.creatorUsername] bare username, preferred
 * @param {string} [asset.visibility] PRIVATE, UNLISTED, INTERNAL, PUBLIC, CANON
 * @param {string} [asset.canonStatus]
 * @param {string} [asset.lifecycleStatus] DRAFT, IN_REVIEW, APPROVED, ...
 * @param {string} [asset.featuredImageSrc] creation preview image (card derivative), or the profile avatar
 * @param {Object} [asset.media] served derivative fields for a media output
 * @param {string} [asset.sourceCreationId] the creation an image was generated from
 * @param {Object} [context]
 * @param {string} [context.sharerUsername] the signed-in sharer's username
 * @param {string} [context.origin] absolute origin for the link; relative when absent
 */
export function buildShareIntent(asset = {}, { sharerUsername = "", origin = "" } = {}) {
  const kind = getShareKind(asset);
  const id = text(asset.id);
  const title = text(asset.title) || "Untitled";
  const byline = formatByline(asset, kind);
  const sharer = normalizeShareUsername(sharerUsername);
  const isMedia = isMediaShareKind(kind);
  const isProfile = kind === SHARE_KINDS.PROFILE;
  const hasCard = shareCarriesCard(kind);
  const visibility = ALWAYS_PUBLIC_KINDS.has(kind)
    ? SHARE_VISIBILITIES.PUBLIC
    : normalizeShareVisibility(asset);

  const base = {
    kind,
    id,
    title,
    byline,
    hasCard,
    visibility,
    sharerUsername: sharer,
    url: "",
    previewImageSrc: "",
    previewImageLargeSrc: "",
    cardImageSrc: null,
    blockedMessage: null,
    reviewState: SHARE_REVIEW_STATES.IDLE,
    nativeShare: null,
  };

  if (!isShareableVisibility(visibility)) {
    return {
      ...base,
      blockedMessage: SHARE_COPY.blockedNotPublic,
      reviewState: normalizeShareReviewState(asset),
    };
  }

  let path = "";
  let previewImageSrc = "";
  let previewImageLargeSrc = "";

  if (isMedia) {
    path = buildImageSharePath({
      sourceCreationId: asset.sourceCreationId,
      imageOutputId: id,
      sharerUsername: sharer,
    });
    const sources = selectShareImageSources(asset.media || asset);
    previewImageSrc = selectShareImageSource(asset.media || asset).src;
    previewImageLargeSrc = sources.large;
  } else if (isProfile) {
    path = buildProfileSharePath({ username: asset.creatorUsername || asset.creatorHandle });
    previewImageSrc = text(asset.featuredImageSrc);
  } else {
    path = buildCreationSharePath({ kind, id, title });
    previewImageSrc = text(asset.featuredImageSrc);
  }

  const url = buildShareUrl({ path: appendShareRef(path, sharer), origin });
  const cardAvailable = hasCard && Boolean(id);

  return {
    ...base,
    url,
    previewImageSrc,
    previewImageLargeSrc,
    cardImageSrc: cardAvailable ? `/api/share-card/${encodeURIComponent(id)}` : null,
    nativeShare: { title, url },
  };
}
