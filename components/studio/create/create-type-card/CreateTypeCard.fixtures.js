export const createTypeCardCharacterFixture = {
  title: "Character",
  description:
    "Build a reusable character with identity, appearance, personality, voice, media, and story guidance.",
  href: "#preview-character",
  image: "/assets/covers/banner.png",
  eyebrow: "Character & Visual Asset",
  disabled: false,
};

export const createTypeCardRegistryFixture = {
  title: "Location Registry",
  description:
    "Define reusable places, parent relationships, connections, ownership, and continuity details for stories and rooms.",
  href: "#preview-location-registry",
  image: "",
  eyebrow: "Continuity Registry",
  disabled: false,
};

export const createTypeCardDisabledFixture = {
  title: "Future Creation Type",
  description:
    "This fixture preserves the existing non-interactive Coming Soon presentation for creation types that are not available yet.",
  href: "#preview-disabled",
  image: "/assets/covers/banner.png",
  eyebrow: "Planned Asset",
  disabled: true,
};

export const createTypeCardNoImageFixture = {
  title: "Narrator",
  description:
    "Create a reusable narrator voice and presentation profile without relying on a card background image.",
  href: "#preview-narrator",
  image: "",
  eyebrow: "Story & Runtime Asset",
  disabled: false,
};

export const createTypeCardNoEyebrowFixture = {
  title: "Image Preset",
  description:
    "Build a reusable image-generation preset while verifying the card layout without an eyebrow label.",
  href: "#preview-image-preset",
  image: "/assets/covers/banner.png",
  eyebrow: "",
  disabled: false,
};

export const createTypeCardLongContentFixture = {
  title:
    "A Deliberately Long Creation Type Title That Must Wrap Without Breaking the Card",
  description:
    "This longer description verifies that the portable creation-type card preserves readable line height, background-image treatment, card growth, responsive wrapping, and the creation action position when supplied with substantially more text than the normal Studio Create entries.",
  href: "#preview-long-content",
  image: "/assets/covers/banner.png",
  eyebrow:
    "A Deliberately Long Creation Category Label for Responsive Stress Testing",
  disabled: false,
};
