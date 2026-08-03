export const GAMES_HUB_VIEW_CONTRACT_VERSION = "games-hub.view.v1";

/**
 * @typedef {Object} GamesHubGameViewItem
 * @property {string} id
 * @property {string|null} templateId
 * @property {string} title
 * @property {string} subtitle
 * @property {string} description
 * @property {string} badge
 * @property {"NEW"|"CONTINUE"|string} playState
 * @property {string|null} continueRoomId
 * @property {string} canonRelationship
 * @property {string} contentRating
 * @property {boolean} featured
 * @property {string} scenario
 * @property {string} narrator
 * @property {string[]} cast
 * @property {string} lastActive
 * @property {number} messages
 */

/**
 * @typedef {Object} GamesHubViewProps
 * @property {boolean} mobileToolsOpen
 * @property {string} activeFilter
 * @property {string} query
 * @property {"grid"|"list"} viewMode
 * @property {string|null} startingGameId
 * @property {string} playError
 * @property {boolean} loading
 * @property {string} loadError
 * @property {Array<{id: string, label: string}>} filters
 * @property {GamesHubGameViewItem[]} filteredGames
 * @property {GamesHubGameViewItem[]} continueGames
 * @property {GamesHubGameViewItem[]} featuredGames
 * @property {Function|null} onToggleMobileTools
 * @property {Function|null} onQueryChange
 * @property {Function|null} onActiveFilterChange
 * @property {Function|null} onViewModeChange
 * @property {Function|null} onGameAction
 * @property {import("react").ElementType} ViewModeToggleComponent
 */

export const GAMES_HUB_PORTABILITY_RULES = Object.freeze({
  ownsGameLoadingAndPlayOrchestration: "ViewModel",
  ownsFilteringAndNormalization: "ViewModel",
  ownsPersistentViewMode: "ViewModel",
  ownsApplicationViewModeControl: "Binding Shell",
  ownsPortableMarkup: "Portable View",
});
