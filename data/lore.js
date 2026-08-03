import {
  getAllMarkdownEntries,
  getMarkdownEntryByPath,
} from "@/lib/content";

export function getLoreEntries() {
  return getAllMarkdownEntries("lore").sort(
    (a, b) => (a.timelineOrder ?? 999999) - (b.timelineOrder ?? 999999)
  );
}

export function getLoreArcGroups() {
  const entries = getLoreEntries();

  const groups = entries.reduce((acc, entry) => {
    const arc = entry.arc ?? "uncategorized";
    const arcLabel = entry.arcLabel ?? "Uncategorized Records";

    if (!acc[arc]) {
      acc[arc] = {
        id: arc,
        label: arcLabel,
        entries: [],
      };
    }

    acc[arc].entries.push(entry);
    return acc;
  }, {});

  return Object.values(groups);
}

export function getLoreEntryByPath(slugPath) {
  return getMarkdownEntryByPath("lore", slugPath);
}