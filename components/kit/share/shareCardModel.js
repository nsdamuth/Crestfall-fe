// The one card model (fe/share-og brief 1, decision 2A). Turns a public
// creation preview payload into the content the share card carries:
// featured image, title, creator byline, a short excerpt, and the play
// invitation. The share-card image route renders this model in the
// Satori subset; the landing page renders the same model as page text.
// No second recipe exists.

import {
  SHARE_COPY,
  getShareKind,
  shareCarriesCard,
  stripDescriptionSentinel,
} from "./shareTypeRule.js";
import { normalizeShareUsername } from "./shareUrl.js";

export const SHARE_CARD_EXCERPT_MAX = 140;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function firstMediaArray(creation) {
  const data = object(creation.data);
  const candidates = [
    creation.featuredMedia,
    creation.featured_media,
    data.featuredMedia,
    data.featured_media,
  ];
  return candidates.find((entry) => Array.isArray(entry) && entry.length > 0) || [];
}

export function pickShareCardImage(creation = {}) {
  const media = firstMediaArray(object(creation)).find((entry) => entry && !entry.isPlaceholder);
  if (media) {
    const src = text(media.cardUrl || media.card_url || media.imageUrl || media.url || media.displayUrl);
    if (src) {
      return {
        src,
        imageOutputId: text(media.imageOutputId || media.image_output_id),
      };
    }
  }

  const direct = text(object(creation).imageUrl || object(creation).image_url);
  return { src: direct, imageOutputId: "" };
}

export function toShareCardExcerpt(description, max = SHARE_CARD_EXCERPT_MAX) {
  const value = stripDescriptionSentinel(description).replace(/\s+/g, " ");
  if (!value) return "";
  if (value.length <= max) return value;

  const cut = value.slice(0, max);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > max / 2 ? cut.slice(0, boundary) : cut).replace(/[\s,;:.]+$/g, "")}...`;
}

/**
 * @param {Object} payload
 * @param {Object} payload.creation the preview creation (title, type,
 *   description, featuredMedia, creatorHandle, creatorUsername)
 * @param {Object} [payload.creator] the preview creator ({ username,
 *   handle, displayName })
 */
export function buildShareCardModel({ creation = {}, creator = null } = {}) {
  const source = object(creation);
  const maker = object(creator || source.creator);
  const data = object(source.data);
  const kind = getShareKind({ creationType: source.type || data.type });
  const username = normalizeShareUsername(
    maker.username || source.creatorUsername || data.creator_username || data.creatorUsername
  );
  const handle = username
    ? `@${username}`
    : text(maker.handle || source.creatorHandle || data.creator_handle).replace(/^@?/, "@");
  const image = pickShareCardImage(source);

  return {
    id: text(source.id),
    kind,
    hasCard: shareCarriesCard(kind),
    title: text(source.title || data.title || data.name) || "Untitled",
    creatorUsername: username,
    creatorHandle: handle !== "@" ? handle : "",
    byline: handle !== "@" ? `by ${handle}` : "",
    excerpt: toShareCardExcerpt(source.description || data.description || data.summary),
    imageSrc: image.src,
    imageOutputId: image.imageOutputId,
    hasImage: Boolean(image.src),
    invitation: SHARE_COPY.invitation,
  };
}
