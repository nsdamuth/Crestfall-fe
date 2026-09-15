// Media history visibility rules, pure and React-free (ASSET-FOLDERS
// plan, package AF5, 14 Sep 2026). The filter model and the two
// list steps that need no search text live here so the grid
// diagnostics can run them: the Library filter (one media pick
// combined with any number of activity flags, 1.4.0) and, after it,
// folder membership (surface MEDIA, the browser-local folder store).
// The two compose as one AND and never conflict: a folder holding an
// image and a video with the Videos filter on yields only the video.
// The ViewModel re-exports the model helpers under their existing
// names (contract law) and adds the search step on top.

export const MEDIA_FILTER_VALUES = ["ALL", "IMAGES", "VIDEOS"];
export const ACTIVITY_FILTER_VALUES = ["LIKED", "BOOKMARKED"];

// Two-section filter model (1.4.0, 6 Sep 2026, FE/FILTERS): one media
// pick (All clears it) combined with any number of activity flags.
// The legacy single string ("ALL" | "IMAGES" | "VIDEOS" | "LIKED" |
// "BOOKMARKED") still resolves so the older header keeps working.
export function normalizeMediaFilterModel(activeFilter) {
  if (activeFilter && typeof activeFilter === "object") {
    const media = MEDIA_FILTER_VALUES.includes(activeFilter.media) ? activeFilter.media : "ALL";
    const activity = Array.isArray(activeFilter.activity)
      ? activeFilter.activity.filter((value) => ACTIVITY_FILTER_VALUES.includes(value))
      : [];
    return { media, activity };
  }
  if (ACTIVITY_FILTER_VALUES.includes(activeFilter)) return { media: "ALL", activity: [activeFilter] };
  if (MEDIA_FILTER_VALUES.includes(activeFilter)) return { media: activeFilter, activity: [] };
  return { media: "ALL", activity: [] };
}

// The Library step alone: the media pick, then the activity flags.
export function applyLibraryFilter(items, activeFilter) {
  const { media, activity } = normalizeMediaFilterModel(activeFilter);
  let filtered = items;

  if (media === "IMAGES") {
    filtered = filtered.filter((item) => item.type !== "VIDEO");
  } else if (media === "VIDEOS") {
    filtered = filtered.filter((item) => item.type === "VIDEO");
  }
  if (activity.length) {
    filtered = filtered.filter(
      (item) =>
        (activity.includes("LIKED") && item.liked) ||
        (activity.includes("BOOKMARKED") && item.bookmarked)
    );
  }

  return filtered;
}

// The folder step: null (no folder chosen, the root row All) leaves
// the list alone; otherwise only items filed in the folder remain.
// Membership is keyed on the item's image output id, the same id the
// selection and the reactions key on.
export function applyFolderFilter(items, folderItemIds = null) {
  if (folderItemIds === null || folderItemIds === undefined) return items;
  const members = folderItemIds instanceof Set ? folderItemIds : new Set(folderItemIds);
  return items.filter((item) => members.has(item.imageOutputId || item.id));
}

// Library, then folder. The order is the ruled reading (AF5 item 2);
// as an AND the result is the same either way.
export function applyMediaHistoryFilters(items, activeFilter, folderItemIds = null) {
  return applyFolderFilter(applyLibraryFilter(items, activeFilter), folderItemIds);
}
