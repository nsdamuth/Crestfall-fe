const noop = () => {};

const BASE = {
  kind: "character",
  hasCard: true,
  cardImageSrc: "/assets/branding/crestfall-og-v2.png",
  previewImageSrc: "/assets/covers/crestfall-camellia-cover.png",
  title: "Kessa Cindervell",
  byline: "by @crestfall",
  shareUrl: "https://crestfall-studio.com/c/creation-1/kessa-cindervell?ref=brian",
  canNativeShare: false,
  status: "idle",
  statusMessage: "",
  blockedMessage: null,
  note: null,
  onCopyLink: noop,
  onNativeShare: noop,
  onClose: noop,
};

export const kitShareSheetFixtures = [
  { id: "playable", label: "Playable character, desktop", props: { ...BASE } },
  {
    id: "playable-native",
    label: "Playable story with the native share action",
    props: {
      ...BASE,
      kind: "story",
      title: "The Brasswhisker's Workshop",
      shareUrl: "https://crestfall-studio.com/story/creation-2/the-brasswhiskers-workshop?ref=brian",
      canNativeShare: true,
    },
  },
  {
    id: "image",
    label: "Shared image, no card",
    props: {
      ...BASE,
      kind: "image",
      hasCard: false,
      cardImageSrc: null,
      title: "Kessa at the appraisal counter",
      shareUrl: "https://crestfall-studio.com/studio/creations/creation-1?image=output-9&ref=brian",
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
  {
    id: "internal",
    label: "Internal creation, link with the note",
    props: {
      ...BASE,
      cardImageSrc: null,
      note: "Recipients must sign in to Crestfall; this creation will not appear in search or public discovery.",
    },
  },
  {
    id: "blocked",
    label: "Private creation, blocked",
    props: {
      ...BASE,
      cardImageSrc: null,
      shareUrl: "",
      blockedMessage:
        "Private creations are owner-only. Change visibility to Internal or Public before sharing a link.",
    },
  },
  { id: "copied", label: "Link copied", props: { ...BASE, status: "copied", statusMessage: "Link copied." } },
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
