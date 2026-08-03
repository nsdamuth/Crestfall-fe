import {
  getAllMarkdownEntries,
  getMarkdownEntryByPath,
} from "@/lib/content";

export function getLocations() {
  return getAllMarkdownEntries("locations").sort(
    (a, b) => (a.sortOrder ?? 999999) - (b.sortOrder ?? 999999)
  );
}

export function getLocationByPath(slugPath) {
  return getMarkdownEntryByPath("locations", slugPath);
}