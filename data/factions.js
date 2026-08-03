import {
  getAllMarkdownEntries,
  getMarkdownEntryByPath,
} from "@/lib/content";

export function getFactions() {
  return getAllMarkdownEntries("factions").sort(
    (a, b) => (a.sortOrder ?? 999999) - (b.sortOrder ?? 999999)
  );
}

export function getFactionByPath(slugPath) {
  return getMarkdownEntryByPath("factions", slugPath);
}