import {
  getAllMarkdownEntries,
  getMarkdownEntryByPath,
} from "@/lib/content";

export function getCharacters() {
  return getAllMarkdownEntries("characters").sort(
    (a, b) => (a.sortOrder ?? 999999) - (b.sortOrder ?? 999999)
  );
}

export function getCharacterByPath(slugPath) {
  return getMarkdownEntryByPath("characters", slugPath);
}