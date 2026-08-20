const noop = () => {};

const baseFixture = Object.freeze({
  characters: [],
  lifecycleOptions: Object.freeze([
    Object.freeze({
      value: "STORY_PINNED",
      label: "Persistent Story Cast",
      description: "Remain attached to the Story after the opening sequence.",
    }),
    Object.freeze({
      value: "OPENING_ONLY",
      label: "Opening Only",
      description: "Participate in the authored opening, then release from the active cast.",
    }),
  ]),
  onOpenCharacterPicker: noop,
  onRemoveCharacter: noop,
  onChangeCharacterLifecycle: noop,
});

export const selectedCharactersEditEmptyFixture = Object.freeze({
  ...baseFixture,
});

export const selectedCharactersEditSingleFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-iris-vale",
      title: "Iris Vale",
      subtitle: "Cartographer of abandoned roads",
      initial: "I",
      lifecycleKind: "STORY_PINNED",
    },
  ],
});

export const selectedCharactersEditMultipleFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-iris-vale",
      title: "Iris Vale",
      subtitle: "Cartographer of abandoned roads",
      initial: "I",
      lifecycleKind: "STORY_PINNED",
    },
    {
      id: "character-dorian-ash",
      title: "Dorian Ash",
      subtitle: "Former magistrate and reluctant witness",
      initial: "D",
      lifecycleKind: "OPENING_ONLY",
    },
    {
      id: "character-nessa-morne",
      title: "Nessa Morne",
      subtitle: "Keeper of the western signal tower",
      initial: "N",
      lifecycleKind: "STORY_PINNED",
    },
  ],
});

export const selectedCharactersEditNoSubtitleFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-silent-guide",
      title: "The Silent Guide",
      subtitle: "",
      initial: "T",
      lifecycleKind: "STORY_PINNED",
    },
  ],
});

export const selectedCharactersEditLongContentFixture = Object.freeze({
  ...baseFixture,
  characters: [
    {
      id: "character-amelia-thorn",
      title: "Professor Amelia Thorn, Interim Curator of the Uncatalogued Wing",
      subtitle:
        "A meticulous historian charged with preserving records that rewrite themselves whenever the archive doors close",
      initial: "P",
      lifecycleKind: "STORY_PINNED",
    },
    {
      id: "character-cassian-rell",
      title: "Captain Cassian Rell of the Last Northbound Expedition",
      subtitle:
        "An exhausted explorer whose official route ended three provinces before the place from which he returned",
      initial: "C",
      lifecycleKind: "OPENING_ONLY",
    },
    {
      id: "character-red-lantern",
      title: "The Bearer of the Red Lantern",
      subtitle:
        "An unidentified traveler who appears at every crossing shortly before the road changes its destination",
      initial: "T",
      lifecycleKind: "STORY_PINNED",
    },
  ],
});
