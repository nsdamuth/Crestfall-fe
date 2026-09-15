// Vault visibility (ASSET-FOLDERS plan, package AF6, 14 Sep 2026): the
// pure filter the Vault page runs over its items, React-free so the
// diagnostics run the composition. The steps, in order: the catalog
// type filter, Visibility, Status, the search query, then the sort,
// and last the folder membership (the folder's own items plus its
// sub-folders', the same reading as the Folders panel's row count).
// Membership composes with every earlier step: a folder holding a
// private and a public creation with Visibility set to Private yields
// the private one alone, in the chosen sort's order.
import {
  getCatalogCreationType,
  getCatalogTags,
  getSelectedCatalogCreationTypes,
} from "../catalog/creationCatalogFilterTaxonomy.js";

// Visibility badge label per the product model's ruled four-state
// enum (section 5). Canon items carry the Canon badge instead of a
// visibility badge (tag economy 2.16(c): Canon always informs).
export const VISIBILITY_LABELS = Object.freeze({
  PRIVATE: "Private",
  INTERNAL: "Internal",
  PUBLIC: "Public",
});

// Sort vocabulary, RULED 6 Sep 2026 (FE/FILTERS, Brian): Plays, Likes,
// Remixes, Newest; Saves retired. Remixes leaves the list in its
// current order until the payload carries a remix count (CR-059).
export function sortVaultItems(items, sort) {
  const sorted = [...items];
  if (sort === "popular") {
    sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0));
  } else if (sort === "hearts") {
    sorted.sort((a, b) => (b.hearts || 0) - (a.hearts || 0));
  } else if (sort === "recent") {
    sorted.sort((a, b) => b.recency - a.recency);
  }
  return sorted;
}

export function matchesVaultFilters(item, { query = "", selectedValues = {} } = {}) {
  const types = getSelectedCatalogCreationTypes(selectedValues);
  const visibilities = selectedValues.visibility || [];
  const statuses = selectedValues.status || [];
  const itemType = getCatalogCreationType(item);
  const itemStatus = String(item.status || "").trim().toUpperCase();
  const itemTags = getCatalogTags(item);

  if (types.length && !types.includes(itemType)) return false;
  if (visibilities.length && !visibilities.includes(item.visibility)) return false;
  if (statuses.length && (!item.isOwn || !statuses.includes(itemStatus))) return false;

  const haystack = `${item.title} ${item.subtitle} ${item.description || ""} ${
    VISIBILITY_LABELS[item.visibility] || ""
  } ${itemStatus} ${itemTags.join(" ")}`.toLowerCase();
  if (query && !haystack.includes(query)) return false;
  return true;
}

// folderItemIds: null at the root row All (no membership step); an
// array of item ids once a folder is chosen, an empty array showing
// nothing.
export function filterVaultItems(
  items,
  { query = "", selectedValues = {}, sort = "recent", folderItemIds = null } = {}
) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const filtered = (Array.isArray(items) ? items : []).filter((item) =>
    matchesVaultFilters(item, { query: normalizedQuery, selectedValues })
  );
  const sorted = sortVaultItems(filtered, sort);
  if (!Array.isArray(folderItemIds)) return sorted;
  const members = new Set(folderItemIds.map((id) => String(id)));
  return sorted.filter((item) => members.has(String(item.id)));
}
