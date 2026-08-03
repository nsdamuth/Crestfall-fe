"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export default function CreationPickerPanelView({
  items = [],
  selectedIds = [],
  disabledIds = [],
  recommendedIds = [],
  searchPlaceholder = "Search creations...",
  emptyMessage = "No creations found.",
  actions = null,
  gridClassName = "max-h-[46vh] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  onSelect,
}) {
  const [query, setQuery] = useState("");

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const disabledIdSet = useMemo(() => new Set(disabledIds), [disabledIds]);
  const recommendedIdSet = useMemo(
    () => new Set(recommendedIds),
    [recommendedIds]
  );

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((item) => {
      if (!normalized) return true;

      return [
        item.title,
        item.subtitle,
        item.description,
        item.type,
        item.contentRating,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [items, query]);

  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
        <Search size={16} className="text-[var(--muted-gold)]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
        />
      </div>

      {actions ? <div className="mt-5">{actions}</div> : null}

      <div className={`mt-5 grid gap-3 overflow-y-auto pr-1 ${gridClassName}`}>
        {filteredItems.length ? (
          filteredItems.map((item) => {
            const selected = selectedIdSet.has(item.id);
            const disabled = disabledIdSet.has(item.id);
            const recommended = recommendedIdSet.has(item.id);

            return (
              <CreationPickerCard
                key={item.id}
                item={item}
                selected={selected}
                disabled={disabled}
                recommended={recommended}
                onSelect={onSelect}
              />
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <p className="text-sm leading-6 text-[var(--muted)]">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CreationPickerCard({ item, selected, disabled, recommended, onSelect }) {
  const initial = (item.title || item.type || "C").slice(0, 1).toUpperCase();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect?.(item)}
      className={`overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${
        selected
          ? "border-[var(--muted-gold)]/65 bg-[var(--muted-gold)]/15"
          : "border-white/10 bg-black/35 hover:border-[var(--muted-gold)]/35"
      }`}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover opacity-90"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <p className="font-display text-3xl text-[var(--muted-gold)]">
                {initial}
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
                {item.type}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="line-clamp-2 font-display text-xl leading-none text-[var(--foreground)]">
          {item.title}
        </p>

        {item.subtitle || item.description ? (
          <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[var(--muted)]">
            {item.subtitle || item.description}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.type ? (
            <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
              {item.type}
            </span>
          ) : null}

          {item.contentRating ? (
            <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
              {item.contentRating}
            </span>
          ) : null}
          {recommended ? (
            <span className="rounded-full border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--muted-gold)]">
              Recommended
            </span>
          ) : null}
          {selected ? (
            <span className="rounded-full border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--muted-gold)]">
              Selected
            </span>
          ) : null}

          {disabled ? (
            <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
              Already added
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
