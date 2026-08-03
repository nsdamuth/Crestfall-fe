import { PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS } from "./PublicProfileActivityFeed.contract";

const SAMPLE_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Crect width='240' height='240' fill='%23171310'/%3E%3Ccircle cx='120' cy='120' r='70' fill='%238f6d38' opacity='.7'/%3E%3C/svg%3E";

export const PUBLIC_PROFILE_ACTIVITY_FEED_FIXTURES = Object.freeze([
  {
    id: "mixed-activity",
    label: "Mixed activity",
    props: {
      events: [
        {
          id: "donation-1",
          kind: PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.DONATION,
          amountNet: 500,
          senderLabel: "crestfallen_patron",
          message: "Your worldbuilding deserves support.",
          occurredLabel: "Just now",
        },
        {
          id: "creation-1",
          kind: PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.CREATION,
          username: "crestfallen_ember",
          actionLabel: "released",
          typeLabel: "character",
          href: "#creation-preview",
          imageUrl: SAMPLE_IMAGE,
          title: "Seraphine Vale",
          description: "A diplomatic mage bound to a fractured royal court.",
          occurredLabel: "18m ago",
        },
      ],
    },
  },
  {
    id: "creation-without-image",
    label: "Creation without image",
    props: {
      events: [
        {
          id: "creation-2",
          kind: PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.CREATION,
          username: "crestfallen_archivist",
          actionLabel: "updated",
          typeLabel: "location registry",
          href: "#location-registry",
          imageUrl: null,
          title: "The Lantern District",
          description: "No description available.",
          occurredLabel: "3h ago",
        },
      ],
    },
  },
  {
    id: "anonymous-donation",
    label: "Anonymous donation",
    props: {
      events: [
        {
          id: "donation-2",
          kind: PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.DONATION,
          amountNet: 100,
          senderLabel: "Mystery Donor",
          message: "",
          occurredLabel: "2d ago",
        },
      ],
    },
  },
  {
    id: "long-content",
    label: "Long content",
    props: {
      events: [
        {
          id: "creation-long",
          kind: PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.CREATION,
          username: "crestfallen_creator_with_an_unusually_long_public_handle",
          actionLabel: "updated",
          typeLabel: "organization registry",
          href: "#long-creation",
          imageUrl: SAMPLE_IMAGE,
          title:
            "The Independent Cartographers and Astronomers of the Outer Meridian",
          description:
            "A deliberately long creation description used to verify clamping, wrapping, spacing, and narrow-screen behavior without exposing private creator data.",
          occurredLabel: "Nov 14, 2025",
        },
      ],
    },
  },
  {
    id: "empty",
    label: "No activity",
    props: {
      events: [],
    },
  },
  {
    id: "custom-empty-copy",
    label: "Custom empty copy",
    props: {
      events: [],
      emptyTitle: "Nothing public yet",
      emptyBody: "New releases and creator support will appear here later.",
    },
  },
]);

export function getPublicProfileActivityFeedFixture(fixtureId) {
  return (
    PUBLIC_PROFILE_ACTIVITY_FEED_FIXTURES.find(
      (fixture) => fixture.id === fixtureId
    ) || PUBLIC_PROFILE_ACTIVITY_FEED_FIXTURES[0]
  );
}
