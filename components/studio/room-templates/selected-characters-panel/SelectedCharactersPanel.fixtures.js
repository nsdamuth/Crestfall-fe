const noop = () => {};

const baseFixture = Object.freeze({
  characters: [],
  onOpenCharacterPicker: noop,
  onRemoveCharacter: noop,
});

export const selectedCharactersEmptyFixture = Object.freeze({
  ...baseFixture,
});

export const selectedCharactersSingleFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-mara-voss",
      title: "Mara Voss",
      subtitle: "Reluctant archivist and field investigator",
      initial: "M",
    },
  ],
});

export const selectedCharactersMultipleFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-mara-voss",
      title: "Mara Voss",
      subtitle: "Reluctant archivist and field investigator",
      initial: "M",
    },
    {
      id: "character-elian-rook",
      title: "Captain Elian Rook",
      subtitle: "Disgraced officer with unfinished obligations",
      initial: "C",
    },
    {
      id: "character-archivist-sen",
      title: "Archivist Sen",
      subtitle: "Keeper of restricted civic records",
      initial: "A",
    },
  ],
});

export const selectedCharactersNoSubtitleFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-unnamed-witness",
      title: "The Unnamed Witness",
      subtitle: "",
      initial: "T",
    },
  ],
});

export const selectedCharactersLongContentFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-seraphine-valecourt",
      title: "Lady Seraphine Valecourt, Keeper of the Ninth Observatory",
      subtitle:
        "Senior celestial cartographer assigned to monitor impossible constellations above the western frontier",
      initial: "L",
    },
    {
      id: "character-orren-tal",
      title: "Commander Orren Tal, Acting Warden of the Western Causeway",
      subtitle:
        "Temporary military governor, reluctant diplomat, and custodian of a road that refuses to remain in one place",
      initial: "C",
    },
    {
      id: "character-glass-courier",
      title: "The Glass Courier",
      subtitle:
        "An unidentified messenger carrying a sealed archive through districts that officially no longer exist",
      initial: "T",
    },
  ],
});
