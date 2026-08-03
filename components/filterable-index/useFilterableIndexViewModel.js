"use client";

import { useCallback, useMemo } from "react";

function resolveAssetPath(assetBase, value) {
  if (!value) return value;
  if (value.startsWith("/")) return value;
  if (!assetBase) return value;
  return `${assetBase}/${value}`;
}

function normalize(value) {
  return String(value ?? "").toLowerCase();
}

function getUniqueValues(entries, key) {
  return Array.from(
    new Set(entries.map((entry) => entry[key]).flat().filter(Boolean))
  ).sort();
}

function getAllTags(entries) {
  return Array.from(new Set(entries.flatMap((entry) => entry.tags ?? []))).sort();
}

function entryMatchesFilter(entry, key, value) {
  if (!value || value === "all") return true;

  const fieldValue = entry[key];
  const normalizedValue = normalize(value);

  if (Array.isArray(fieldValue)) {
    return fieldValue.some((item) => normalize(item) === normalizedValue);
  }

  return normalize(fieldValue) === normalizedValue;
}

function entryMatchesSearch(entry, search) {
  if (!search.trim()) return true;

  const haystack = [
    entry.title,
    entry.eyebrow,
    entry.cardText,
    entry.subtitle,
    entry.realm,
    entry.race,
    entry.gender,
    ...(entry.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  return normalize(haystack).includes(normalize(search));
}

function projectCard(entry) {
  return {
    key: entry.slug,
    eyebrow: entry.eyebrow,
    title: entry.title,
    text: entry.cardText ?? entry.subtitle,
    href: entry.slug,
    image: resolveAssetPath(entry.assetBase, entry.profileImage),
    imageAlt: entry.title,
  };
}

export default function useFilterableIndexViewModel({
  entries = [],
  filters = [],
  emptyText = "No matching records found.",
  pathname = "",
  queryString = "",
  onReplaceUrl,
}) {
  const search = useMemo(() => {
    const params = new URLSearchParams(queryString);
    return params.get("q") ?? "";
  }, [queryString]);

  const activeTags = useMemo(() => {
    const params = new URLSearchParams(queryString);
    const tags = params.get("tags");

    return tags ? tags.split(",").filter(Boolean) : [];
  }, [queryString]);

  const activeFilters = useMemo(() => {
    const params = new URLSearchParams(queryString);
    const values = {};

    filters.forEach((filter) => {
      const value = params.get(filter.key);
      if (value) values[filter.key] = value;
    });

    return values;
  }, [filters, queryString]);

  const updateUrl = useCallback(
    (nextValues) => {
      const params = new URLSearchParams(queryString);

      Object.entries(nextValues).forEach(([key, value]) => {
        if (!value || value === "all" || value.length === 0) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();
      onReplaceUrl?.(query ? `${pathname}?${query}` : pathname);
    },
    [onReplaceUrl, pathname, queryString]
  );

  const filteredBeforeTags = useMemo(
    () =>
      entries.filter((entry) => {
        const matchesSearch = entryMatchesSearch(entry, search);
        const matchesDropdowns = filters.every((filter) =>
          entryMatchesFilter(entry, filter.key, activeFilters[filter.key])
        );

        return matchesSearch && matchesDropdowns;
      }),
    [activeFilters, entries, filters, search]
  );

  const visibleTags = useMemo(
    () => getAllTags(filteredBeforeTags),
    [filteredBeforeTags]
  );

  const filteredEntries = useMemo(() => {
    if (activeTags.length === 0) return filteredBeforeTags;

    return filteredBeforeTags.filter((entry) =>
      activeTags.every((tag) =>
        entry.tags?.some((entryTag) => normalize(entryTag) === normalize(tag))
      )
    );
  }, [activeTags, filteredBeforeTags]);

  const filterOptions = useMemo(
    () =>
      filters.map((filter) => ({
        key: filter.key,
        label: filter.label,
        value: activeFilters[filter.key] ?? "all",
        values: getUniqueValues(entries, filter.key),
      })),
    [activeFilters, entries, filters]
  );

  const tags = useMemo(
    () =>
      visibleTags.map((tag) => ({
        value: tag,
        isActive: activeTags.some(
          (activeTag) => normalize(activeTag) === normalize(tag)
        ),
      })),
    [activeTags, visibleTags]
  );

  const cards = useMemo(() => filteredEntries.map(projectCard), [filteredEntries]);

  return {
    search,
    filterOptions,
    tags,
    allTagsActive: activeTags.length === 0,
    cards,
    emptyText,
    onSearchChange: (value) => updateUrl({ q: value, tags: [] }),
    onClearSearch: () => updateUrl({ q: "", tags: [] }),
    onFilterChange: (key, value) => updateUrl({ [key]: value, tags: [] }),
    onClearFilters: () => onReplaceUrl?.(pathname),
    onSelectAllTags: () => updateUrl({ tags: [] }),
    onToggleTag: (tag) => {
      const nextTags = activeTags.includes(tag)
        ? activeTags.filter((item) => item !== tag)
        : [...activeTags, tag];

      updateUrl({ tags: nextTags });
    },
  };
}

export {
  entryMatchesFilter,
  entryMatchesSearch,
  getAllTags,
  getUniqueValues,
  normalize,
  projectCard,
  resolveAssetPath,
};
