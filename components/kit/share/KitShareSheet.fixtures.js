const noop = () => {};

const BASE = {
  kind: "character",
  hasCard: true,
  cardImageSrc: "/assets/branding/crestfall-og-v2.png",
  previewImageSrc: "/assets/covers/crestfall-camellia-cover.png",
  previewImageLargeSrc: "",
  title: "Kessa Cindervell",
  byline: "by @crestfall",
  shareUrl: "https://crestfall-studio.com/c/creation-1/kessa-cindervell?ref=brian",
  status: "idle",
  statusMessage: "",
  blockedMessage: null,
  reviewState: "idle",
  onCopyLink: noop,
  onSubmitForReview: noop,
  onClose: noop,
};

const BLOCKED = {
  ...BASE,
  cardImageSrc: null,
  shareUrl: "",
  blockedMessage: "This creation can only be shared once it is public.",
};

export const kitShareSheetFixtures = [
  { id: "playable", label: "Playable character, desktop", props: { ...BASE } },
  {
    id: "image",
    label: "Shared image, no card",
    props: {
      ...BASE,
      kind: "image",
      hasCard: false,
      cardImageSrc: null,
      previewImageSrc: "/assets/covers/crestfall-camellia-cover.png",
      previewImageLargeSrc: "/assets/covers/crestfall-camellia-cover.png",
      title: "Kessa at the appraisal counter",
      shareUrl: "https://crestfall-studio.com/studio/creations/creation-1?image=output-9&ref=brian",
    },
  },
  {
    id: "profile",
    label: "Creator profile, plain link",
    props: {
      ...BASE,
      kind: "profile",
      hasCard: false,
      cardImageSrc: null,
      title: "Crestfall",
      byline: "@crestfall",
      shareUrl: "https://crestfall-studio.com/studio/profile/crestfall?ref=brian",
    },
  },
  {
    id: "link",
    label: "Non-playable creation, plain link",
    props: {
      ...BASE,
      kind: "link",
      hasCard: false,
      cardImageSrc: null,
      title: "Brasswhisker Workshop",
      shareUrl: "https://crestfall-studio.com/studio/creations/creation-3?ref=brian",
    },
  },
  { id: "blocked", label: "Private creation, blocked", props: { ...BLOCKED } },
  {
    id: "blocked-internal",
    label: "Internal creation, blocked (sharing is public only)",
    props: { ...BLOCKED, title: "Corwin Bex" },
  },
  {
    id: "blocked-submitting",
    label: "Blocked, review submission in flight",
    props: { ...BLOCKED, reviewState: "submitting" },
  },
  {
    id: "blocked-submitted",
    label: "Blocked, submitted for review",
    props: { ...BLOCKED, reviewState: "submitted" },
  },
  {
    id: "blocked-error",
    label: "Blocked, review submission failed",
    props: { ...BLOCKED, reviewState: "error" },
  },
  { id: "copied", label: "Link copied", props: { ...BASE, status: "copied", statusMessage: "Link copied" } },
  { id: "error", label: "Share unavailable", props: { ...BASE, status: "error", statusMessage: "Share unavailable." } },
  {
    id: "no-image",
    label: "No preview image",
    props: { ...BASE, kind: "link", hasCard: false, cardImageSrc: null, previewImageSrc: "" },
  },
  {
    id: "longest",
    label: "Longest title and link",
    props: {
      ...BASE,
      title: "The Long Vigil of Kessa Cindervell and the Brasswhisker Appraisal Counter of Aethelgard",
      shareUrl:
        "https://crestfall-studio.com/c/0f1c6c1e-4a1b-4c1e-9f0d-2a6c8b3e5d77/the-long-vigil-of-kessa-cindervell-and-the-brasswhisker?ref=crestfallen_creator",
    },
  },
];

export default kitShareSheetFixtures;
