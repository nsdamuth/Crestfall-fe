// Stand-in feed for the Creators profile-detail page, same precedent
// as Lore's loreContent.mock.js (CR-015 lineage) and Home's
// homeContent.mock.js (CR-029): a deterministic fixture record per
// handle, no fetch, no services-api. Handles here intentionally match
// a subset of CreatorsV2Mockup.jsx's FIXTURE_CREATORS (vermillion,
// whiteviolin, nightloom, moonglass) so a hub-to-detail navigation in
// the fixture-driven preview resolves to a record that reads like the
// same creator, not a coincidence of matching IDs.

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function work(id, title, subtitle, imageSrc, { plays = 0, likes = 0, badges = [] } = {}) {
  return {
    id,
    title,
    subtitle,
    imageSrc,
    badges,
    stats: { plays, likes },
  };
}

function badge(id, label, description) {
  return { id, label, description, imageSrc: null, awardedAt: "2026-07-01" };
}

function activityEvent(id, kind, label, timestamp) {
  return { id, kind, label, timestamp };
}

export const CREATOR_PROFILES = {
  vermillion: {
    handle: "vermillion",
    displayName: "Vermillion",
    avatarSrc: creatorArt("vermillion"),
    bio: "World-building at the edge of Aethelgard. I write the quiet moments between battles.",
    stats: { followers: 4820, following: 128, plays: 21400, works: 25 },
    isFollowing: false,
    isMuted: false,
    isLiked: false,
    isBookmarked: false,
    works: [
      work("cr1-w1", "The Sundered Choir", "Character", creatorArt("vermillion-2"), { plays: 6200, likes: 940 }),
      work("cr1-w2", "Aethelgard at Dusk", "Location", creatorArt("vermillion-3"), { plays: 3100, likes: 410 }),
      work("cr1-w3", "The Long Watch", "Adventure", creatorArt("vermillion-8"), { plays: 5800, likes: 720, badges: [{ label: "Canon", variant: "canon" }] }),
      work("cr1-w4", "Kaela's Return", "Story", creatorArt("vermillion-9"), { plays: 2400, likes: 300 }),
      work("cr1-w5", "The Amber Quarter", "Location", creatorArt("vermillion-10"), { plays: 1900, likes: 210 }),
    ],
    badges: [
      badge("b1", "Founding Creator", "Joined during the alpha test."),
      badge("b2", "Canon Contributor", "Had a creation accepted into canon."),
      badge("b3", "World Builder", "Published five or more locations."),
    ],
    activity: [
      activityEvent("a1", "creation", "Published \"The Long Watch\"", "3 days ago"),
      activityEvent("a2", "donation", "Received a donation from @whiteviolin", "6 days ago"),
      activityEvent("a3", "creation", "Published \"Kaela's Return\"", "2 weeks ago"),
    ],
  },
  whiteviolin: {
    handle: "whiteviolin",
    displayName: "White Violin",
    avatarSrc: creatorArt("whiteviolin"),
    bio: "Character sheets and mechanics tuning. If it has stats, I probably built it.",
    stats: { followers: 3110, following: 64, plays: 9800, works: 12 },
    isFollowing: true,
    isMuted: false,
    isLiked: true,
    isBookmarked: false,
    works: [
      work("cr2-w1", "Selena Velvet", "Character", creatorArt("whiteviolin-2"), { plays: 2800, likes: 390 }),
    ],
    badges: [badge("b1", "Founding Creator", "Joined during the alpha test.")],
    activity: [activityEvent("a1", "creation", "Published \"Selena Velvet\"", "1 week ago")],
  },
  nightloom: {
    handle: "nightloom",
    displayName: "Nightloom",
    avatarSrc: null,
    bio: "No public bio yet.",
    stats: { followers: 5600, following: 210, plays: 15200, works: 18 },
    isFollowing: false,
    isMuted: false,
    isLiked: false,
    isBookmarked: true,
    works: [
      work("cr6-w1", "Driftwood Hollow", "Location", creatorArt("vermillion-12"), { plays: 4100, likes: 560 }),
      work("cr6-w2", "The Ravenwatch Pact", "Adventure", creatorArt("vermillion-13"), { plays: 3900, likes: 480 }),
      work("cr6-w3", "Lanterngate", "Location", creatorArt("vermillion-14"), { plays: 1200, likes: 140 }),
    ],
    badges: [],
    activity: [],
  },
  moonglass: {
    handle: "moonglass",
    displayName: "Moonglass",
    avatarSrc: null,
    bio: "Occasional world-builder. Mostly here to read.",
    stats: { followers: 410, following: 12, plays: 640, works: 2 },
    isFollowing: false,
    isMuted: true,
    isLiked: false,
    isBookmarked: false,
    works: [work("cr12-w1", "The Moonglass Shore", "Location", creatorArt("vermillion-25"), { plays: 640, likes: 80 })],
    badges: [],
    activity: [activityEvent("a1", "creation", "Published \"The Moonglass Shore\"", "1 month ago")],
  },
};

export const CREATOR_PROFILE_DEFAULT_HANDLE = "vermillion";

export function resolveCreatorProfile(handle = "") {
  const key = String(handle || "").replace(/^@/, "").toLowerCase();
  return CREATOR_PROFILES[key] || null;
}

export const CREATOR_PROFILE_LONGEST = {
  handle: "cinderfall",
  displayName: "Cinderfall, the Last Ember of the Sundered Choir",
  avatarSrc: creatorArt("vermillion-21"),
  bio: "World-building at the edge of Aethelgard, chronicling the fall of the Sundered Choir one verse at a time. I write the quiet moments between battles, the arguments after the treaty, and the creatures nobody else thinks to name. Commissions open, slowly.",
  stats: { followers: 6700, following: 340, plays: 24800, works: 30 },
  isFollowing: true,
  isMuted: false,
  isLiked: true,
  isBookmarked: true,
  works: [
    work("cf-w1", "The Sundered Choir, Complete", "Adventure", creatorArt("vermillion-22"), { plays: 9200, likes: 1400, badges: [{ label: "Canon", variant: "canon" }] }),
    work("cf-w2", "The Amber Quarter at War", "Location", creatorArt("vermillion-24"), { plays: 5100, likes: 780 }),
    work("cf-w3", "Kaela Veynskald", "Character", canonArt("Kaela Veynskald"), { plays: 4300, likes: 610 }),
    work("cf-w4", "Selena Velvet, Unmasked", "Character", canonArt("Selena Velvet"), { plays: 3900, likes: 540 }),
    work("cf-w5", "Dr. Elara Kade's Ledger", "Story", canonArt("Dr. Elara Kade"), { plays: 2200, likes: 260 }),
    work("cf-w6", "The Long Watch, Part Two", "Adventure", creatorArt("vermillion-4"), { plays: 1800, likes: 190 }),
  ],
  badges: [
    badge("b1", "Founding Creator", "Joined during the alpha test."),
    badge("b2", "Canon Contributor", "Had a creation accepted into canon."),
    badge("b3", "World Builder", "Published five or more locations."),
    badge("b4", "Community Favorite", "Reached one thousand hearts across all creations."),
  ],
  activity: [
    activityEvent("la1", "creation", "Published \"The Sundered Choir, Complete\"", "1 day ago"),
    activityEvent("la2", "donation", "Received a donation from @whiteviolin", "2 days ago"),
    activityEvent("la3", "donation", "Received a donation from @yagirltee", "4 days ago"),
    activityEvent("la4", "creation", "Published \"The Amber Quarter at War\"", "1 week ago"),
    activityEvent("la5", "creation", "Published \"Kaela Veynskald\"", "2 weeks ago"),
  ],
};
