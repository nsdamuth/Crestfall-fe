const noop = () => {};

const avatarDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23201b16'/%3E%3Ccircle cx='48' cy='38' r='18' fill='%23b99a61'/%3E%3Cpath d='M18 92c4-23 17-34 30-34s26 11 30 34' fill='%23b99a61'/%3E%3C/svg%3E";

const baseFixture = Object.freeze({
  invitedPlayers: Object.freeze([]),
  loadError: "",
  onOpenPlayerPicker: noop,
  onRemovePlayer: noop,
});

export const invitedPlayersEmptyFixture = Object.freeze({
  ...baseFixture,
});

export const invitedPlayersSingleFixture = Object.freeze({
  ...baseFixture,
  invitedPlayers: Object.freeze([
    Object.freeze({
      id: "player-mara",
      username: "mara_voss",
      avatarUrl: null,
      displayInitial: "M",
    }),
  ]),
});

export const invitedPlayersSeveralFixture = Object.freeze({
  ...baseFixture,
  invitedPlayers: Object.freeze([
    Object.freeze({
      id: "player-mara",
      username: "mara_voss",
      avatarUrl: null,
      displayInitial: "M",
    }),
    Object.freeze({
      id: "player-archive",
      username: "archive_keeper",
      avatarUrl: avatarDataUrl,
      displayInitial: "A",
    }),
    Object.freeze({
      id: "player-rook",
      username: "captain_rook",
      avatarUrl: null,
      displayInitial: "C",
    }),
  ]),
});

export const invitedPlayersLoadErrorFixture = Object.freeze({
  ...baseFixture,
  loadError: "Mutual followers could not be loaded. Try again before adding a player.",
});

export const invitedPlayersLongNamesFixture = Object.freeze({
  ...baseFixture,
  invitedPlayers: Object.freeze([
    Object.freeze({
      id: "player-long-one",
      username: "the_cartographer_beyond_the_western_gate",
      avatarUrl: null,
      displayInitial: "T",
    }),
    Object.freeze({
      id: "player-long-two",
      username: "keeper_of_the_unfinished_constellation",
      avatarUrl: null,
      displayInitial: "K",
    }),
  ]),
});
