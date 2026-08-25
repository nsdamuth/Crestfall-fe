// CR-023 stand-in feed (docs/SPRINT-G-PLAN.md section 3): the public
// Adventure catalog. Content reuses the existing creation-card fixture
// art and copy conventions rather than inventing new draft assets, the
// same precedent Home's homeContent.mock.js follows for CR-029.
import { getCreationTypeDisplayName } from "@/lib/shared/presentation/terminology";

const ADVENTURE_KIND_LABEL = getCreationTypeDisplayName("STORYLINE");

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

export const ADVENTURES_SORT_OPTIONS = [
  { value: "top-rated", label: "Top rated" },
  { value: "recently-added", label: "Recently added" },
  { value: "most-played", label: "Most played" },
];

export const ADVENTURES_CATALOG_ITEMS = [
  {
    id: "adventure-1",
    cardKind: "creation",
    assetKind: "adventure",
    title: "Neon Harbor Cycle",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @whiteviolin`,
    imageSrc: creatorArt("whiteviolin"),
    badges: [{ label: "Canon", variant: "canon" }],
    stats: { plays: 1284, hearts: 302, saves: 88, followers: null },
  },
  {
    id: "adventure-2",
    cardKind: "creation",
    assetKind: "adventure",
    title: "The Hollow Road",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @vermillion`,
    imageSrc: creatorArt("vermillion-13"),
    badges: [],
    stats: { plays: 940, hearts: 211, saves: 54, followers: null },
  },
  {
    id: "adventure-3",
    cardKind: "creation",
    assetKind: "adventure",
    title: "Crown of Ash and Starlight",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @Crestfall`,
    imageSrc: canonArt("Lilith"),
    badges: [{ label: "Canon", variant: "canon" }],
    stats: { plays: 2110, hearts: 588, saves: 201, followers: null },
  },
  {
    id: "adventure-4",
    cardKind: "creation",
    assetKind: "adventure",
    title: "Vermillion Coast Season One",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @vermillion`,
    imageSrc: creatorArt("vermillion-3"),
    badges: [],
    stats: { plays: 655, hearts: 140, saves: 33, followers: null },
  },
  {
    id: "adventure-5",
    cardKind: "creation",
    assetKind: "adventure",
    title: "The Seer's Last Chronicle",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @Crestfall`,
    imageSrc: canonArt("The Seer"),
    badges: [{ label: "Canon", variant: "canon" }],
    stats: { plays: 1502, hearts: 402, saves: 119, followers: null },
  },
  {
    id: "adventure-6",
    cardKind: "creation",
    assetKind: "adventure",
    title: "Rachel Sentry and the Broken Line",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @rev`,
    imageSrc: creatorArt("rev"),
    badges: [],
    stats: { plays: 322, hearts: 74, saves: 20, followers: null },
  },
  {
    id: "adventure-7",
    cardKind: "creation",
    assetKind: "adventure",
    title: "Djuna's Quiet War",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @sassy`,
    imageSrc: creatorArt("sassy"),
    badges: [],
    stats: { plays: 210, hearts: 45, saves: 12, followers: null },
  },
  {
    id: "adventure-8",
    cardKind: "creation",
    assetKind: "adventure",
    title: "Kaela Veynskald, Between Two Suns",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @yagirltee`,
    imageSrc: creatorArt("yagirltee"),
    badges: [],
    stats: { plays: 178, hearts: 39, saves: 9, followers: null },
  },
  {
    id: "adventure-9",
    cardKind: "creation",
    assetKind: "adventure",
    title: "Alyera Valecourt and the Ninefold Gate, a Chronicle in Three Parts",
    subtitle: `${ADVENTURE_KIND_LABEL} · by @whiteviolin, a very long supporting line that must still truncate cleanly`,
    imageSrc: canonArt("Alyera Valecourt"),
    badges: [{ label: "Canon", variant: "canon" }],
    stats: { plays: 88, hearts: 16, saves: 4, followers: null },
  },
];
