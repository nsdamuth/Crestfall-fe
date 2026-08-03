const previewImage = "/assets/covers/banner.png";

export const studioCharacterCardDefaultFixture = {
  imageSrc: previewImage,
  imageAlt: "Seraphine Vale",
  title: "Seraphine Vale",
  eyebrow: "The Ashen Court",
  description:
    "A canon diplomat whose promises bind kingdoms long after their witnesses are gone.",
  detailsHref: "#studio-character-card-preview",
};

export const studioCharacterCardNoImageFixture = {
  ...studioCharacterCardDefaultFixture,
  imageSrc: "",
  imageAlt: "",
  title: "The Nameless Pilgrim",
  eyebrow: "Wanderer of the Hollow Roads",
};

export const studioCharacterCardNoEyebrowFixture = {
  ...studioCharacterCardDefaultFixture,
  title: "Marek Thorn",
  eyebrow: "",
  description:
    "An official Crestfall character shown without an optional eyebrow line.",
};

export const studioCharacterCardFallbackCopyFixture = {
  ...studioCharacterCardDefaultFixture,
  title: "The Quiet Witness",
  eyebrow: "Chronicle Observer",
  description: "Official Crestfall character.",
};

export const studioCharacterCardLongContentFixture = {
  ...studioCharacterCardDefaultFixture,
  imageAlt:
    "The Cartographer of the Ninth Lantern and Keeper of Unfinished Roads",
  title: "The Cartographer of the Ninth Lantern and Keeper of Unfinished Roads",
  eyebrow:
    "Royal Surveyor of the Unmapped Kingdoms Beyond the Last Remembered Gate",
  description:
    "A deliberately long official-character description used to verify line clamping, title wrapping, optional eyebrow growth, action alignment, and responsive card behavior inside the portable View.",
};
