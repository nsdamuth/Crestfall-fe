import { loreDocumentFixture } from "../lore-editor/LoreEditor.fixtures";

export const loreDocumentRendererFixture = {
  document: loreDocumentFixture,
  title: "The Brass Athenaeum",
  description:
    "A sourcebook-style fixture used to validate the portable Lore renderer.",
  creator: {
    displayName: "Crestfall Archivist",
  },
  showTestBanner: true,
  testBannerText:
    "Fixture-only reader preview. No mutable draft is being exposed publicly.",
  compact: false,
  publicHref: "/studio/creations/fixture-lore",
};

export const loreDocumentRendererCompactFixture = {
  ...loreDocumentRendererFixture,
  compact: true,
  publicHref: "",
};
