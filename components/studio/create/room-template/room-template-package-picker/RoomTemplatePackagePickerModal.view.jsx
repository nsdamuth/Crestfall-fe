"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search, Sparkles, Theater, Users, X } from "lucide-react";

const ICONS = {
  characters: Users,
  scenario: BookOpen,
  narrator: Theater,
  location: Sparkles,
  players: Users,
};

export default function RoomTemplatePackagePickerModalView({
  eyebrow = "Story Picker",
  title = "Select Reference",
  description = "Choose from your available Crestfall creations.",
  iconName = "characters",
  items = [],
  selectedIds = [],
  recommendedIds = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No references found.",
  onClose = null,
  onChooseItem = null,
}) {
  const [query, setQuery] = useState("");
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const recommendedIdSet = useMemo(
    () => new Set(recommendedIds),
    [recommendedIds]
  );

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return items;

    return items.filter((item) =>
      [item?.title, item?.subtitle, item?.type, item?.contentRating]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [items, query]);

  const Icon = ICONS[iconName] || Users;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              <Icon size={15} />
              {eyebrow}
            </p>

            <h2 className="mt-2 font-display text-4xl">{title}</h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          <div className="mt-5 grid max-h-[62vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.length ? (
              filteredItems.map((item) => {
                const recommended = recommendedIdSet.has(item.id);
                const active = selectedIdSet.has(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChooseItem?.(item.id)}
                    className={`overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1 ${
                      active
                        ? "border-[var(--muted-gold)]/65 bg-[var(--muted-gold)]/15"
                        : "border-white/10 bg-black/35 hover:border-[var(--muted-gold)]/35"
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title || "Picker option"}
                          className="h-full w-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-4 text-center text-xs text-[var(--muted)]">
                          Image preview unavailable
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="font-display text-2xl leading-none text-[var(--foreground)]">
                        {item.title || "Untitled Reference"}
                      </p>

                      {item.subtitle ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
                          {item.subtitle}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.contentRating ? (
                          <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]">
                            {item.contentRating}
                          </span>
                        ) : null}
                        {recommended ? (
                          <span className="rounded-full border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--muted-gold)]">
                            Recommended
                          </span>
                        ) : null}
                        {active ? (
                          <span className="rounded-full border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--muted-gold)]">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
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
      </section>
    </div>
  );
}
