import {
  PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS,
  PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_DEFAULTS,
} from "./PublicProfileActivityFeed.contract";

const RELEASE_TOLERANCE_MS = 60 * 1000;

function getTimestamp(value) {
  const date = new Date(value || 0);
  const time = date.getTime();

  return Number.isNaN(time) ? 0 : time;
}

function formatRelativeTime(value, now = Date.now()) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  const deltaMs = now - date.getTime();
  const deltaMinutes = Math.floor(deltaMs / 60000);
  const deltaHours = Math.floor(deltaMinutes / 60);
  const deltaDays = Math.floor(deltaHours / 24);

  if (deltaMinutes < 1) return "Just now";
  if (deltaMinutes < 60) return `${deltaMinutes}m ago`;
  if (deltaHours < 24) return `${deltaHours}h ago`;
  if (deltaDays < 30) return `${deltaDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCreationImageUrl(creation) {
  return (
    creation?.imageUrl ||
    creation?.coverImageUrl ||
    creation?.thumbnailUrl ||
    creation?.featuredMedia?.[0]?.url ||
    creation?.featuredMedia?.[0]?.imageUrl ||
    creation?.featuredMedia?.[0]?.displayUrl ||
    null
  );
}

function getCreationDescription(creation) {
  return (
    creation?.description ||
    creation?.subtitle ||
    creation?.tagline ||
    creation?.data?.description ||
    creation?.data?.summary ||
    "No description available."
  );
}

function getCreationTypeLabel(creation) {
  return (
    creation?.typeLabel ||
    String(creation?.type || "CREATION").replaceAll("_", " ")
  );
}

function getCreationActivityAt(creation) {
  return (
    creation?.activityAt ||
    creation?.activity_at ||
    creation?.lastMeaningfulUpdateAt ||
    creation?.last_meaningful_update_at ||
    creation?.updatedAt ||
    creation?.updated_at ||
    creation?.createdAt ||
    creation?.created_at
  );
}

function getCreationCreatedAt(creation) {
  return creation?.createdAt || creation?.created_at;
}

function getCreationActionLabel(creation) {
  const createdAt = getTimestamp(getCreationCreatedAt(creation));
  const activityAt = getTimestamp(getCreationActivityAt(creation));

  if (!createdAt || !activityAt) return "released";

  return activityAt - createdAt > RELEASE_TOLERANCE_MS ? "updated" : "released";
}

function buildCreationEvent(creation, username, now) {
  const occurredAt = getCreationActivityAt(creation);

  return {
    id: `creation:${creation?.id}`,
    kind: PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.CREATION,
    occurredAt,
    occurredTimestamp: getTimestamp(occurredAt),
    occurredLabel: formatRelativeTime(occurredAt, now),
    username,
    actionLabel: getCreationActionLabel(creation),
    typeLabel: getCreationTypeLabel(creation).toLowerCase(),
    href: `/studio/creations/${encodeURIComponent(creation?.id)}`,
    imageUrl: getCreationImageUrl(creation),
    title: creation?.title || "Untitled Creation",
    description: getCreationDescription(creation),
  };
}

function buildDonationEvent(event, index, now) {
  return {
    id: event?.id || `donation:${index}`,
    kind: PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.DONATION,
    occurredAt: event?.occurredAt,
    occurredTimestamp: getTimestamp(event?.occurredAt),
    occurredLabel: formatRelativeTime(event?.occurredAt, now),
    amountNet: event?.amountNet,
    senderLabel: event?.senderLabel || "Mystery Donor",
    message: event?.message || "",
  };
}

export function buildPublicProfileActivityFeedViewProps(
  { profile, creations = [], donationEvents = [] } = {},
  now = Date.now()
) {
  const username = profile?.username || "creator";
  const safeCreations = Array.isArray(creations) ? creations : [];
  const safeDonationEvents = Array.isArray(donationEvents) ? donationEvents : [];

  const events = [
    ...safeDonationEvents.map((event, index) =>
      buildDonationEvent(event, index, now)
    ),
    ...safeCreations.map((creation) =>
      buildCreationEvent(creation, username, now)
    ),
  ]
    .sort((a, b) => b.occurredTimestamp - a.occurredTimestamp)
    .map(({ occurredAt, occurredTimestamp, ...event }) => event);

  return {
    ...PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_DEFAULTS,
    events,
  };
}

export function usePublicProfileActivityFeedViewModel(props) {
  return buildPublicProfileActivityFeedViewProps(props);
}
