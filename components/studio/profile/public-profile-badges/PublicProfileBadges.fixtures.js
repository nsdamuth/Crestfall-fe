const SAMPLE_BADGE_IMAGE = "/images/badges/founder.webp";

export const PUBLIC_PROFILE_BADGES_FIXTURES = Object.freeze([
  {
    id: "text-badges",
    label: "Text badges",
    props: {
      badges: [
        {
          id: "badge-owner",
          slug: "owner",
          label: "Crestfall Owner",
          description: "Recognizes the owner of Crestfall.",
          category: "STAFF",
          sortOrder: 10,
        },
        {
          id: "badge-og",
          slug: "og",
          label: "OG",
          description:
            "Recognizes a member of the Crestfall community from before public alpha.",
          category: "EARLY_ACCESS",
          sortOrder: 30,
        },
        {
          id: "badge-alpha",
          slug: "alpha-tester",
          label: "Alpha Tester",
          description: "Recognizes participation in Crestfall alpha testing.",
          category: "EARLY_ACCESS",
          sortOrder: 40,
        },
        {
          id: "badge-canon",
          slug: "canon-contributor",
          label: "Canon Contributor",
          description:
            "Recognizes a contribution accepted into Crestfall canon.",
          category: "CONTRIBUTION",
          sortOrder: 70,
        },
      ],
    },
  },
  {
    id: "future-image-badge",
    label: "Production image badge",
    props: {
      badges: [
        {
          id: "badge-founder-image",
          slug: "founder",
          label: "Crestfall Founder",
          description:
            "Fixture using the production Founder badge asset without changing the assignment contract.",
          category: "STAFF",
          imageUrl: SAMPLE_BADGE_IMAGE,
          sortOrder: 20,
        },
      ],
    },
  },
  {
    id: "empty",
    label: "No badges",
    props: {
      badges: [],
    },
  },
]);

export function getPublicProfileBadgesFixture(fixtureId) {
  return (
    PUBLIC_PROFILE_BADGES_FIXTURES.find(
      (fixture) => fixture.id === fixtureId
    ) || PUBLIC_PROFILE_BADGES_FIXTURES[0]
  );
}
