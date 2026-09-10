// Query grammar for the top bar global search (FE/GLOBAL-SEARCH,
// RULED at the 10 Sep 2026 plan gate, docs/references/global-search/
// NOTES.md). Pure functions, no React, so the ViewModel and the
// diagnostics share one parser.
//
// Grammar:
//   - A scope word as the FIRST word steers the sections: "my" (or
//     "mine") keeps only the user's own items, "community" (or
//     "global") keeps only community items.
//   - A type prefix, one per type, singular, colon-terminated, narrows
//     to one type Discord style: "character: lilith", "story:lilith".
//   - A bare colon, or an unknown word followed by a colon, asks for
//     the prefix suggestions.
//   - Every other word is a search term; a row matches when every
//     term appears in its search text.

export const GLOBAL_SEARCH_SCOPE_ALL = "all";
export const GLOBAL_SEARCH_SCOPE_OWN = "own";
export const GLOBAL_SEARCH_SCOPE_COMMUNITY = "community";

export const GLOBAL_SEARCH_SCOPE_WORDS = Object.freeze({
  my: GLOBAL_SEARCH_SCOPE_OWN,
  mine: GLOBAL_SEARCH_SCOPE_OWN,
  community: GLOBAL_SEARCH_SCOPE_COMMUNITY,
  global: GLOBAL_SEARCH_SCOPE_COMMUNITY,
});

// One entry per searchable type. `key` is the value rows carry,
// `prefix` is the word the user types before the colon, `label` is
// the suggestion row title, `description` its quiet second line.
export const GLOBAL_SEARCH_TYPES = Object.freeze([
  Object.freeze({ key: "character", prefix: "character", label: "character:", description: "Characters only" }),
  Object.freeze({ key: "player", prefix: "player", label: "player:", description: "Player characters only" }),
  Object.freeze({ key: "pose", prefix: "pose", label: "pose:", description: "Poses only" }),
  Object.freeze({ key: "outfit", prefix: "outfit", label: "outfit:", description: "Outfits only" }),
  Object.freeze({ key: "location", prefix: "location", label: "location:", description: "Locations only" }),
  Object.freeze({ key: "preset", prefix: "preset", label: "preset:", description: "Image presets only" }),
  Object.freeze({ key: "story", prefix: "story", label: "story:", description: "Stories only" }),
  Object.freeze({ key: "adventure", prefix: "adventure", label: "adventure:", description: "Adventures only" }),
  Object.freeze({ key: "creator", prefix: "creator", label: "creator:", description: "Creators only" }),
  Object.freeze({ key: "lore", prefix: "lore", label: "lore:", description: "Lore and timelines only" }),
  Object.freeze({ key: "media", prefix: "media", label: "media:", description: "Generated images and video only" }),
]);

const TYPE_BY_PREFIX = Object.freeze(
  Object.fromEntries(GLOBAL_SEARCH_TYPES.map((type) => [type.prefix, type]))
);

const TYPE_BY_KEY = Object.freeze(
  Object.fromEntries(GLOBAL_SEARCH_TYPES.map((type) => [type.key, type]))
);

export function getGlobalSearchType(typeKey) {
  return TYPE_BY_KEY[String(typeKey || "").toLowerCase()] || null;
}

// Lowercase, collapse whitespace, drop empties: one normalizer for
// the row search text and for the typed terms so they always compare
// the same way.
export function normalizeGlobalSearchText(...parts) {
  return parts
    .flat()
    .map((part) => String(part ?? "").toLowerCase().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

function splitWords(rawValue) {
  return String(rawValue ?? "").trim().split(/\s+/).filter(Boolean);
}

export function parseGlobalSearchQuery(rawValue = "") {
  const words = splitWords(rawValue);
  let scope = GLOBAL_SEARCH_SCOPE_ALL;
  let type = null;
  let wantsSuggestions = false;
  const terms = [];

  words.forEach((word, index) => {
    const lower = word.toLowerCase();

    if (index === 0 && GLOBAL_SEARCH_SCOPE_WORDS[lower]) {
      scope = GLOBAL_SEARCH_SCOPE_WORDS[lower];
      return;
    }

    const colonMatch = lower.match(/^([a-z]*):(.*)$/);
    if (colonMatch) {
      const stem = colonMatch[1];
      const rest = colonMatch[2];
      const known = TYPE_BY_PREFIX[stem];

      if (known && !type) {
        type = known.key;
        if (rest) terms.push(rest);
        return;
      }
      if (!rest) {
        wantsSuggestions = true;
        return;
      }
    }

    terms.push(lower);
  });

  return {
    scope,
    type,
    terms,
    wantsSuggestions,
    isEmpty: words.length === 0,
    hasQuery: terms.length > 0 || type !== null || scope !== GLOBAL_SEARCH_SCOPE_ALL,
  };
}

// Replaces the word that asked for suggestions (the last bare or
// unknown colon word) with the chosen prefix, keeping everything else
// the user typed, and leaves the caret after a trailing space so the
// next keystroke is the search term.
export function applyGlobalSearchPrefix(rawValue = "", typeKey = "") {
  const type = getGlobalSearchType(typeKey);
  if (!type) return String(rawValue ?? "");

  const words = splitWords(rawValue);
  let index = -1;
  for (let i = words.length - 1; i >= 0; i -= 1) {
    if (/^[a-z]*:$/i.test(words[i]) && !TYPE_BY_PREFIX[words[i].slice(0, -1).toLowerCase()]) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    words[index] = `${type.prefix}:`;
  } else {
    words.push(`${type.prefix}:`);
  }

  return `${words.join(" ")} `;
}

function rankRow(row, terms) {
  const title = normalizeGlobalSearchText(row?.title);
  if (!terms.length) return 2;
  if (title.startsWith(terms[0])) return 0;
  if (terms.some((term) => title.includes(term))) return 1;
  return 2;
}

// Filters and ranks rows for one section. Rows carry `scope`
// ("own" | "community"), `type` (a GLOBAL_SEARCH_TYPES key), `title`,
// and `searchText` (already normalized). Ranking: title starts with
// the first term, then title contains a term, then any match; ties
// keep the source order, which every list route already sorts by
// recency.
export function filterGlobalSearchRows(rows = [], parsed = null, { limit = 40 } = {}) {
  const query = parsed || parseGlobalSearchQuery("");
  const matched = [];

  (Array.isArray(rows) ? rows : []).forEach((row, sourceIndex) => {
    if (!row) return;
    if (query.type && row.type !== query.type) return;
    const haystack = row.searchText || normalizeGlobalSearchText(row.title, row.subtitle);
    if (!query.terms.every((term) => haystack.includes(term))) return;
    matched.push({ row, rank: rankRow(row, query.terms), sourceIndex });
  });

  matched.sort((a, b) => a.rank - b.rank || a.sourceIndex - b.sourceIndex);

  return matched.slice(0, limit).map((entry) => entry.row);
}
