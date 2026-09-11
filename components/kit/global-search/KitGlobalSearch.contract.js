export const KIT_GLOBAL_SEARCH_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the top bar global search
 * (FE/GLOBAL-SEARCH session 1, RULED at the 10 Sep 2026 plan gate,
 * docs/references/global-search/NOTES.md). One field searches
 * everything; results open in a panel directly below the field as
 * the user types, in two sections (the user's own items first, then
 * community), each row reading icon, title, then type and page.
 *
 * Boundary: the View renders; the ViewModel owns the typed value,
 * open state, the active row, the query grammar, the keyboard, and
 * outside-click dismissal. The panel shows only once the field has
 * text: an empty field opens nothing at any width, and no shortcut
 * opens the search (browser review round 2, 10 Sep 2026, R1 and R2;
 * the rule is shouldShowGlobalSearchPanel in kitGlobalSearchQuery.js).
 * The panel carries no instruction text: no helper block, no keyboard
 * footer; the no-results copy is exactly "Nothing matches yet.", the
 * error and loading copy stay, the colon prefix suggestions stay.
 * Data arrives already
 * fetched from the caller (the top bar adapter) as two source groups;
 * the View never fetches and never navigates on its own (choosing a
 * row calls back with the row's href).
 *
 * Source group shape (`own`, `community`):
 *   { items: GlobalSearchItem[], status: "idle"|"loading"|"ready"|"error"|"soon", errorMessage: string }
 *   "soon" is the honest treatment for a section no route can serve:
 *   the section renders disabled with the Soon chip and the title
 *   "Not available yet".
 *
 * GlobalSearchItem (normalized by the caller):
 *   { key, scope: "own"|"community", type: a kitGlobalSearchQuery type key,
 *     title, subtitle, searchText, imageSrc, iconKey, href, pageLabel,
 *     typeLabel, isSoon }
 *   A row with isSoon true renders disabled with the Soon chip and
 *   title "Not available yet"; it never navigates.
 *
 * @typedef {Object} KitGlobalSearchViewProps
 * @property {string} value the typed query
 * @property {string} placeholder field placeholder, "Search..." at
 *   every width (RULED, follow-up 1, 10 Sep 2026)
 * @property {string} ariaLabel accessible name of the field and the
 *   phone sheet, "Search"
 * @property {boolean} isOpen whether the panel or sheet is showing
 * @property {boolean} isPhoneWidth under 700px the panel is a sheet
 *   at about 80 percent of the viewport with the input pinned at the
 *   top; 700 and up it is a popover directly below the field whose
 *   list caps at about five rows plus a section title (follow-up 1,
 *   10 Sep 2026). Both caps are defined once in
 *   kitGlobalSearchLayout.js; the View carries no height literal.
 * @property {import("react").RefObject|null} rootRef outside-click
 *   boundary, ViewModel-owned
 * @property {import("react").RefObject|null} inputRef the field,
 *   refocused after Clear
 * @property {string} listboxId id of the results listbox, referenced
 *   by the field's aria-controls
 * @property {string|null} activeRowId id of the keyboard-active row
 *   (aria-activedescendant), null when none
 * @property {Array<{id: string, key: string, label: string, description: string}>} suggestions
 *   prefix suggestion rows, shown when the query asks for them
 * @property {Array<{id: string, title: string, status: string, errorMessage: string, isSoon: boolean, rows: Array<Object>}>} sections
 *   the result sections in order; each row is
 *   { id, key, title, subtitle, typeLabel, pageLabel, iconKey, imageSrc, isSoon }
 * @property {"suggestions"|"loading"|"empty"|"results"} panelState
 *   what the panel body shows; "empty" renders copy.empty, which is
 *   "Nothing matches yet." by default
 * @property {Object} copy sentence-case copy: placeholder, ariaLabel,
 *   ownTitle, communityTitle, loading, empty, errorFallback,
 *   soonTitle, soonSectionTitle, clearLabel, sheetTitle. The caller
 *   may pass a partial `copy` object to the ViewModel; it merges over
 *   the defaults
 * @property {(value: string) => void} onChange
 * @property {() => void} onOpen focus or tap opens the panel
 * @property {() => void} onClose
 * @property {(event: KeyboardEvent) => void} onInputKeyDown arrows
 *   move, Enter opens the active row, Escape closes
 * @property {(rowId: string) => void} onChooseRow
 * @property {(suggestionId: string) => void} onChooseSuggestion
 * @property {(rowId: string|null) => void} onHoverRow pointer hover
 *   moves the active row so mouse and keyboard agree
 * @property {() => void} onClear clears the typed value
 * @property {string} className extra classes on the root (width and
 *   placement only)
 */

export {};
