export const studioComingSoonDefaultFixture = {
  eyebrow: "In Development",
  title: "What this section will support",
  children:
    "This page is prepared as part of the Studio shell. Backend behavior will be connected later.",
  items: ["Feature one", "Feature two", "Feature three"],
};

export const studioComingSoonNoItemsFixture = {
  eyebrow: "In Development",
  title: "A focused future feature",
  children:
    "This state verifies that supporting copy remains balanced when no roadmap items are supplied.",
  items: [],
};

export const studioComingSoonNoBodyFixture = {
  eyebrow: "Planned",
  title: "Roadmap items only",
  children: null,
  items: ["Creator review queue", "Continuity validation", "Submission history"],
};

export const studioComingSoonNoEyebrowFixture = {
  eyebrow: "",
  title: "Placeholder without an eyebrow",
  children:
    "The title, supporting copy, and roadmap grid remain aligned when the optional section label is omitted.",
  items: ["First capability", "Second capability"],
};

export const studioComingSoonSingleItemFixture = {
  eyebrow: "In Development",
  title: "Single planned capability",
  children:
    "A one-item roadmap should retain the existing responsive grid without requiring filler cards.",
  items: ["One carefully bounded future workflow"],
};

export const studioComingSoonLongContentFixture = {
  eyebrow: "A Deliberately Long Development Status Label",
  title:
    "A Deliberately Long Placeholder Title That Must Wrap Without Breaking the Studio Surface",
  children:
    "This extended supporting paragraph verifies readable line height, maximum content width, natural card growth, and responsive wrapping when a future Studio section needs substantially more explanation than the current Storylines and Submit to Canon placeholders.",
  items: [
    "A long roadmap item describing creator submission intake, validation, and review-state communication",
    "A second long item describing continuity checks, curator feedback, and revision workflows",
    "A third long item describing publication, attribution, and Chronicle integration after approval",
    "A fourth item that forces the grid onto another responsive row",
  ],
};
