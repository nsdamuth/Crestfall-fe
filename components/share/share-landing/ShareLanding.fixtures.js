const BASE = {
  kindLabel: "Character",
  isCanon: true,
  title: "Lilith of Nod",
  byline: "by @crestfall",
  creatorHref: "/studio/profile/crestfall",
  excerpt:
    "A Bastet artificer whose workshop is equal parts appraisal counter, den, vault, and dangerous mechanical argument.",
  imageSrc: "/assets/covers/crestfall-camellia-cover.png",
  actionLabel: "Play Free on Crestfall Studio",
  actionHref: "/login?next=%2Fc%2Fcreation-1%2Flilith-of-nod%3Fref%3Dbrian&ref=brian",
  errorMessage: "",
};

export const shareLandingFixtures = [
  { id: "signed-out", label: "Signed out, Play Free on Crestfall Studio", props: { ...BASE } },
  {
    id: "signed-in",
    label: "Signed in, Play",
    props: { ...BASE, actionLabel: "Play", actionHref: "/studio/creations/creation-1" },
  },
  {
    id: "story",
    label: "Story, no excerpt",
    props: { ...BASE, kindLabel: "Story", isCanon: false, title: "The Brasswhisker's Workshop", excerpt: "" },
  },
  { id: "no-image", label: "No featured image", props: { ...BASE, imageSrc: "" } },
  {
    id: "longest",
    label: "Longest title",
    props: {
      ...BASE,
      title: "The Long Vigil of Kessa Cindervell and the Brasswhisker Appraisal Counter of Aethelgard",
    },
  },
  {
    id: "error",
    label: "Load error",
    props: { ...BASE, errorMessage: "Creation catalogue could not be loaded." },
  },
];

export default shareLandingFixtures;
