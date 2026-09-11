// Fixture items carry the normalized GlobalSearchItem shape the top bar
// adapter produces (KitGlobalSearch.contract.js). Every href below is a
// route that exists in the app router (docs/references/global-search/
// NOTES.md, type to destination table); nothing is invented.
import { normalizeGlobalSearchText } from "./kitGlobalSearchQuery";

function item({
  key,
  scope,
  type,
  title,
  subtitle = "",
  typeLabel,
  pageLabel = "",
  href = "",
  imageSrc = "",
  iconKey = "",
  isSoon = false,
}) {
  return Object.freeze({
    key,
    scope,
    type,
    title,
    subtitle,
    typeLabel,
    pageLabel,
    href,
    imageSrc,
    iconKey: iconKey || type,
    isSoon,
    searchText: normalizeGlobalSearchText(title, subtitle, typeLabel),
  });
}

export const kitGlobalSearchFixtureOwnItems = Object.freeze([
  item({
    key: "own-character-lilith",
    scope: "own",
    type: "character",
    title: "Lilith of the Hollow Court",
    subtitle: "Private",
    typeLabel: "Character",
    pageLabel: "Editor",
    href: "/studio/v2/editor/11111111-1111-4111-8111-111111111111",
    imageSrc: "/tmp-mockup-images/canon-character-images/lilith.jpg",
  }),
  item({
    key: "own-player-ash",
    scope: "own",
    type: "player",
    title: "Ash Varrow",
    subtitle: "Private",
    typeLabel: "Player Character",
    pageLabel: "Editor",
    href: "/studio/v2/editor/22222222-2222-4222-8222-222222222222",
  }),
  item({
    key: "own-outfit-court-gown",
    scope: "own",
    type: "outfit",
    title: "Court gown, midnight",
    subtitle: "Private",
    typeLabel: "Outfit",
    pageLabel: "Editor",
    href: "/studio/v2/editor/33333333-3333-4333-8333-333333333333",
  }),
  item({
    key: "own-location-throne-room",
    scope: "own",
    type: "location",
    title: "The throne hall",
    subtitle: "Internal",
    typeLabel: "Location",
    pageLabel: "Editor",
    href: "/studio/v2/editor/44444444-4444-4444-8444-444444444444",
  }),
  item({
    key: "own-room-lilith-night",
    scope: "own",
    type: "story",
    title: "A night with Lilith",
    subtitle: "In progress",
    typeLabel: "Story",
    pageLabel: "Stories",
    href: "/studio/v2/stories/55555555-5555-4555-8555-555555555555",
  }),
  item({
    key: "own-adventure-hollow",
    scope: "own",
    type: "adventure",
    title: "The Hollow Court, season one",
    subtitle: "Private",
    typeLabel: "Adventure",
    pageLabel: "Editor",
    href: "/studio/v2/editor/66666666-6666-4666-8666-666666666666",
  }),
  item({
    key: "own-timeline-hollow",
    scope: "own",
    type: "lore",
    title: "Hollow Court timeline",
    subtitle: "Private",
    typeLabel: "Timeline",
    pageLabel: "Lore",
    href: "/studio/v2/lore/timelines/77777777-7777-4777-8777-777777777777",
  }),
  item({
    key: "own-media-lilith-portrait",
    scope: "own",
    type: "media",
    title: "Lilith, portrait in candlelight",
    subtitle: "",
    typeLabel: "Image",
    iconKey: "image",
    isSoon: true,
  }),
]);

export const kitGlobalSearchFixtureCommunityItems = Object.freeze([
  item({
    key: "community-character-lilith-remix",
    scope: "community",
    type: "character",
    title: "Lilith, remixed",
    subtitle: "@lyra",
    typeLabel: "Character",
    pageLabel: "Creation page",
    href: "/studio/creations/88888888-8888-4888-8888-888888888888",
  }),
  item({
    key: "community-story-hollow-court",
    scope: "community",
    type: "story",
    title: "The Hollow Court",
    subtitle: "@lyra",
    typeLabel: "Story",
    pageLabel: "Creation page",
    href: "/studio/creations/99999999-9999-4999-8999-999999999999",
  }),
  item({
    key: "community-creator-lyra",
    scope: "community",
    type: "creator",
    title: "Lyra",
    subtitle: "@lyra",
    typeLabel: "Creator",
    pageLabel: "Creators",
    href: "/studio/v2/creators/lyra",
  }),
  item({
    key: "community-lore-court-history",
    scope: "community",
    type: "lore",
    title: "A history of the Hollow Court",
    subtitle: "@archivist",
    typeLabel: "Lore Asset",
    pageLabel: "Creation page",
    href: "/studio/creations/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  }),
  item({
    key: "community-location-market",
    scope: "community",
    type: "location",
    title: "Night market under the aqueduct",
    subtitle: "@wren",
    typeLabel: "Location",
    pageLabel: "Creation page",
    href: "/studio/creations/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  }),
]);

const readyOwn = Object.freeze({
  items: kitGlobalSearchFixtureOwnItems,
  status: "ready",
  errorMessage: "",
});

const readyCommunity = Object.freeze({
  items: kitGlobalSearchFixtureCommunityItems,
  status: "ready",
  errorMessage: "",
});

// Placeholder "Search..." at every width (RULED, follow-up 1).
export const kitGlobalSearchPlaceholder = "Search...";

export const kitGlobalSearchDefaultFixture = Object.freeze({
  own: readyOwn,
  community: readyCommunity,
  placeholder: kitGlobalSearchPlaceholder,
  initialValue: "lilith",
});

// The no-results copy is exactly this (RULED, browser review round 2).
export const kitGlobalSearchEmptyCopy = "Nothing matches yet.";

export const kitGlobalSearchEmptyFixture = Object.freeze({
  own: Object.freeze({ items: [], status: "ready", errorMessage: "" }),
  community: Object.freeze({ items: [], status: "ready", errorMessage: "" }),
  copy: Object.freeze({ empty: kitGlobalSearchEmptyCopy }),
  initialValue: "nothing here",
});

// An empty field opens no panel at any width (RULED, browser review
// round 2); this fixture renders the field alone.
export const kitGlobalSearchClosedFixture = Object.freeze({
  own: readyOwn,
  community: readyCommunity,
  initialValue: "",
});

export const kitGlobalSearchLoadingFixture = Object.freeze({
  own: Object.freeze({ items: [], status: "loading", errorMessage: "" }),
  community: Object.freeze({ items: [], status: "loading", errorMessage: "" }),
  initialValue: "lilith",
});

export const kitGlobalSearchErrorFixture = Object.freeze({
  own: readyOwn,
  community: Object.freeze({
    items: [],
    status: "error",
    errorMessage: "Search could not load. Try again in a moment.",
  }),
  initialValue: "lilith",
});

export const kitGlobalSearchSoonFixture = Object.freeze({
  own: readyOwn,
  community: Object.freeze({ items: [], status: "soon", errorMessage: "" }),
  initialValue: "lilith",
});

export const kitGlobalSearchScopedFixture = Object.freeze({
  own: readyOwn,
  community: readyCommunity,
  initialValue: "my lilith",
});

export const kitGlobalSearchPrefixedFixture = Object.freeze({
  own: readyOwn,
  community: readyCommunity,
  initialValue: "character: lilith",
});

export const kitGlobalSearchSuggestionsFixture = Object.freeze({
  own: readyOwn,
  community: readyCommunity,
  initialValue: ":",
});

export const kitGlobalSearchLongestFixture = Object.freeze({
  own: Object.freeze({
    items: [
      item({
        key: "own-longest",
        scope: "own",
        type: "adventure",
        title:
          "The Hollow Court and the long winter of the seven aqueducts, a season in eleven parts with an epilogue",
        subtitle: "Internal, shared by link with the whole writing circle",
        typeLabel: "Adventure",
        pageLabel: "Editor",
        href: "/studio/v2/editor/cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      }),
    ],
    status: "ready",
    errorMessage: "",
  }),
  community: readyCommunity,
  initialValue: "the",
});
